"""
Application settings loaded from environment variables.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GEMINI_API_KEY: str
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/sabkiawaaz"
    FRONTEND_URL: str = "http://localhost:3000"
    DEFAULT_CONSTITUENCY: str = "New Delhi Central"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()