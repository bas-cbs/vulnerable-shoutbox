"""Pydantic settings setup."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurable variables."""

    origin: list[str] = ["http://localhost:5173"]
    third_party_url: str = "http://localhost:8001"
    access_token_expire_minutes: int = 30
    secret_key: str
    algorithm: str = "HS256"
    sqlite_db: Path = Path("db.sqlite")
    db_seed_script: Path = Path("./src/tables.sql")

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
