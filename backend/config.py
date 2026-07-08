"""
Application settings loaded from environment variables.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GEMINI_API_KEY: str
    DATABASE_URL: str = "postgresql://neondb_owner:npg_ac9w6SYbrUsJ@ep-autumn-sea-aot9ws8g-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    FRONTEND_URL: str = "http://localhost:3000"
    DEFAULT_CONSTITUENCY: str = "New Delhi Central"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
