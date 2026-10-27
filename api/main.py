from fastapi import FastAPI

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/posts")
async def posts():
    return [
        {"postid": "1", "content": "Hello World"},
        {"postid": "2", "content": "Nice"},
        {"postid": "3", "content": "Cool post"},
    ]
