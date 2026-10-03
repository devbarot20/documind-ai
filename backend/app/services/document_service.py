"""Document service for upload, management, and deletion."""
from __future__ import annotations
import os
import uuid
import logging
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def get_upload_dir(user_id: str) -> str:
    """Get user-specific upload directory."""
    upload_path = os.path.join(settings.UPLOAD_DIR, user_id)
    os.makedirs(upload_path, exist_ok=True)
    return upload_path


def generate_safe_filename(original_filename: str) -> str:
    """Generate a safe unique filename preserving extension."""
    ext = os.path.splitext(original_filename)[1].lower()
    return f"{uuid.uuid4().hex}{ext}"


async def create_document(
    db: AsyncSession,
    user_id: str,
    original_filename: str,
    filename: str,
    file_path: str,
    file_size: int,
) -> Document:
    """Create a new document record."""
    doc = Document(
        user_id=user_id,
        original_filename=original_filename,
        filename=filename,
        file_path=file_path,
        file_size=file_size,
        status="processing",
    )
    db.add(doc)
    await db.flush()
    await db.refresh(doc)
    return doc


async def get_user_documents(
    db: AsyncSession,
    user_id: str,
    status: str | None = None,
    search: str | None = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    limit: int = 50,
    offset: int = 0,
) -> tuple[list[Document], int]:
    """Get documents for a user with filtering and pagination."""
    query = select(Document).where(Document.user_id == user_id)
    count_query = select(func.count(Document.id)).where(Document.user_id == user_id)

    if status:
        query = query.where(Document.status == status)
        count_query = count_query.where(Document.status == status)

    if search:
        search_term = f"%{search}%"
        query = query.where(Document.original_filename.ilike(search_term))
        count_query = count_query.where(Document.original_filename.ilike(search_term))

    # Sorting
    sort_column = getattr(Document, sort_by, Document.created_at)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    query = query.limit(limit).offset(offset)

    result = await db.execute(query)
    documents = list(result.scalars().all())

    count_result = await db.execute(count_query)
    total = count_result.scalar() or 0

    return documents, total


async def get_document_by_id(db: AsyncSession, document_id: str, user_id: str) -> Document | None:
    """Get a document by ID, scoped to user."""
    result = await db.execute(
        select(Document).where(Document.id == document_id, Document.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def update_document_status(
    db: AsyncSession,
    document_id: str,
    status: str,
    page_count: int | None = None,
    processing_error: str | None = None,
) -> None:
    """Update document processing status."""
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if doc:
        doc.status = status
        doc.updated_at = datetime.now(timezone.utc)
        if page_count is not None:
            doc.page_count = page_count
        if processing_error is not None:
            doc.processing_error = processing_error
        await db.flush()


async def delete_document(db: AsyncSession, document_id: str, user_id: str) -> bool:
    """Delete a document and all associated data."""
    doc = await get_document_by_id(db, document_id, user_id)
    if not doc:
        return False

    # Delete physical file
    try:
        if os.path.exists(doc.file_path):
            os.remove(doc.file_path)
    except OSError as e:
        logger.error(f"Failed to delete file {doc.file_path}: {e}")

    # Delete chunks
    await db.execute(
        delete(DocumentChunk).where(DocumentChunk.document_id == document_id)
    )

    # Delete document record
    await db.delete(doc)
    await db.flush()
    return True


async def get_document_stats(db: AsyncSession, user_id: str) -> dict:
    """Get document statistics for a user."""
    total_result = await db.execute(
        select(func.count(Document.id)).where(Document.user_id == user_id)
    )
    total = total_result.scalar() or 0

    processing_result = await db.execute(
        select(func.count(Document.id)).where(
            Document.user_id == user_id, Document.status == "processing"
        )
    )
    processing = processing_result.scalar() or 0

    completed_result = await db.execute(
        select(func.count(Document.id)).where(
            Document.user_id == user_id, Document.status == "completed"
        )
    )
    completed = completed_result.scalar() or 0

    failed_result = await db.execute(
        select(func.count(Document.id)).where(
            Document.user_id == user_id, Document.status == "failed"
        )
    )
    failed = failed_result.scalar() or 0

    size_result = await db.execute(
        select(func.coalesce(func.sum(Document.file_size), 0)).where(
            Document.user_id == user_id
        )
    )
    total_size = size_result.scalar() or 0

    return {
        "total": total,
        "processing": processing,
        "completed": completed,
        "failed": failed,
        "total_size": total_size,
    }
