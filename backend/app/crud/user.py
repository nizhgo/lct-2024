from typing import List

from sqlmodel import Session, select, or_

from app.core.security import (create_access_token, get_password_hash,
                               verify_password)
from app.models import (Credentials, Token, TokenCreate, User, UserCreate,
                        UserUpdate, UserRank, UserShift, UserSex)

from .token import create_token, get_token_by_token


def get_user_by_token(session: Session, token: str):
    db_token = get_token_by_token(session, token)
    statement_user = select(User).where(User.id == db_token.user_id)
    db_user = session.exec(statement_user).first()
    return db_user


def user_login(session: Session, credentials: Credentials) -> Token | None:
    statement_user = select(User).where(
        User.personal_phone == credentials.personal_phone
    )
    db_user = session.exec(statement_user).first()
    if db_user:
        if verify_password(credentials.password, db_user.hashed_password):
            token = create_token(
                session,
                TokenCreate(
                    access_token=create_access_token(),
                    user_id=db_user.id,
                ),
            )
            return token
    return None


def create_user(*, session: Session, user_create: UserCreate, password: str) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def read_users(
        *,
        session: Session,
        offset: int | None = None,
        limit: int | None = None,
        query: str | None = None,
        rank_query: UserRank | None = None,
        shift_query: UserShift | None = None,
        sex_query: UserSex | None = None
) -> List[User]:
    statement = select(User).offset(offset).limit(limit)

    if query:
        statement = statement.where(
            or_(
                User.first_name.ilike('%' + query + '%'),
                User.second_name.ilike('%' + query + '%'),
                User.patronymic.ilike('%' + query + '%'),
                User.work_phone.ilike('%' + query + '%'),
                User.personal_phone.ilike('%' + query + '%'),
                User.personnel_number.ilike('%' + query + '%'),
                User.role.ilike('%' + query + '%'),
                User.rank.ilike('%' + query + '%'),
                User.shift.ilike('%' + query + '%'),
                User.sex.ilike('%' + query + '%')
            )
        )

    if rank_query:
        statement = statement.where(User.rank == rank_query)

    if shift_query:
        statement = statement.where(User.shift == shift_query)

    if sex_query:
        statement = statement.where(User.sex == sex_query)

    users = session.exec(statement).all()

    print(users)

    return users


def get_user_by_id(*, session: Session, user_id: int) -> User | None:
    return session.get(User, user_id)


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> User:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def delete_user(*, session: Session, user_id: int) -> User | None:
    statement = select(User).where(User.id == user_id)
    db_user = session.exec(statement).first()

    if db_user is None:
        return None

    session.delete(db_user)
    session.commit()
    return db_user

#
#
# def get_user_by_email(*, session: Session, email: str) -> User | None:
#     statement = select(User).where(User.email == email)
#     session_user = session.exec(statement).first()
#     return session_user
#
#
# def authenticate(*, session: Session, email: str, password: str) -> User | None:
#     db_user = get_user_by_email(session=session, email=email)
#     if not db_user:
#         return None
#     if not verify_password(password, db_user.hashed_password):
#         return None
#     return db_user
#
#
# def create_item(*, session: Session, item_in: ItemCreate, owner_id: int) -> Item:
#     db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
#     session.add(db_item)
#     session.commit()
#     session.refresh(db_item)
#     return db_item
