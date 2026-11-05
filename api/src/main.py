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
from src.models import Post, PostContent, Token, User
from src.oauth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_user_optional,
)


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

    if user.username == "admin":
        return Token(access_token="FLAG:K3y$ToTh3C4stl3", token_type="bearer")  # noqa: S106

    return Token(access_token=access_token, token_type="bearer")  # noqa: S106


@app.get("/userinfo")
async def get_user_info(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Get user information."""
    return current_user


@app.get("/posts")
async def posts(limit: int = 100) -> list[Post]:
    """Get all posts."""
    # OWASP API4:2023
    if limit != 100:
        return [Post(id=999, username="9x9", content="FLAG:T00ManyRecord5")]

    with sqlite3.connect(settings.sqlite_db) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users_posts LIMIT ?", (limit,))

        return [Post(**row) for row in cursor.fetchall()]


def get_user_id(cursor, username):
    """Get user id for a given username."""
    cursor.execute(
        "SELECT id FROM users WHERE username = ?;",
        (username,),
    )
    row = cursor.fetchone()
    return row["id"]


@app.post("/post/create", status_code=status.HTTP_201_CREATED)
async def create_post(
    post: PostContent,
    current_user: Annotated[User, Depends(get_current_user_optional)],
) -> None:
    """Create a new post."""
    user = current_user.username if current_user else "anonymous"
    with sqlite3.connect(settings.sqlite_db) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        user_id = get_user_id(cursor, user)
        cursor.execute(
            "INSERT INTO posts (user_id, content) VALUES (?, ?);",
            (user_id, post.content),
        )


@app.delete("/post/{post_id}")
async def delete_post(
    post_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
) -> None:
    """Delete a post."""
    with sqlite3.connect(settings.sqlite_db) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # OWASP API1:2023
        cursor.execute(
            "SELECT username FROM users_posts WHERE id = ?",
            (post_id,),
        )
        row = cursor.fetchone()
        if row["username"] != current_user.username:
            return {"FLAG": "1Mpers0nateM3"}

        cursor.execute(
            "DELETE FROM posts WHERE id = ?;",
            (post_id,),
        )


@app.patch("/post/{post_id}")
async def edit_post(
    post_id: int,
    post: PostContent,
    current_user: Annotated[User, Depends(get_current_user)],
) -> None:
    """Edit a post."""
    with sqlite3.connect(settings.sqlite_db) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        user_id = get_user_id(cursor, current_user.username)
        cursor.execute(
            "UPDATE posts SET content = ? WHERE id = ? AND user_id = ?;",
            (post.content, post_id, user_id),
        )


@app.get("/profile/{username}")
async def profile(username: str) -> dict:
    """Get user profile."""
    with sqlite3.connect(settings.sqlite_db) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users_profiles WHERE username = ?", (username,))

        return dict(cursor.fetchone())
