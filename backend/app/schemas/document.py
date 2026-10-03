"""Document schemas."""
from __future__ import annotations
from pydantic import BaseModel
from datetime import datetime


class DocumentResponse(BaseModel):
    id: str
    filename: str
    original_filename: str
    file_size: int
    status: str
    page_count: int | None = None
    processing_error: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]
    total: int


class DocumentStatusResponse(BaseModel):
    id: str
    status: str
    page_count: int | None = None
    processing_error: str | None = None
