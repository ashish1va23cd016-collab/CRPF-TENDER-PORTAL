"""AI extraction client.

This module uses OpenAI or Claude when credentials are available, falls back to
heuristics or mock demo data when calls fail, and keeps rule-based decisioning as
the final authority.
"""
import os
import re
import json
import time
from pathlib import Path
from typing import List, Dict, Optional
import requests

try:
    import google.generativeai as genai
except Exception:
    genai = None


MOCK_CRITERIA = [
    {"criterion": "Minimum Turnover: 50 Lakhs", "type": "numeric", "threshold": 50.0, "unit": "L"},
    {"criterion": "ISO 9001 Certification Required", "type": "certification", "threshold": None, "unit": None},
    {"criterion": "Minimum 5 years experience", "type": "experience", "threshold": 5.0, "unit": "years"},
]

MOCK_BIDDER = {
    "turnover": 65.0,
    "certifications": ["ISO 9001:2015"],
    "experience_years": 8.0,
    "raw_excerpts": [
        "Financial statement shows 65L turnover",
        "ISO certificate attached",
        "Years of experience: 8",
    ],
}

_MANDATORY_MARKERS = (
    "must",
    "required",
    "minimum",
    "minimum of",
    "at least",
    "not less than",
    "shall",
    "mandatory",
)

_SUPPORTING_HINTS = (
    "certified by",
    "certificate valid until",
    "valid until",
    "chartered accountant",
    "audited by",
    "issued by",
    "attached",
    "copy enclosed",
    "supporting",
    "note:",
    "remarks",
)

_CRITERION_DOMAIN_HINTS = (
    "turnover",
    "revenue",
    "financial",
    "certif",
    "iso",
    "registration",
    "experience",
    "years",
)

_GEMINI_MODEL_NAME = "gemini-1.5-flash"
_GEMINI_MODEL = None


def _load_local_env_file() -> None:
    """Load key=value pairs from a local .env file without extra dependencies."""
    candidate_paths = [
        Path(__file__).resolve().parents[1] / ".env",
        Path.cwd() / ".env",
    ]
    for env_path in candidate_paths:
        if not env_path.exists() or not env_path.is_file():
            continue
        try:
            for raw_line in env_path.read_text(encoding="utf-8").splitlines():
                line = raw_line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                if key and key not in os.environ:
                    os.environ[key] = value
        except Exception:
            # Never let a bad .env file break the app.
            continue
        break


_load_local_env_file()


def _parse_number_with_units(s: str):
    """Parse numbers with common Indian units like L (lakh) and Cr (crore).

    Returns a float representing value in lakhs (L). Example: '2 Cr' -> 20000 (lakhs)
    """
    s = s.replace(",", "")
    m = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*(l|lakhs?|lakh|lac|cr|crore|m|mn|million)?", s, re.I)
    if not m:
        return None
    val = float(m.group(1))
    unit = (m.group(2) or "").lower()
    if unit.startswith("cr"):
        return val * 10000.0  # 1 crore = 100 lakhs
    if unit.startswith("m") or unit.startswith("million"):
        return val * 100.0  # 1 million ~= 100 lakhs (approx)
    # lakh variants
    return val


def _demo_criteria() -> List[Dict]:
    return [dict(item) for item in MOCK_CRITERIA]


def _demo_bidder() -> Dict:
    return dict(MOCK_BIDDER)


def _normalize_text(value) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    return str(value).strip()


def _is_mandatory_requirement(line: str) -> bool:
    lower = line.lower()
    if not any(marker in lower for marker in _MANDATORY_MARKERS):
        return False
    return any(domain in lower for domain in _CRITERION_DOMAIN_HINTS)


def _is_supporting_line(line: str) -> bool:
    lower = line.lower()
    if _is_mandatory_requirement(line):
        return False
    return any(hint in lower for hint in _SUPPORTING_HINTS)


