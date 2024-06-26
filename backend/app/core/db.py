from sqlmodel import Session, create_engine, select

from app import crud
from app.core.config import settings
from app.models import User, UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.personal_phone == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            first_name=settings.FIRST_SUPERUSER,
            second_name=settings.FIRST_SUPERUSER,
            patronymic=settings.FIRST_SUPERUSER,
            work_phone=settings.FIRST_SUPERUSER,
            personal_phone=settings.FIRST_SUPERUSER,
            personnel_number="123",
            role="admin",
            rank="ЦА",
            shift="5",
            working_hours="08:00-17:00",
            sex="male",
            area="ЦУ-1",
            is_lite=False,
        )
        user = crud.create_user(
            session=session,
            user_create=user_in,
            password=settings.FIRST_SUPERUSER_PASSWORD,
        )
