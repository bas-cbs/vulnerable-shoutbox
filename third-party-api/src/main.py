"""All API Endpoints."""

import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create and fill DB tables."""
    with Path.open(settings.db_seed_script) as f:
        sql_commands = f.read()

    with sqlite3.connect(settings.sqlite_db) as conn:
        conn.executescript(sql_commands)
        conn.commit()

    yield

    Path.unlink(settings.sqlite_db)


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Profile(BaseModel):
    """Profile information."""

    id: int
    username: str
    description: str


@app.get("/profiles/{username}")
async def profile_description(username: str) -> Profile:
    """Get profile description."""
    with sqlite3.connect(settings.sqlite_db) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM profiles WHERE username = ?",
            (username,),
        )
        row = cursor.fetchone()
        return Profile(**row)


class ProfileDescription(BaseModel):
    """Profile description."""

    description: str


@app.patch("/profiles/{username}")
async def edit_profile_description(
    username: str,
    profile: ProfileDescription,
) -> None:
    """Edit profile description."""
    with sqlite3.connect(settings.sqlite_db) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE profiles SET description = ? WHERE username = ?;",
            (profile.description, username),
        )

        return "FLAG:4lwaysTrustN3verV3rify"
