"""Chat service - manages conversations and messages."""
from __future__ import annotations
import json
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from app.models.conversation import Conversation
from app.models.message import Message
from app.services.rag_service import ask_question

logger = logging.getLogger(__name__)


async def create_conversation(
    db: AsyncSession,
    user_id: str,
    title: str | None = None,
    document_ids: list[str] | None = None,
) -> Conversation:
    """Create a new conversation."""
    conv = Conversation(
        user_id=user_id,
        title=title or "New Conversation",
        document_ids=",".join(document_ids) if document_ids else None,
    )
    db.add(conv)
    await db.flush()
    await db.refresh(conv)
    return conv


async def get_user_conversations(
    db: AsyncSession,
    user_id: str,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list[dict], int]:
    """Get conversations for a user with message counts."""
    query = (
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    conversations = list(result.scalars().all())

    count_result = await db.execute(
        select(func.count(Conversation.id)).where(Conversation.user_id == user_id)
    )
    total = count_result.scalar() or 0

    conv_dicts = []
    for conv in conversations:
        msg_count_result = await db.execute(
            select(func.count(Message.id)).where(Message.conversation_id == conv.id)
        )
        msg_count = msg_count_result.scalar() or 0
        conv_dicts.append({
            "id": conv.id,
            "title": conv.title,
            "document_ids": conv.document_ids,
            "created_at": conv.created_at,
            "updated_at": conv.updated_at,
            "message_count": msg_count,
        })

    return conv_dicts, total


async def get_conversation_by_id(
    db: AsyncSession, conversation_id: str, user_id: str
) -> Conversation | None:
    """Get a conversation by ID, scoped to user."""
    result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
    )
    return result.scalar_one_or_none()


async def get_conversation_messages(
    db: AsyncSession, conversation_id: str
) -> list[dict]:
    """Get all messages for a conversation."""
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    )
    messages = list(result.scalars().all())

    return [
        {
            "id": msg.id,
            "conversation_id": msg.conversation_id,
            "role": msg.role,
            "content": msg.content,
            "sources": json.loads(msg.sources_json) if msg.sources_json else [],
            "created_at": msg.created_at,
        }
        for msg in messages
    ]


async def send_message(
    db: AsyncSession,
    user_id: str,
    conversation_id: str,
    content: str,
) -> dict:
    """Process a user message and generate an AI response."""
    conversation = await get_conversation_by_id(db, conversation_id, user_id)
    if not conversation:
        raise ValueError("Conversation not found")

    user_message = Message(
        conversation_id=conversation_id,
        role="user",
        content=content,
    )
    db.add(user_message)
    await db.flush()
    await db.refresh(user_message)

    msg_count_result = await db.execute(
        select(func.count(Message.id)).where(Message.conversation_id == conversation_id)
    )
    msg_count = msg_count_result.scalar() or 0
    if msg_count == 1:
        conversation.title = content[:100] + ("..." if len(content) > 100 else "")

    messages = await get_conversation_messages(db, conversation_id)
    history = [{"role": m["role"], "content": m["content"]} for m in messages[:-1]]

    doc_ids = None
    if conversation.document_ids:
        doc_ids = [d.strip() for d in conversation.document_ids.split(",") if d.strip()]

    try:
        result = await ask_question(
            db=db,
            user_id=user_id,
            question=content,
            document_ids=doc_ids,
            conversation_history=history,
        )
    except Exception as e:
        logger.error(f"RAG pipeline failed: {e}")
        result = {
            "answer": "I'm sorry, I encountered an error while processing your question. Please try again.",
            "sources": [],
        }

    assistant_message = Message(
        conversation_id=conversation_id,
        role="assistant",
        content=result["answer"],
        sources_json=json.dumps(result["sources"]) if result["sources"] else None,
    )
    db.add(assistant_message)
    await db.flush()
    await db.refresh(assistant_message)

    return {
        "user_message": {
            "id": user_message.id,
            "conversation_id": user_message.conversation_id,
            "role": user_message.role,
            "content": user_message.content,
            "sources": [],
            "created_at": user_message.created_at,
        },
        "assistant_message": {
            "id": assistant_message.id,
            "conversation_id": assistant_message.conversation_id,
            "role": assistant_message.role,
            "content": result["answer"],
            "sources": result["sources"],
            "created_at": assistant_message.created_at,
        },
    }


async def delete_conversation(db: AsyncSession, conversation_id: str, user_id: str) -> bool:
    """Delete a conversation and all its messages."""
    conv = await get_conversation_by_id(db, conversation_id, user_id)
    if not conv:
        return False

    await db.execute(delete(Message).where(Message.conversation_id == conversation_id))
    await db.delete(conv)
    await db.flush()
    return True
