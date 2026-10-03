"""Chat schemas."""
from __future__ import annotations
from pydantic import BaseModel, Field
from datetime import datetime


class ConversationCreate(BaseModel):
    title: str | None = None
    document_ids: list[str] | None = None


class ConversationResponse(BaseModel):
    id: str
    title: str
    document_ids: str | None = None
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    model_config = {"from_attributes": True}


class ConversationListResponse(BaseModel):
    conversations: list[ConversationResponse]
    total: int


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000)


class SourceCitation(BaseModel):
    citation_number: int
    document_name: str
    document_id: str
    page_number: int | None = None
    excerpt: str


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    sources: list[SourceCitation] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatResponse(BaseModel):
    user_message: MessageResponse
    assistant_message: MessageResponse


class ConversationDetailResponse(BaseModel):
    id: str
    title: str
    document_ids: str | None = None
    created_at: datetime
    updated_at: datetime
    messages: list[MessageResponse]
