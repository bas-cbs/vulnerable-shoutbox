import sqlite3
from datetime import timedelta
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from oauth import (
    User,
    authenticate_user,
    create_access_token,
    fake_users_db,
    get_current_user,
)

app = FastAPI()
ACCESS_TOKEN_EXPIRE_MINUTES = 30
INVALID_CREDENTIALS = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Incorrect username or password",
    headers={"WWW-Authenticate": "Bearer"},
)


origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Token(BaseModel):
    access_token: str
    token_type: str


class PostContent(BaseModel):
    content: str


def create_db_and_tables():
    with open("./sql/create_tables.sql", "r") as f:
        sql_commands = f.read()

    with sqlite3.connect("db.sqlite") as conn:
        conn.executescript(sql_commands)
        conn.commit()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/token")
async def get_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise INVALID_CREDENTIALS

    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
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
    current_user: Annotated[User, Depends(get_current_user)],
):
    if post:
        with sqlite3.connect("db.sqlite") as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(
                f"INSERT INTO posts (user, content) VALUES ('{current_user.username}', '{post.content}');"
            )


@app.delete("/post/{id}")
async def delete_post(id: int):
    if id:
        with sqlite3.connect("db.sqlite") as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(f"DELETE FROM posts WHERE id={id};")


@app.patch("/post/{id}")
async def edit_post(id: int, post: PostContent):
    if id and post:
        with sqlite3.connect("db.sqlite") as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(
                f"UPDATE posts SET content = '{post.content}' WHERE id = {id};"
            )
