"""Pydantic settings setup."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurable variables."""

    origin: list[str] = ["localhost:5173"]
    access_token_expire_minutes: int = 30
    secret_key: str
    algorithm: str = "HS256"
    sqlite_path: str = "db.sqlite"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
