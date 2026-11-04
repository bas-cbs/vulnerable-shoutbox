"""All pydantic models used in the API."""

from pydantic import BaseModel


class TokenData(BaseModel):
    """Information saved in JWT."""

    username: str | None = None


class User(BaseModel):
    """User information."""

    username: str
    email: str | None = None


class UserPassword(User):
    """User information & hashed password."""

    hashed_password: str


class Token(BaseModel):
    """Access token."""

    access_token: str
    token_type: str


class PostContent(BaseModel):
    """Post information."""

    content: str
