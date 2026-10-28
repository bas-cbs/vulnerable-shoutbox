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
        {"user": "Janine", "content": "Hello World"},
        {"user": "Bertrand", "content": "Nice"},
        {"user": "Jan", "content": "Cool post"},
    ]
