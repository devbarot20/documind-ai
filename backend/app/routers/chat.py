"""Chat routes."""
from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.chat import (
    ConversationCreate, ConversationResponse, ConversationListResponse,
    ConversationDetailResponse, MessageCreate, MessageResponse,
    ChatResponse, SourceCitation,
)
from app.services.chat_service import (
    create_conversation, get_user_conversations, get_conversation_by_id,
    get_conversation_messages, send_message, delete_conversation,
)
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("/conversations", response_model=ConversationResponse,
              status_code=status.HTTP_201_CREATED,
              summary="Create a new conversation")
async def new_conversation(
    data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conv = await create_conversation(
        db, current_user.id,
        title=data.title,
        document_ids=data.document_ids,
    )
    return ConversationResponse(
        id=conv.id,
        title=conv.title,
        document_ids=conv.document_ids,
        created_at=conv.created_at,
        updated_at=conv.updated_at,
        message_count=0,
    )


@router.get("/conversations", response_model=ConversationListResponse,
             summary="List user conversations")
async def list_conversations(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conversations, total = await get_user_conversations(
        db, current_user.id, limit=limit, offset=offset,
    )
    return ConversationListResponse(
        conversations=[ConversationResponse(**c) for c in conversations],
        total=total,
    )


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse,
             summary="Get conversation with messages")
async def get_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conv = await get_conversation_by_id(db, conversation_id, current_user.id)
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )

    messages = await get_conversation_messages(db, conversation_id)

    formatted_messages = []
    for msg in messages:
        sources = []
        if msg.get("sources"):
            sources = [SourceCitation(**s) for s in msg["sources"]]
        formatted_messages.append(MessageResponse(
            id=msg["id"],
            conversation_id=msg["conversation_id"],
            role=msg["role"],
            content=msg["content"],
            sources=sources,
            created_at=msg["created_at"],
        ))

    return ConversationDetailResponse(
        id=conv.id,
        title=conv.title,
        document_ids=conv.document_ids,
        created_at=conv.created_at,
        updated_at=conv.updated_at,
        messages=formatted_messages,
    )


@router.post("/conversations/{conversation_id}/messages", response_model=ChatResponse,
              summary="Send a message in a conversation")
async def post_message(
    conversation_id: str,
    data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await send_message(
            db=db,
            user_id=current_user.id,
            conversation_id=conversation_id,
            content=data.content,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    user_msg = result["user_message"]
    asst_msg = result["assistant_message"]

    return ChatResponse(
        user_message=MessageResponse(
            id=user_msg["id"],
            conversation_id=user_msg["conversation_id"],
            role=user_msg["role"],
            content=user_msg["content"],
            sources=[],
            created_at=user_msg["created_at"],
        ),
        assistant_message=MessageResponse(
            id=asst_msg["id"],
            conversation_id=asst_msg["conversation_id"],
            role=asst_msg["role"],
            content=asst_msg["content"],
            sources=[SourceCitation(**s) for s in asst_msg.get("sources", [])],
            created_at=asst_msg["created_at"],
        ),
    )


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_200_OK,
                summary="Delete a conversation")
async def remove_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    deleted = await delete_conversation(db, conversation_id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    return {"message": "Conversation deleted successfully"}
