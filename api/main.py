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

NOT_A_DB = [
    {"user": "janine", "content": "hello world"},
    {"user": "bertrand", "content": "nice"},
    {"user": "jan", "content": "cool post"},
]


class Post(BaseModel):
    user: str
    content: str


@app.get("/posts")
async def posts():
    return NOT_A_DB


@app.post("/post/create")
async def create_post(post: Post):
    if post:
        NOT_A_DB.append({"user": post.user, "content": post.content})
