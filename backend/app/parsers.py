"""Document parsing utilities.

Supports PDF and DOCX files. PDFs use pdfplumber with EasyOCR fallback.
DOCX files use python-docx to extract paragraph text.
"""
import io

import pdfplumber


def _extract_text_from_docx_bytes(file_bytes: bytes) -> str:
    """Extract text from DOCX bytes using python-docx."""
    try:
        from docx import Document

        document = Document(io.BytesIO(file_bytes))
        paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
        return "\n".join(paragraphs).strip()
    except Exception:
        return ""


def extract_text_from_document_bytes(file_bytes: bytes, filename: str = "") -> str:
    """Extract text from PDF or DOCX bytes.

    Returns extracted text as a single string.
    """
    lower_name = (filename or "").lower()

    if lower_name.endswith(".docx"):
        return _extract_text_from_docx_bytes(file_bytes)

    if lower_name.endswith(".pdf") or not lower_name:
        return extract_text_from_pdf_bytes(file_bytes)

    # Fallback: try PDF first, then DOCX.
    pdf_text = extract_text_from_pdf_bytes(file_bytes)
    if pdf_text.strip():
        return pdf_text
    return _extract_text_from_docx_bytes(file_bytes)


def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    """Extract text from PDF bytes. Use OCR fallback when necessary.

    Returns extracted text as a single string.
    """
    text_parts = []
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                text_parts.append(page_text)

            joined = "\n".join(text_parts).strip()

            # If extracted text is short, try OCR fallback.
            if len(joined) < 200:
                try:
                    # Lazy import to avoid heavy dependency when not needed.
                    import easyocr
                    import numpy as np

                    reader = easyocr.Reader(["en"], gpu=False)
                    ocr_pages = []
                    for i, page in enumerate(pdf.pages):
                        try:
                            pil_img = page.to_image(resolution=150).original
                        except Exception:
                            continue
                        arr = np.array(pil_img)
                        results = reader.readtext(arr, detail=0)
                        ocr_pages.append(" ".join(results))
                    ocr_text = "\n".join(ocr_pages).strip()
                    return ocr_text if ocr_text else joined
                except Exception:
                    # If OCR fails, return whatever was extracted.
                    return joined
            return joined
    except Exception:
        # On failure, return empty string.
        return ""
