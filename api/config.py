from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    origin: list[str] = ["localhost:5173"]
    access_token_expire_minutes: int = 30
    secret_key: str = "a4c249bac88fe82cc68b7f47b5d649164035048ba707dfc1ee43eabb014c824c"
    algorithm: str = "HS256"
    sqlite_path: str = "db.sqlite"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
