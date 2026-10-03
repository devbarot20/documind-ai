"""Document processor - handles PDF extraction, chunking, and embedding pipeline."""
from __future__ import annotations
import os
import json
import logging
import fitz  # PyMuPDF
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.services.document_service import update_document_status
from app.services.embedding_service import generate_embeddings_batch
from app.models.document_chunk import DocumentChunk
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class DocumentProcessor:
    def __init__(self, document_id: str, user_id: str, file_path: str):
        self.document_id = document_id
        self.user_id = user_id
        self.file_path = file_path

    async def process(self) -> None:
        async with AsyncSessionLocal() as db:
            try:
                logger.info(f"Starting processing for document {self.document_id}")

                pages = self.extract_text()
                if not pages:
                    await update_document_status(
                        db, self.document_id, "failed",
                        processing_error="No extractable text found in PDF"
                    )
                    await db.commit()
                    return

                page_count = len(pages)
                cleaned_pages = [self.clean_text(page) for page in pages]

                chunks = self.chunk_text(cleaned_pages)
                if not chunks:
                    await update_document_status(
                        db, self.document_id, "failed",
                        processing_error="No content could be extracted after cleaning"
                    )
                    await db.commit()
                    return

                texts = [chunk["text"] for chunk in chunks]
                embeddings = await generate_embeddings_batch(texts)

                await self.store_chunks(db, chunks, embeddings)

                await update_document_status(
                    db, self.document_id, "completed", page_count=page_count
                )
                await db.commit()
                logger.info(f"Document {self.document_id} processing completed")

            except Exception as e:
                logger.error(f"Document {self.document_id} processing failed: {e}", exc_info=True)
                try:
                    await db.rollback()
                    await update_document_status(
                        db, self.document_id, "failed",
                        processing_error=f"Processing failed: {str(e)[:500]}"
                    )
                    await db.commit()
                except Exception as inner_e:
                    logger.error(f"Failed to update error status: {inner_e}")

    def extract_text(self) -> list[dict]:
        pages = []
        try:
            doc = fitz.open(self.file_path)
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text("text")
                if text.strip():
                    pages.append({
                        "page_number": page_num + 1,
                        "text": text,
                    })
            doc.close()
        except Exception as e:
            logger.error(f"PDF extraction failed for {self.file_path}: {e}")
            raise ValueError(f"Failed to extract text from PDF: {e}")
        return pages

    def clean_text(self, page: dict) -> dict:
        text = page["text"]
        lines = text.split("\n")
        cleaned_lines = [line.strip() for line in lines if line.strip()]
        cleaned_text = "\n".join(cleaned_lines)
        while "  " in cleaned_text:
            cleaned_text = cleaned_text.replace("  ", " ")
        return {
            "page_number": page["page_number"],
            "text": cleaned_text,
        }

    def chunk_text(self, pages: list[dict]) -> list[dict]:
        chunk_size = settings.RAG_CHUNK_SIZE
        chunk_overlap = settings.RAG_CHUNK_OVERLAP
        chunks = []
        chunk_index = 0

        for page in pages:
            text = page["text"]
            page_number = page["page_number"]

            if not text.strip():
                continue

            words = text.split()
            start = 0

            while start < len(words):
                end = start + chunk_size
                chunk_words = words[start:end]
                chunk_text = " ".join(chunk_words)

                if chunk_text.strip():
                    chunks.append({
                        "text": chunk_text,
                        "page_number": page_number,
                        "chunk_index": chunk_index,
                        "metadata": {
                            "document_id": self.document_id,
                            "page_number": page_number,
                            "chunk_index": chunk_index,
                            "word_count": len(chunk_words),
                        }
                    })
                    chunk_index += 1

                step = chunk_size - chunk_overlap
                if step <= 0:
                    step = max(chunk_size // 2, 1)
                start += step

                if start < len(words) and len(words) - start < chunk_overlap:
                    break

        return chunks

    async def store_chunks(
        self, db: AsyncSession, chunks: list[dict], embeddings: list[list[float]]
    ) -> None:
        chunk_objects = []
        for i, chunk in enumerate(chunks):
            embedding = embeddings[i] if i < len(embeddings) else None
            chunk_obj = DocumentChunk(
                document_id=self.document_id,
                user_id=self.user_id,
                content=chunk["text"],
                embedding=embedding,
                page_number=chunk["page_number"],
                chunk_index=chunk["chunk_index"],
                metadata_json=json.dumps(chunk.get("metadata", {})),
            )
            chunk_objects.append(chunk_obj)

        db.add_all(chunk_objects)
        await db.flush()


async def process_document_task(document_id: str, user_id: str, file_path: str) -> None:
    processor = DocumentProcessor(document_id, user_id, file_path)
    await processor.process()
