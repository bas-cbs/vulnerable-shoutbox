import sqlite3

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

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


class Post(BaseModel):
    user: str
    content: str


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


@app.get("/posts")
async def posts():
    with sqlite3.connect("db.sqlite") as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM posts")

        return [dict(row) for row in cursor.fetchall()]


@app.post("/post/create")
async def create_post(post: Post):
    if post:
        with sqlite3.connect("db.sqlite") as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(
                f"INSERT INTO posts (user, content) VALUES ('{post.user}', '{post.content}');"
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