def _classify_criterion_line(line: str) -> Optional[Dict]:
    cleaned = _normalize_text(line)
    if not cleaned or not _is_mandatory_requirement(cleaned):
        return None

    lower = cleaned.lower()
    if any(term in lower for term in ("turnover", "revenue", "financial")):
        threshold = _parse_number_with_units(cleaned)
        if threshold is None:
            return None
        return {
            "criterion": cleaned,
            "type": "numeric",
            "threshold": threshold,
            "unit": "L",
        }

    if any(term in lower for term in ("certif", "iso", "registration")):
        return {
            "criterion": cleaned,
            "type": "certification",
            "threshold": None,
            "unit": None,
        }

    if any(term in lower for term in ("experience", "years")):
        threshold = _parse_number_with_units(cleaned)
        if threshold is None:
            return None
        return {
            "criterion": cleaned,
            "type": "experience",
            "threshold": threshold,
            "unit": "years",
        }

    return None


def extract_document_bundle(text: str) -> Dict[str, List]:
    """Extract mandatory criteria and supporting information from tender text."""
    prompt = (
        "Separate mandatory eligibility criteria from supporting information. "
        "Only treat lines containing words like must, required, minimum, at least, shall, or mandatory as eligibility criteria. "
        "Ignore descriptive/supporting lines such as 'Certified by Chartered Accountant' or 'Certificate valid until...'. "
        "Return strict JSON only with keys: mandatory_criteria (array) and supporting_information (array). "
        "Each mandatory criterion should be an object with keys criterion, type, threshold, and unit.\n\n"
        f"Tender text:\n{text}"
    )
    parsed = call_llm_for_json(prompt, prefer="gemini")
    if isinstance(parsed, dict):
        mandatory = parsed.get("mandatory_criteria") or parsed.get("criteria") or []
        supporting = parsed.get("supporting_information") or parsed.get("supporting_info") or []
        normalized_criteria = []
        normalized_supporting = []
        for entry in mandatory:
            if isinstance(entry, dict):
                criterion = _classify_criterion_line(entry.get("criterion", ""))
                if criterion:
                    normalized_criteria.append(criterion)
            else:
                criterion = _classify_criterion_line(_normalize_text(entry))
                if criterion:
                    normalized_criteria.append(criterion)
        for entry in supporting:
            value = _normalize_text(entry.get("text") if isinstance(entry, dict) else entry)
            if value:
                normalized_supporting.append(value)
        if normalized_criteria or normalized_supporting:
            deduped_supporting = list(dict.fromkeys(normalized_supporting))
            return {"criteria": normalized_criteria, "supporting_info": deduped_supporting}

    lines = [l.strip() for l in re.split(r"[\r\n]+", text) if l.strip()]
    criteria = []
    supporting_info = []
    for line in lines:
        if _is_mandatory_requirement(line):
            criterion = _classify_criterion_line(line)
            if criterion:
                criteria.append(criterion)
        elif _is_supporting_line(line):
            supporting_info.append(_normalize_text(line))

    # Preserve only meaningful supporting notes; ignore obvious noise.
    supporting_info = [s for s in supporting_info if len(s) > 4]
    deduped_criteria = []
    seen = set()
    for item in criteria:
        marker = json.dumps(item, sort_keys=True)
        if marker in seen:
            continue
        seen.add(marker)
        deduped_criteria.append(item)

    return {
        "criteria": deduped_criteria,
        "supporting_info": list(dict.fromkeys(supporting_info)),
    }


def _safe_json(text: Optional[str]) -> Optional[object]:
    if not text:
        return None
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned, flags=re.I)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    parsed = _extract_json_from_text(cleaned)
    return parsed


def _get_gemini_model():
    global _GEMINI_MODEL
    if _GEMINI_MODEL is not None:
        return _GEMINI_MODEL
    key = os.getenv("GEMINI_API_KEY")
    if not key or genai is None:
        return None
    genai.configure(api_key=key)
    _GEMINI_MODEL = genai.GenerativeModel(_GEMINI_MODEL_NAME)
    return _GEMINI_MODEL


