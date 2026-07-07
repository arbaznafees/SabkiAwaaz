"""
Gemini AI service — the ONLY embedding and AI provider.
No fallback to sentence-transformers. Failures raise clear errors.
"""

import base64
from google import genai
from google.genai import types

from config import settings

# Single client instance, reused across all calls
_client = genai.Client(api_key=settings.GEMINI_API_KEY)

# Current model names (as of mid-2026)
_TEXT_MODEL = "gemini-3.1-flash-lite"
_EMBEDDING_MODEL = "gemini-embedding-001"
_EMBEDDING_DIM = 768


def transcribe_audio(base64_audio: str) -> str:
    """Transcribe a base64-encoded audio blob using Gemini multimodal."""
    audio_bytes = base64.b64decode(base64_audio)
    response = _client.models.generate_content(
        model=_TEXT_MODEL,
        contents=[
            "Transcribe the following audio exactly as spoken. "
            "Return ONLY the transcription text, nothing else. "
            "If the audio is in Hindi or Hinglish, transcribe in the original language.",
            types.Part.from_bytes(data=audio_bytes, mime_type="audio/webm"),
        ],
    )
    return response.text.strip()


def caption_image(base64_image: str) -> str:
    """Caption an image and describe any civic/infrastructure issue visible."""
    image_bytes = base64.b64decode(base64_image)
    response = _client.models.generate_content(
        model=_TEXT_MODEL,
        contents=[
            "Describe what civic or infrastructure issue is shown in this image. "
            "Focus on problems like road damage, water issues, broken infrastructure, "
            "sanitation problems, etc. Be specific and concise (1-2 sentences).",
            types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
        ],
    )
    return response.text.strip()


def extract_concern(text: str) -> str:
    """
    Summarize raw citizen input into one clean sentence describing the
    actual civic issue. Works with Hindi, English, or Hinglish input.
    """
    response = _client.models.generate_content(
        model=_TEXT_MODEL,
        contents=(
            "You are an assistant that processes citizen complaints for an Indian "
            "Member of Parliament. Summarize the following citizen complaint into "
            "ONE clean, specific sentence in English describing the actual civic "
            "issue. Do not add opinions or suggestions — just state the problem.\n\n"
            f"Citizen input: {text}"
        ),
    )
    return response.text.strip()


def generate_embedding(text: str) -> list[float]:
    """
    Generate a 768-dimensional embedding using Gemini's embedding model.
    Raises on failure — no silent fallback to a different model/dimension.
    """
    result = _client.models.embed_content(
        model=_EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(output_dimensionality=_EMBEDDING_DIM),
    )
    embedding = result.embeddings[0].values
    if len(embedding) != _EMBEDDING_DIM:
        raise ValueError(
            f"Expected {_EMBEDDING_DIM}-dim embedding from Gemini, got {len(embedding)}-dim. "
            "This will cause a schema mismatch with the vector(768) column."
        )
    return embedding


def generate_theme_label(sample_concerns: list[str]) -> str:
    """
    Generate a short (2-5 word) human-readable theme label for a cluster
    based on a sample of its constituent citizen concerns.
    """
    samples = "\n".join(f"- {c}" for c in sample_concerns[:5])
    response = _client.models.generate_content(
        model=_TEXT_MODEL,
        contents=(
            "Below are citizen complaints that were grouped together by semantic "
            "similarity. Generate a SHORT theme label (2-5 words) that describes "
            "the common issue. Return ONLY the label, nothing else.\n\n"
            f"{samples}"
        ),
    )
    return response.text.strip().strip('"').strip("'")