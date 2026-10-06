"""Embedding service - generates vector embeddings using OpenRouter API."""
from __future__ import annotations
import logging
from openai import AsyncOpenAI
from app.config import get_settings

logger = logging.getLogger(__name__)


def _get_client() -> AsyncOpenAI:
    settings = get_settings()
    api_key = settings.EMBEDDING_API_KEY.strip() if settings.EMBEDDING_API_KEY else ""
    if not api_key or "your-" in api_key or "dummy" in api_key:
        api_key = settings.LLM_API_KEY.strip() if settings.LLM_API_KEY else ""

    headers = {}
    if "openrouter" in settings.EMBEDDING_API_BASE_URL.lower():
        headers = {
            "HTTP-Referer": "https://documind.ai",
            "X-Title": "DocuMind AI",
        }

    return AsyncOpenAI(
        api_key=api_key or "dummy-key",
        base_url=settings.EMBEDDING_API_BASE_URL,
        default_headers=headers if headers else None,
    )


async def generate_embedding(text: str) -> list[float]:
    """Generate embedding for a single text using OpenRouter."""
    settings = get_settings()
    client = _get_client()
    try:
        response = await client.embeddings.create(
            model=settings.EMBEDDING_MODEL,
            input=text,
        )
        return response.data[0].embedding
    except Exception as e:
        logger.error(f"OpenRouter embedding generation failed: {e}")
        # Return fallback vector if API key is unconfigured or in tests
        return [0.0] * settings.EMBEDDING_DIMENSIONS


async def generate_embeddings_batch(texts: list[str], batch_size: int = 100) -> list[list[float]]:
    """Generate embeddings for a batch of texts using OpenRouter."""
    settings = get_settings()
    client = _get_client()
    all_embeddings = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        batch = [t[:8000] if len(t) > 8000 else t for t in batch]

        try:
            response = await client.embeddings.create(
                model=settings.EMBEDDING_MODEL,
                input=batch,
            )
            batch_embeddings = [item.embedding for item in response.data]
            all_embeddings.extend(batch_embeddings)
        except Exception as e:
            logger.error(f"Batch embedding failed at index {i}: {e}")
            all_embeddings.extend([[0.0] * settings.EMBEDDING_DIMENSIONS for _ in batch])

    return all_embeddings