def call_gemini(prompt: str) -> Optional[str]:
    """Call Gemini and return raw text output, or None on failure."""
    model = _get_gemini_model()
    if model is None:
        return None
    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0,
            },
        )
        text = getattr(response, "text", None)
        if text:
            return text
        candidates = getattr(response, "candidates", None) or []
        for candidate in candidates:
            parts = getattr(candidate, "content", None)
            if parts and getattr(parts, "parts", None):
                joined = "".join(getattr(part, "text", "") or "" for part in parts.parts)
                if joined:
                    return joined
    except Exception:
        return None
    return None


def _provider_priority() -> List[str]:
    provider = (os.getenv("AI_PROVIDER") or "").strip().lower()
    if provider in {"openai", "claude", "anthropic"}:
        return [provider]
    if os.getenv("OPENAI_API_KEY"):
        return ["openai", "claude"]
    if os.getenv("CLAUDE_API_KEY"):
        return ["claude", "openai"]
    return []


def _chat_json_openai(messages: List[Dict[str, str]]) -> Optional[object]:
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        return None
    url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1/chat/completions")
    body = {
        "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        "messages": messages,
        "temperature": 0,
        "response_format": {"type": "json_object"},
    }
    try:
        resp = requests.post(
            url,
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json=body,
            timeout=30,
        )
        if resp.status_code >= 400:
            return None
        content = resp.json().get("choices", [{}])[0].get("message", {}).get("content")
        return _safe_json(content)
    except Exception:
        return None


def _chat_json_claude(messages: List[Dict[str, str]]) -> Optional[object]:
    key = os.getenv("CLAUDE_API_KEY")
    if not key:
        return None
    url = os.getenv("CLAUDE_BASE_URL", "https://api.anthropic.com/v1/messages")
    system_parts = [m["content"] for m in messages if m.get("role") == "system"]
    user_parts = [m["content"] for m in messages if m.get("role") != "system"]
    body = {
        "model": os.getenv("CLAUDE_MODEL", "claude-3-5-sonnet-20240620"),
        "max_tokens": 1200,
        "temperature": 0,
        "system": "\n".join(system_parts) or "You are a JSON extractor. Respond with valid JSON only.",
        "messages": user_parts,
    }
    try:
        resp = requests.post(
            url,
            headers={
                "x-api-key": key,
                "anthropic-version": os.getenv("CLAUDE_VERSION", "2023-06-01"),
                "content-type": "application/json",
            },
            json=body,
            timeout=30,
        )
        if resp.status_code >= 400:
            return None
        data = resp.json()
        text = "".join(part.get("text", "") for part in data.get("content", []) if isinstance(part, dict))
        return _safe_json(text)
    except Exception:
        return None


def _call_ai_json(messages: List[Dict[str, str]], prefer: Optional[str] = None) -> Optional[object]:
    if prefer == "gemini" or os.getenv("GEMINI_API_KEY"):
        prompt = "\n\n".join(f"{m['role'].upper()}: {m['content']}" for m in messages)
        parsed = _safe_json(call_gemini(prompt))
        if parsed is not None:
            return parsed
    providers = _provider_priority()
    if prefer:
        pref = prefer.strip().lower()
        ordered = [pref] + [p for p in providers if p != pref]
    else:
        ordered = providers
    for provider in ordered:
        if provider == "openai":
            parsed = _chat_json_openai(messages)
        else:
            parsed = _chat_json_claude(messages)
        if parsed is not None:
            return parsed
    return None


def extract_criteria_structured(text: str):
    """Attempt to extract structured criteria from tender text.

    Returns a list of dicts: {criterion, type, threshold, unit}
    Uses Gemini or heuristics. Returns only mandatory eligibility criteria.
    """
    bundle = extract_document_bundle(text)
    return bundle.get("criteria", [])


# ------------------ LLM integration helpers ------------------


def _extract_json_from_text(s: str) -> Optional[object]:
    """Find first JSON object/array in text and return parsed object, or None."""
    if not s or not isinstance(s, str):
        return None
    # find first { or [
    idx = None
    for i, ch in enumerate(s):
        if ch in "[{":
            idx = i
            break
    if idx is None:
        return None

    # try to find a balanced JSON substring starting at idx
    stack = []
    pairs = {"{": "}", "[": "]"}
    for j in range(idx, len(s)):
        ch = s[j]
        if ch in pairs:
            stack.append(pairs[ch])
        elif stack and ch == stack[-1]:
            stack.pop()
            if not stack:
                candidate = s[idx : j + 1]
                try:
                    return json.loads(candidate)
                except Exception:
                    # continue searching
                    continue
    # fallback: try to load full text
    try:
        return json.loads(s)
    except Exception:
        return None


