"""Document management routes."""
from __future__ import annotations
import os
import asyncio
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.document import DocumentResponse, DocumentListResponse, DocumentStatusResponse
from app.services.document_service import (
    create_document, get_user_documents, get_document_by_id,
    delete_document, get_document_stats, get_upload_dir, generate_safe_filename,
)
from app.services.document_processor import process_document_task
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.config import get_settings

router = APIRouter(prefix="/api/documents", tags=["Documents"])
settings = get_settings()


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED,
              summary="Upload a PDF document")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are accepted",
        )

    content = await file.read()
    file_size = len(content)

    if file_size > settings.max_upload_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size is {settings.MAX_UPLOAD_SIZE_MB}MB",
        )

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is empty",
        )

    if not content[:5] == b"%PDF-":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PDF file",
        )

    upload_dir = get_upload_dir(current_user.id)
    safe_filename = generate_safe_filename(file.filename)
    file_path = os.path.join(upload_dir, safe_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    doc = await create_document(
        db=db,
        user_id=current_user.id,
        original_filename=file.filename,
        filename=safe_filename,
        file_path=file_path,
        file_size=file_size,
    )

    asyncio.create_task(process_document_task(doc.id, current_user.id, file_path))

    return DocumentResponse.model_validate(doc)


@router.get("", response_model=DocumentListResponse,
             summary="List user documents")
async def list_documents(
    status_filter: str | None = Query(None, alias="status"),
    search: str | None = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    documents, total = await get_user_documents(
        db, current_user.id, status=status_filter, search=search,
        sort_by=sort_by, sort_order=sort_order, limit=limit, offset=offset,
    )
    return DocumentListResponse(
        documents=[DocumentResponse.model_validate(d) for d in documents],
        total=total,
    )


@router.get("/stats", summary="Get document statistics")
async def document_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stats = await get_document_stats(db, current_user.id)
    return stats


@router.get("/{document_id}", response_model=DocumentResponse,
             summary="Get document details")
async def get_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    doc = await get_document_by_id(db, document_id, current_user.id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    return DocumentResponse.model_validate(doc)


@router.get("/{document_id}/status", response_model=DocumentStatusResponse,
             summary="Get document processing status")
async def document_status(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    doc = await get_document_by_id(db, document_id, current_user.id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    return DocumentStatusResponse(
        id=doc.id,
        status=doc.status,
        page_count=doc.page_count,
        processing_error=doc.processing_error,
    )


@router.delete("/{document_id}", status_code=status.HTTP_200_OK,
                summary="Delete a document")
async def remove_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    deleted = await delete_document(db, document_id, current_user.id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )
    return {"message": "Document deleted successfully"}
