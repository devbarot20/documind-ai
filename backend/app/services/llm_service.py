"""LLM service - handles communication with OpenAI & OpenRouter LLM APIs."""
from __future__ import annotations
import logging
from openai import AsyncOpenAI
from app.config import get_settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are DocuMind AI, a concise, highly relevant AI Document Analyst.

Your goal is to provide short, direct, and cost-effective answers based strictly on the uploaded document context.

Guidelines:
1. **Be Concise & Direct**: Answer the question directly without pleasantries, long intros, or verbose conclusions. Keep responses typically under 150-200 words.
2. **High-Signal Structure**: Use 2-4 punchy bullet points or short paragraphs highlighting only the most relevant facts, purpose, specifications, or test cases.
3. **Strict Grounding & Citations**: Only use facts from the provided context. Cite sources with [1], [2], etc.
4. **Do Not Hallucinate**: If information is missing from the context, state it in one short sentence."""


def _get_client_and_model() -> tuple[AsyncOpenAI, str]:
    """Resolve the OpenRouter AsyncOpenAI client and model name."""
    settings = get_settings()
    api_key = settings.LLM_API_KEY.strip() if settings.LLM_API_KEY else ""
    base_url = settings.LLM_API_BASE_URL.strip() if settings.LLM_API_BASE_URL else "https://openrouter.ai/api/v1"
    model = settings.LLM_MODEL.strip() if settings.LLM_MODEL else "openai/gpt-4o-mini"

    # Fallback to EMBEDDING_API_KEY only if it has an OpenRouter key
    if not api_key or "your-" in api_key:
        if settings.EMBEDDING_API_KEY and settings.EMBEDDING_API_KEY.startswith("sk-or-"):
            api_key = settings.EMBEDDING_API_KEY.strip()

    headers = {
        "HTTP-Referer": "https://documind.ai",
        "X-Title": "DocuMind AI",
    }

    client = AsyncOpenAI(
        api_key=api_key or "dummy-key",
        base_url=base_url,
        default_headers=headers,
    )
    return client, model


async def generate_answer(
    question: str,
    context_chunks: list[dict],
    conversation_history: list[dict] | None = None,
) -> str:
    """Generate an answer using the LLM with retrieved context."""
    client, model = _get_client_and_model()

    context_parts = []
    for i, chunk in enumerate(context_chunks, 1):
        doc_name = chunk.get("document_name", "Unknown Document")
        page_num = chunk.get("page_number", "?")
        text = chunk.get("content", "")
        context_parts.append(
            f"[Source {i}] Document: {doc_name} | Page: {page_num}\n{text}"
        )

    context_string = "\n\n---\n\n".join(context_parts)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    if conversation_history:
        for msg in conversation_history[-6:]:
            messages.append({
                "role": msg["role"],
                "content": msg["content"],
            })

    user_message = f"""Based on the following document context, please answer the question with thorough analysis, clear structure, and appropriate citations [1], [2], etc.

Document Context:
{context_string}

Question: {question}"""

    messages.append({"role": "user", "content": user_message})

    try:
        response = await client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.3,
            max_tokens=500,
        )
        return response.choices[0].message.content or "I was unable to generate a response."
    except Exception as e:
        logger.error(f"LLM generation failed for model '{model}': {e}", exc_info=True)
        return (
            f"⚠️ **LLM Connection / API Error**: Could not generate answer using the AI model (`{model}`).\n\n"
            f"**Error Details**: `{str(e)}`\n\n"
            "**Troubleshooting**: Please verify that your `LLM_API_KEY` in `backend/.env` is set to a valid API key (either OpenRouter or OpenAI) and that your account has active API credits."
        )

