"""Embedding service - generates vector embeddings using OpenAI-compatible API."""
from __future__ import annotations
import logging
from openai import AsyncOpenAI
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        api_key = settings.EMBEDDING_API_KEY or settings.LLM_API_KEY or "dummy-key"
        _client = AsyncOpenAI(
            api_key=api_key,
            base_url=settings.EMBEDDING_API_BASE_URL,
        )
    return _client


async def generate_embedding(text: str) -> list[float]:
    """Generate embedding for a single text."""
    client = _get_client()
    try:
        response = await client.embeddings.create(
            model=settings.EMBEDDING_MODEL,
            input=text,
            dimensions=settings.EMBEDDING_DIMENSIONS,
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"Embedding generation failed: {e}")
        # Return dummy vector if API key is unconfigured or in tests
        return [0.0] * 1536


async def generate_embeddings_batch(texts: list[str], batch_size: int = 100) -> list[list[float]]:
    """Generate embeddings for a batch of texts."""
    client = _get_client()
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        batch = [t[:8000] if len(t) > 8000 else t for t in batch]

        try:
            response = await client.embeddings.create(
                model=settings.EMBEDDING_MODEL,
                input=batch,
                dimensions=settings.EMBEDDING_DIMENSIONS,
            )
            batch_embeddings = [item.embedding for item in response.data]
            all_embeddings.extend(batch_embeddings)
        except Exception as e:
            logger.error(f"Batch embedding failed at index {i}: {e}")
            all_embeddings.extend([[0.0] * 1536 for _ in batch])

    return all_embeddings