def _call_openai_chat(prompt: str, system: str = "You are a helpful assistant.") -> Optional[str]:
    """Call OpenAI Chat Completions API (basic). Returns assistant content or None.

    Requires env `OPENAI_API_KEY`.
    Uses the v1/chat/completions endpoint.
    """
    parsed = _chat_json_openai([
        {"role": "system", "content": system},
        {"role": "user", "content": prompt},
    ])
    if parsed is None:
        return None
    return json.dumps(parsed)


def _call_claude(prompt: str) -> Optional[str]:
    """Call Anthropic/Claude API (basic). Returns text or None.

    Requires env `CLAUDE_API_KEY`.
    Uses the /v1/complete endpoint (Anthropic).
    """
    parsed = _chat_json_claude([
        {"role": "user", "content": prompt},
    ])
    if parsed is None:
        return None
    return json.dumps(parsed)


def call_llm_for_json(prompt: str, prefer: str = "openai") -> Optional[object]:
    """Call an LLM (OpenAI or Claude) with instruction to return JSON only.

    Returns parsed JSON object, or None if call/parse failed.
    """
    system = (
        "You are a JSON extractor. Respond with valid JSON only, and nothing else."
        " Do not include explanatory text, code fences, or commentary."
    )
    if prefer == "gemini" or os.getenv("GEMINI_API_KEY"):
        gemini_text = call_gemini(f"{system}\n\n{prompt}")
        parsed = _safe_json(gemini_text)
        if parsed is not None:
            return parsed
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": prompt},
    ]
    if prefer == "claude":
        messages = messages[1:]
    return _call_ai_json(messages, prefer=prefer)


def llm_extract_criteria(text: str) -> Optional[List[Dict]]:
    """Use LLM to extract criteria as strict JSON list.

    Prompt enforces JSON-only output with fields: criterion, type, threshold (if applicable).
    """
    prompt = (
        "Extract all eligibility criteria from the following tender document.\n"
        "Return structured JSON only as a list of objects. Each object must have keys:\n"
        "- criterion (string)\n"
        "- type (numeric, certification, experience, text)\n"
        "- threshold (numeric) if applicable, otherwise null\n"
        "- unit (string or null)\n\n"
        f"Document:\n{text}"
    )
    parsed = call_llm_for_json(prompt, prefer="gemini")
    if isinstance(parsed, list):
        return parsed
    return None


def llm_extract_bidder(text: str) -> Optional[Dict]:
    """Use LLM to extract bidder info as strict JSON object with turnover, certifications, years_of_experience."""
    prompt = (
        "Extract key bidder information from the following document.\n"
        "Return JSON only with keys: turnover (number, in lakhs), certifications (array of strings), "
        "experience_years (number or null), raw_excerpts (array of strings).\n\n"
        f"Document:\n{text}"
    )
    parsed = call_llm_for_json(prompt, prefer="gemini")
    if isinstance(parsed, dict):
        return parsed
    return None


def llm_generate_explanation(criteria: List[Dict], bidder: Dict, decision: str, reasons: List[str], evidence: List[str]) -> Optional[Dict]:
    """Use AI to turn rule outputs into a polished explanation.

    The rules remain the source of truth; AI only rewrites and organizes the explanation.
    """
    prompt = (
        "Compare criteria and bidder data.\n"
        "Return JSON:\n"
        '{\n  "decision": "",\n  "reasons": [],\n  "confidence": 0.0\n}\n\n'
        "Use the decision already provided. Do not alter it.\n\n"
        f"Decision: {decision}\n"
        f"Reasons: {json.dumps(reasons, ensure_ascii=False)}\n"
        f"Evidence: {json.dumps(evidence, ensure_ascii=False)}\n"
        f"Criteria: {json.dumps(criteria, ensure_ascii=False)}\n"
        f"Bidder: {json.dumps(bidder, ensure_ascii=False)}"
    )
    parsed = call_llm_for_json(prompt, prefer="gemini")
    if isinstance(parsed, dict):
        return parsed
    return None


