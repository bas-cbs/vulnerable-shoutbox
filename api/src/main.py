"""All API Endpoints."""

import sqlite3
from contextlib import asynccontextmanager
from datetime import timedelta
from pathlib import Path
from typing import Annotated

from fastapi import Depends, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm  # noqa: TC002

from src.config import settings
from src.exceptions import INCORRECT_USER_PASS
from src.models import PostContent, Token, User
from src.oauth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_user_optional,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create and fill DB tables."""
    with Path.open("./src/tables.sql") as f:
        sql_commands = f.read()

    with sqlite3.connect(settings.sqlite_path) as conn:
        conn.executescript(sql_commands)
        conn.commit()

    yield

    Path.unlink(settings.sqlite_path)


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/token")
async def get_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    """Get access token."""
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise INCORRECT_USER_PASS

    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    return Token(access_token=access_token, token_type="bearer")  # noqa: S106


@app.get("/userinfo")
async def get_user_info(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Get user information."""
    return current_user


@app.get("/posts")
async def posts() -> list[dict]:
    """Get all posts."""
    with sqlite3.connect(settings.sqlite_path) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM posts")

        return [dict(row) for row in cursor.fetchall()]


@app.post("/post/create", status_code=status.HTTP_201_CREATED)
async def create_post(
    post: PostContent,
    current_user: Annotated[User, Depends(get_current_user_optional)],
) -> None:
    """Create a new post."""
    user = current_user.username if current_user else "anonymous"
    with sqlite3.connect(settings.sqlite_path) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO posts (user, content) VALUES (?, ?);",
            (user, post.content),
        )


@app.delete("/post/{post_id}")
async def delete_post(
    post_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
) -> None:
    """Delete a post."""
    with sqlite3.connect(settings.sqlite_path) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM posts WHERE id = ? AND user = ?;",
            (post_id, current_user.username),
        )


@app.patch("/post/{post_id}")
async def edit_post(
    post_id: int,
    post: PostContent,
    current_user: Annotated[User, Depends(get_current_user)],
) -> None:
    """Edit a post."""
    with sqlite3.connect(settings.sqlite_path) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE posts SET content = ? WHERE id = ? AND user = ?;",
            (post.content, post_id, current_user.username),
        )
