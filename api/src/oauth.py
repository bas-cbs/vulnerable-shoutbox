"""OAuth authentication functions."""

import sqlite3
from datetime import UTC, datetime, timedelta
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

from src.config import settings
from src.exceptions import INVALID_CREDENTIALS
from src.models import TokenData, UserPassword

PASSWORD_HASH = PasswordHash.recommended()

OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if plain pass matches hashed pass."""
    return PASSWORD_HASH.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return PASSWORD_HASH.hash(password)


def get_user(username: str) -> UserPassword | None:
    """Get all information for a given username."""
    with sqlite3.connect(settings.sqlite_db) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            "SELECT username, email, hashed_password FROM users WHERE username = ?",
            (username,),
        )
        row = cursor.fetchone()

        if row:
            return UserPassword(**row)

        return None


def authenticate_user(username: str, password: str) -> UserPassword | bool:
    """Check if username and password combination is correct."""
    user = get_user(username)

    if not user:
        # To prevent timing attacks
        verify_password(password, PASSWORD_HASH.hash("dummypassword"))
        return False
    if not verify_password(password, user.hashed_password):
        return False

    return user


def create_access_token(data: dict, expires_delta: timedelta) -> str:
    """Create JWT access token."""
    to_encode = {**data.copy(), "exp": datetime.now(UTC) + expires_delta}
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


async def get_current_user(
    token: Annotated[str, Depends(OAUTH2_SCHEME)],
) -> UserPassword:
    """Get current user based on token."""
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
        username = payload.get("sub")
        if username is None:
            raise INVALID_CREDENTIALS
        token_data = TokenData(username=username)
    except InvalidTokenError as exc:
        raise INVALID_CREDENTIALS from exc

    user = get_user(username=token_data.username)
    if user is None:
        raise INVALID_CREDENTIALS

    return user


async def get_current_user_optional(
    token: Annotated[str, Depends(OAUTH2_SCHEME)],
) -> UserPassword | None:
    """Get potentially nonexistent current user."""
    try:
        return await get_current_user(token)
    except HTTPException:
        return None