def llm_evaluate(criteria: List[Dict], bidder: Dict) -> Optional[Dict]:
    """Deprecated for final decisioning.

    Retained for backward compatibility. Final decisioning stays rule-based, but we can
    still ask AI to validate or rewrite the explanation via llm_generate_explanation().
    """
    return None


def rule_based_evaluate(criteria: List[Dict], bidder: Dict):
    """Apply simple rule-based checks.

    Rules:
    - If turnover < required -> Not Eligible
    - If required certification missing -> Not Eligible
    - If unclear/missing data -> Needs Review

    Returns (decision, confidence, reasons, evidence, comparisons)
    """
    reasons = []
    evidence = []
    comparisons = []
    total = len(criteria) if criteria else 0
    if total == 0:
        return "Needs Review", 0.45, ["No criteria provided"], [], []

    decisive_non_matches = 0
    decisive_matches = 0
    missing_data = False
    unclear_data = False

    bidder_turnover = bidder.get("turnover")
    bidder_certs = [c.lower() for c in (bidder.get("certifications") or [])]
    bidder_exp = bidder.get("experience_years")
    bidder_raw = bidder.get("raw_excerpts") or []

    def _comparison_row(requirement: str, bidder_value: str, status: str, tone: str, icon: str, detail: str = ""):
        comparisons.append({
            "requirement": requirement,
            "bidder_value": bidder_value,
            "status": status,
            "tone": tone,
            "icon": icon,
            "detail": detail,
        })

    for c in criteria:
        ctype = c.get("type")
        crit_text = c.get("criterion", "")
        if ctype == "numeric":
            thresh = c.get("threshold")
            if thresh is None:
                reasons.append(f"Numeric criterion missing threshold: {crit_text}")
                unclear_data = True
                _comparison_row(crit_text, "Unknown", "Review", "amber", "⚠", "Threshold missing")
                continue
            if bidder_turnover is None:
                reasons.append(f"Missing bidder turnover to evaluate: {crit_text}")
                unclear_data = True
                _comparison_row(crit_text, "Not provided", "Review", "amber", "⚠", "Bidder turnover missing")
            else:
                evidence.append(f"Reported turnover: {bidder_turnover}L")
                if bidder_turnover >= float(thresh):
                    decisive_matches += 1
                    reasons.append(f"Turnover satisfied: {bidder_turnover}L >= {thresh}L")
                    _comparison_row(
                        f"Turnover > {thresh}L",
                        f"{bidder_turnover}L",
                        "Matched",
                        "green",
                        "✔",
                        f"{bidder_turnover}L >= {thresh}L",
                    )
                else:
                    decisive_non_matches += 1
                    reasons.append(f"Turnover not satisfied: {bidder_turnover}L < {thresh}L")
                    _comparison_row(
                        f"Turnover > {thresh}L",
                        f"{bidder_turnover}L",
                        "Not matched",
                        "red",
                        "✖",
                        f"{bidder_turnover}L < {thresh}L",
                    )
        elif ctype == "certification":
            req = crit_text.lower()
            tokens = [t for t in re.findall(r"[a-z0-9]+", req) if len(t) > 2]
            found = any(any(tok in bc for tok in tokens) for bc in bidder_certs) if bidder_certs else False
            if not bidder_certs:
                reasons.append(f"Missing bidder certifications to evaluate: {crit_text}")
                unclear_data = True
                _comparison_row(crit_text, "Not provided", "Review", "amber", "⚠", "Bidder certifications missing")
            elif found:
                decisive_matches += 1
                matched = [bc for bc in bidder.get("certifications") or [] if any(tok in bc.lower() for tok in tokens)]
                if matched:
                    evidence.append(f"Matching certification(s): {', '.join(matched)}")
                reasons.append(f"Required certification present: {crit_text}")
                _comparison_row(
                    crit_text,
                    ", ".join(matched) if matched else "Yes",
                    "Matched",
                    "green",
                    "✔",
                    "Required certification found",
                )
            else:
                decisive_non_matches += 1
                reasons.append(f"Required certification missing: {crit_text}")
                _comparison_row(crit_text, "No matching certificate", "Not matched", "red", "✖", "Required certification missing")
        elif ctype == "experience":
            needed = c.get("threshold")
            if needed is None:
                reasons.append(f"Experience criterion missing threshold: {crit_text}")
                unclear_data = True
                _comparison_row(crit_text, "Unknown", "Review", "amber", "⚠", "Threshold missing")
            elif bidder_exp is None:
                reasons.append(f"Missing bidder experience to evaluate: {crit_text}")
                unclear_data = True
                _comparison_row(crit_text, "Not provided", "Review", "amber", "⚠", "Bidder experience missing")
            else:
                evidence.append(f"Reported experience: {bidder_exp} years")
                if bidder_exp >= float(needed):
                    decisive_matches += 1
                    reasons.append(f"Experience satisfied: {bidder_exp}y >= {needed}y")
                    _comparison_row(
                        f"Experience > {needed} years",
                        f"{bidder_exp} years",
                        "Matched",
                        "green",
                        "✔",
                        f"{bidder_exp}y >= {needed}y",
                    )
                else:
                    decisive_non_matches += 1
                    reasons.append(f"Experience not satisfied: {bidder_exp}y < {needed}y")
                    _comparison_row(
                        f"Experience > {needed} years",
                        f"{bidder_exp} years",
                        "Not matched",
                        "red",
                        "✖",
                        f"{bidder_exp}y < {needed}y",
                    )
        else:
            reasons.append(f"Ignored non-eligibility line: {crit_text[:80]}")

    # Decision
    if unclear_data and decisive_non_matches == 0 and decisive_matches == 0:
        return "Needs Review", 0.5, reasons, evidence, comparisons
    if decisive_non_matches > 0:
        # any failing decisive rule makes it Not Eligible
        completeness = decisive_matches / max(total, 1)
        confidence = round(max(0.75, 0.85 + (completeness * 0.05)), 3)
        return "Not Eligible", confidence, reasons, evidence, comparisons
    if decisive_matches > 0 and decisive_non_matches == 0:
        completeness = decisive_matches / max(total, 1)
        confidence = round(min(0.99, 0.72 + (0.18 * completeness) + (0.05 if not unclear_data else 0.0)), 3)
        return "Eligible", confidence, reasons, evidence, comparisons

    return "Needs Review", 0.55 if missing_data or unclear_data else 0.5, reasons, evidence, comparisons


