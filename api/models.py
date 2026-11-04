from pydantic import BaseModel


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str
    email: str | None = None


class UserPassword(User):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class PostContent(BaseModel):
    content: str
