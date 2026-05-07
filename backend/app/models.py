from pydantic import BaseModel
from typing import List, Optional


# Structured criterion spec returned by the extractor
class CriterionSpec(BaseModel):
    criterion: str
    type: str  # e.g. 'numeric', 'certification', 'text'
    threshold: Optional[float] = None
    unit: Optional[str] = None


class DocumentData(BaseModel):
    doc_id: str
    text: str
    extracted: Optional[List[dict]] = []


class BidderInfo(BaseModel):
    turnover: Optional[float] = None  # value in lakhs (L) unless otherwise noted
    certifications: List[str] = []
    experience_years: Optional[float] = None
    raw_excerpts: Optional[List[str]] = []


class ComparisonRow(BaseModel):
    requirement: str
    bidder_value: str
    status: str
    tone: str
    icon: str
    detail: Optional[str] = ""


class ExtractCriteriaRequest(BaseModel):
    text: str


class ExtractBidderRequest(BaseModel):
    text: str


class EvaluateRequest(BaseModel):
    criteria: List[CriterionSpec]
    bidder: BidderInfo


class EvaluateResponse(BaseModel):
    decision: str
    confidence: float
    reasons: List[str]
    evidence: Optional[List[str]] = []
    comparisons: Optional[List[ComparisonRow]] = []


class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    tender_text: Optional[str] = ""
    bidder_text: Optional[str] = ""
