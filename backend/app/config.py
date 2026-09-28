from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """App settings, read from environment variables (and a local .env file in development)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "local"
    # Only needed when the frontend is served from a different origin than the API.
    # Locally the Vite proxy and in production the nginx proxy make them same-origin.
    cors_origins: list[str] = []


@lru_cache
def get_settings() -> Settings:
    return Settings()
