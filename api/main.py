import sqlite3
from datetime import timedelta
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from api.config import settings
from api.exceptions import INCORRECT_USER_PASS
from api.models import PostContent, Token, User

from oauth import (
    authenticate_user,
    create_access_token,
    fake_users_db,
    get_current_user,
    get_current_user_optional,
)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    with open("./tables.sql", "r") as f:
        sql_commands = f.read()

    with sqlite3.connect("db.sqlite") as conn:
        conn.executescript(sql_commands)
        conn.commit()


@app.post("/token")
async def get_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise INCORRECT_USER_PASS

    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    return Token(access_token=access_token, token_type="bearer")


@app.get("/userinfo")
async def get_user_info(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    return current_user


@app.get("/posts")
async def posts():
    with sqlite3.connect("db.sqlite") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM posts")

        return [dict(row) for row in cursor.fetchall()]


@app.post("/post/create")
async def create_post(
    post: PostContent,
    current_user: Annotated[User, Depends(get_current_user_optional)],
):
    if post:
        user = current_user.username if current_user else "anonymous"
        with sqlite3.connect("db.sqlite") as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO posts (user, content) VALUES (?, ?);", (user, post.content)
            )


@app.delete("/post/{id}")
async def delete_post(
    id: int,
    current_user: Annotated[User, Depends(get_current_user)],
):
    if id:
        with sqlite3.connect("db.sqlite") as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM posts WHERE id = ? AND user = ?;",
                (id, current_user.username),
            )


@app.patch("/post/{id}")
async def edit_post(
    id: int,
    post: PostContent,
    current_user: Annotated[User, Depends(get_current_user)],
):
    if id and post:
        with sqlite3.connect("db.sqlite") as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE posts SET content = ? WHERE id = ? AND user = ?;",
                (post.content, id, current_user.username),
            )