def extract_bidder_structured(text: str):
    """Extract bidder structured data: turnover (L), certifications, experience_years.

    Returns a dict matching `BidderInfo` shape.
    Falls back to MOCK DATA if extraction produces nothing.
    """
    prompt = (
        "Extract bidder details:\n\n"
        "* turnover\n"
        "* certifications\n"
        "* experience\n"
        "Return JSON only.\n\n"
        f"Bidder text:\n{text}"
    )
    ai_result = _safe_json(call_gemini(prompt))
    if isinstance(ai_result, dict) and ai_result:
        ai_result.setdefault("raw_excerpts", [line.strip() for line in text.splitlines() if line.strip()][:10])
        return ai_result

    lines = [l.strip() for l in text.splitlines() if l.strip()]
    turnover = None
    certs = set()
    experience = None
    excerpts = []

    for ln in lines:
        lower = ln.lower()
        excerpts.append(ln)
        # turnover
        if any(k in lower for k in ["turnover", "annual turnover", "turnover of", "revenue"]):
            val = _parse_number_with_units(ln)
            if val:
                turnover = val
        # certifications
        if "iso" in lower or "certif" in lower or "certificate" in lower:
            certs.add(ln)
        # experience
        if "years" in lower and any(ch.isdigit() for ch in ln):
            # extract a number (years)
            m = re.search(r"([0-9]+(?:\.[0-9]+)?)\s*years?", lower)
            if m:
                try:
                    experience = float(m.group(1))
                except Exception:
                    pass
    
    # MOCK DATA FALLBACK: if no data extracted, return demo bidder
    if turnover is None and not certs and experience is None:
        return _demo_bidder()

    return {"turnover": turnover, "certifications": list(certs), "experience_years": experience, "raw_excerpts": excerpts[:10]}


