import uuid
from typing import Dict
from .models import DocumentData

# In-memory storage for prototype. Replace with DB in production.
TENDERS: Dict[str, DocumentData] = {}
BIDDERS: Dict[str, DocumentData] = {}


def new_id(prefix: str = "doc") -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


def store_tender(text: str, extracted) -> str:
    doc_id = new_id("tender")
    TENDERS[doc_id] = DocumentData(doc_id=doc_id, text=text, extracted=extracted)
    return doc_id


def store_bidder(text: str, extracted) -> str:
    doc_id = new_id("bidder")
    BIDDERS[doc_id] = DocumentData(doc_id=doc_id, text=text, extracted=extracted)
    return doc_id


def get_tender(doc_id: str) -> DocumentData:
    return TENDERS.get(doc_id)


def get_bidder(doc_id: str) -> DocumentData:
    return BIDDERS.get(doc_id)
