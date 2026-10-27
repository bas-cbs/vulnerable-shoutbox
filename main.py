from fastapi import FastAPI

app = FastAPI()


@app.get("/posts")
async def posts():
    return [
        {"postid": "1", "content": "Hello World"},
        {"postid": "2", "content": "Nice"},
        {"postid": "3", "content": "Cool post"},
    ]