def evaluate_criteria(criteria: list, bidder: dict):
    """Evaluate criteria against bidder structured data.

    Returns (decision, confidence, reasons list)
    """
    satisfied = 0
    reasons = []
    total = len(criteria) if criteria else 0

    for c in criteria:
        ctype = c.get("type")
        crit_text = c.get("criterion")
        if ctype == "numeric":
            thresh = c.get("threshold")
            if thresh is None:
                # cannot evaluate
                reasons.append(f"Cannot evaluate numeric criterion: {crit_text}")
                continue
            bidder_turn = bidder.get("turnover")
            if bidder_turn is not None and bidder_turn >= thresh:
                satisfied += 1
                reasons.append(f"Turnover requirement satisfied ({bidder_turn}L >= {thresh}L)")
            else:
                reasons.append(f"Turnover requirement NOT satisfied ({bidder_turn}L < {thresh}L)")
        elif ctype == "certification":
            certs = bidder.get("certifications") or []
            present = any(c.get("criterion").lower().split()[0] in x.lower() for x in certs) if certs else False
            if present:
                satisfied += 1
                reasons.append(f"Certification requirement satisfied: found matching certification")
            else:
                reasons.append(f"Certification requirement NOT satisfied: no matching certificate found")
        elif ctype == "experience":
            needed = c.get("threshold")
            have = bidder.get("experience_years")
            if needed is None:
                reasons.append(f"Cannot evaluate experience criterion: {crit_text}")
            elif have is not None and have >= needed:
                satisfied += 1
                reasons.append(f"Experience requirement satisfied ({have} years >= {needed} years)")
            else:
                reasons.append(f"Experience requirement NOT satisfied ({have} years < {needed} years)")
        else:
            # generic textual match: check if any excerpt contains a keyword
            found = False
            for ex in bidder.get("raw_excerpts", []):
                if any(w.lower() in ex.lower() for w in crit_text.split()[:5]):
                    found = True
                    break
            if found:
                satisfied += 1
                reasons.append(f"Textual criterion matched: {crit_text[:80]}")
            else:
                reasons.append(f"Textual criterion NOT matched: {crit_text[:80]}")

    # Decision logic
    if total == 0:
        decision = "Needs Review"
        confidence = 0.5
    else:
        ratio = satisfied / total
        if ratio == 1.0:
            decision = "Eligible"
        elif ratio == 0.0:
            decision = "Not Eligible"
        else:
            decision = "Needs Review"
        # simple confidence scaling
        confidence = round(0.4 + 0.6 * ratio, 3)

    return decision, confidence, reasons


def generate_chat_response(messages: List[Dict[str, str]], tender_text: str, bidder_text: str) -> str:
    """Generate a chat response based on the document context and chat history."""
    prompt = "You are the BidAssure Copilot, a helpful AI assistant aiding a government procurement officer evaluating a tender and bidder proposal.\n"
    prompt += "Answer the user's questions clearly and concisely based on the following documents.\n\n"
    
    if tender_text:
        prompt += f"--- TENDER DOCUMENT EXTRACT ---\n{tender_text[:15000]}\n\n"
    if bidder_text:
        prompt += f"--- BIDDER DOCUMENT EXTRACT ---\n{bidder_text[:15000]}\n\n"
        
    prompt += "--- CHAT HISTORY ---\n"
    for msg in messages:
        role = "User" if msg.get("role") == "user" else "Copilot"
        prompt += f"{role}: {msg.get('text')}\n"
        
    prompt += "Copilot: "
    
    response = call_gemini(prompt)
    if not response:
        return "I'm currently unable to process your request. Please check your API key configuration."
    return response.strip()
