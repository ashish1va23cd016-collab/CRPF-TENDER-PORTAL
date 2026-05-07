"""FastAPI routes for the prototype.

Endpoints:
- POST /api/upload_tender -> accepts PDF, returns tender_id + extracted criteria
- POST /api/upload_bidder -> accepts PDF, returns bidder_id + extracted bidder data
- POST /api/compare -> compare two IDs and return decision + explanation + confidence
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, Any

from .parsers import extract_text_from_document_bytes
from .ai_client import (
    extract_bidder_structured,
    llm_generate_explanation,
    rule_based_evaluate,
    extract_document_bundle,
    generate_chat_response,
)
from . import utils
from .models import (
    ExtractCriteriaRequest,
    ExtractBidderRequest,
    EvaluateRequest,
    EvaluateResponse,
    DocumentData,
    BidderInfo,
    ChatRequest,
)

router = APIRouter()


@router.post("/upload_tender")
async def upload_tender(file: UploadFile = File(...)):
    """Accept a Tender PDF or DOCX file, extract text, and return it."""
    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are accepted")

    contents = await file.read()
    text = extract_text_from_document_bytes(contents, file.filename)
    # Store raw text for later retrieval if needed
    doc_id = utils.store_tender(text, [])
    return JSONResponse({"tender_id": doc_id, "text": text})


@router.post("/extract_criteria")
async def extract_criteria(req: ExtractCriteriaRequest):
    """Input: tender text. Returns mandatory criteria plus supporting information."""
    text = req.text
    bundle = extract_document_bundle(text)
    criteria = bundle.get("criteria", [])
    supporting_info = bundle.get("supporting_info", [])
    return JSONResponse({"criteria": criteria, "supporting_info": supporting_info})


@router.post("/upload_bidder")
async def upload_bidder(file: UploadFile = File(...)):
    """Accept a bidder PDF or DOCX file, extract text and return it."""
    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are accepted")

    contents = await file.read()
    text = extract_text_from_document_bytes(contents, file.filename)
    doc_id = utils.store_bidder(text, [])
    return JSONResponse({"bidder_id": doc_id, "text": text})


@router.post("/extract_bidder_data")
async def extract_bidder_data(req: ExtractBidderRequest):
    """Input: bidder text. Extract turnover, certifications, experience."""
    data = extract_bidder_structured(req.text)
    return JSONResponse({"bidder": data})


@router.post("/evaluate")
async def evaluate(req: EvaluateRequest):
    """Input: criteria JSON + bidder JSON. Returns decision, confidence, reasons.

    This endpoint applies rule-based checks (implemented in `ai_client.evaluate_criteria`).
    An AI-based comparison hook can be added where indicated.
    """
    criteria = [c.dict() for c in req.criteria]
    bidder = req.bidder.dict()

    # Rule-based evaluation
    rule_decision, rule_conf, rule_reasons, rule_evidence, comparisons = rule_based_evaluate(criteria, bidder)

    # AI-generated explanation layer. The final decision still comes from rules.
    final_reasons = rule_reasons
    final_evidence = rule_evidence

    try:
        ai_explanation = llm_generate_explanation(criteria, bidder, rule_decision, rule_reasons, rule_evidence)
    except Exception:
        ai_explanation = None

    if ai_explanation and isinstance(ai_explanation, dict):
        ai_reasons = ai_explanation.get("explanation") or []
        ai_evidence = ai_explanation.get("evidence_summary") or []
        final_reasons = list(dict.fromkeys(ai_reasons + rule_reasons))
        final_evidence = list(dict.fromkeys(rule_evidence + ai_evidence))

    resp = EvaluateResponse(decision=rule_decision, confidence=rule_conf, reasons=final_reasons, evidence=final_evidence, comparisons=comparisons)
    return JSONResponse(resp.dict())


@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    """Input: chat messages + document context. Returns AI response."""
    messages_list = [m.dict() for m in req.messages]
    response_text = generate_chat_response(messages_list, req.tender_text, req.bidder_text)
    return JSONResponse({"response": response_text})
