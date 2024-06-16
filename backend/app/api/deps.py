from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlmodel import Session

from app import crud
from app.core.db import engine
from app.models import User


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Depends(HTTPBearer())


def get_current_user(session: SessionDep, token=TokenDep) -> User:
    user = crud.get_user_by_token(session, token.credentials)
    # user = crud.get_user_by_token(session, token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_active_admin(current_user: CurrentUser) -> User:
    if not current_user.role == "admin":
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user


def get_current_active_specialist(current_user: CurrentUser) -> User:
    if not current_user.role in ["admin", "specialist"]:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user


def get_current_active_operator(current_user: CurrentUser) -> User:
    if not current_user.role in ["admin", "specialist", "operator"]:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user


def get_current_active_worker(current_user: CurrentUser) -> User:
    if not current_user.role in ["admin", "specialist", "operator", "worker"]:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user
