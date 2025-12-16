from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "DirectoryGen API"
    DEBUG: bool = False

    # CORS
    ALLOWED_ORIGINS: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:5173",
        ]
    )

    # Limits (used later)
    MAX_NODES: int = 5000
    MAX_DEPTH: int = 25
    MAX_ZIP_SIZE_MB: int = 20

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
