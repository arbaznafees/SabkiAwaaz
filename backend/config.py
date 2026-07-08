"""
Application settings loaded from environment variables.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GEMINI_API_KEY: str
    DATABASE_URL: str
    FRONTEND_URL: str = "https://sabki-awaaz.vercel.app"
    DEFAULT_CONSTITUENCY: str = "New Delhi Central"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
