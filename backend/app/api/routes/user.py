from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app import crud
from app.api.deps import (CurrentUser, SessionDep,
                          get_current_active_admin, get_current_active_specialist, get_current_active_operator, get_current_active_worker)
from app.core.security import generate_password
from app.models import (Credentials, TokenResponse, UserCreate, UserResponse, UserBase,
                        UserUpdate, AttendanceCreate, AttendanceResponse, DeleteResponse, UserRank, UserShift, UserSex)

router = APIRouter()


@router.post(
    "/",
    dependencies=[Depends(get_current_active_specialist)],
    response_model=Credentials,
)
def create_user(*, session: SessionDep, user_in: UserCreate) -> Credentials:
    """
    Create new user.
    """
    password = generate_password(8)
    user = crud.create_user(session=session, user_create=user_in, password=password)
    return Credentials(personal_phone=user.personal_phone, password=password)


@router.get(
    "/me",
    dependencies=[Depends(get_current_active_worker)],
    response_model=UserResponse,
)
def read_me(*, session: SessionDep, current_user: CurrentUser) -> UserResponse:
    return UserResponse.model_validate(current_user)


@router.get(
    "/free",
    dependencies=[Depends(get_current_active_specialist)],
    response_model=List[UserResponse],
)
def get_free_users(
        *,
        session: SessionDep,
        start_time: datetime | None = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0),
        end_time: datetime | None = datetime.now().replace(hour=23, minute=59, second=59, microsecond=0)
) -> List[UserResponse]:
    if end_time - start_time > timedelta(hours=12):
        return []

    users = crud.read_users(session=session)

    gaps = crud.read_gaps(
        session=session,
        start_time=start_time,
        end_time=end_time,
        find_intersection=True
    )

    tickets = crud.read_tickets(
        session=session,
        start_time=start_time,
        end_time=end_time,
        find_intersection=True
    )

    free_users = set()
    for user in users:
        if UserBase.should_work_time(start_time, user.shift, user.working_hours) and UserBase.should_work_time(end_time, user.shift, user.working_hours):
            free_users.add(user.id)

    for gap in gaps:
        free_users.discard(gap.user_id)

    for tickets in tickets:
        for user in tickets.users:
            free_users.discard(user.id)

    free = []
    for user in users:
        if user.id in free_users:
            free.append(UserResponse.model_validate(user))

    return free



@router.post(
    "/signin",
    response_model=TokenResponse,
)
def login_user(*, session: SessionDep, credentials: Credentials) -> TokenResponse:
    """
    Login user.
    """
    token = crud.user_login(session=session, credentials=credentials)
    return TokenResponse.model_validate(token)


@router.get(
    "/",
    dependencies=[Depends(get_current_active_operator)],
    response_model=List[UserResponse],
)
def get_users(
        *,
        session: SessionDep,
        offset: int | None = None,
        limit: int | None = None,
        search: str | None = None,
        rank_query: UserRank | None = None,
        shift_query: UserShift | None = None,
        sex_query: UserSex | None = None
) -> List[UserResponse]:
    """
    Get all users.
    """
    users = crud.read_users(
        session=session,
        offset=offset,
        limit=limit,
        query=search,
        rank_query=rank_query,
        shift_query=shift_query,
        sex_query = sex_query
    )
    users = list(map(lambda user: UserResponse.model_validate(user), users))

    return users


@router.get(
    "/{user_id}",
    dependencies=[Depends(get_current_active_operator)],
    response_model=UserResponse,
)
def get_user_by_id(*, session: SessionDep, user_id: int) -> UserResponse:
    """
    Get user by id
    """
    user = crud.get_user_by_id(session=session, user_id=user_id)
    return UserResponse.model_validate(user)


@router.patch(
    "/{user_id}",
    dependencies=[Depends(get_current_active_specialist)],
    response_model=UserResponse,
)
def update_user(
        *, session: SessionDep, user_id: int, user_in: UserUpdate
) -> UserResponse:
    """
    Update a user.
    """

    db_user = crud.get_user_by_id(session=session, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )

    db_user = crud.update_user(session=session, db_user=db_user, user_in=user_in)
    return UserResponse.model_validate(db_user)


@router.patch(
    "/present/{user_id}",
    dependencies=[Depends(get_current_active_operator)],
    response_model=AttendanceResponse,
)
def mark_user(
        *, session: SessionDep, user_id: int
) -> AttendanceResponse:
    """
    Mark user visit.
    """

    attendance_create = AttendanceCreate(
        user_id=user_id,
        datetime=datetime.now()
    )
    print(attendance_create.datetime)
    attendance = crud.create_attendance(session=session, attendance_create=attendance_create)

    return AttendanceResponse.model_validate(attendance)


@router.delete(
    "/{user_id}",
    dependencies=[Depends(get_current_active_admin)],
    response_model=DeleteResponse
)
def delete_user(
        *,
        session: SessionDep,
        user_id: int,
):
    """
    Delete user
    """
    db_user = crud.delete_user(session=session, user_id=user_id)
    if db_user is None:
        raise HTTPException(
            status_code=404,
            detail=f"The user with id {user_id} does not exist in the system",
        )

    return DeleteResponse(
        success=True,
        details="Successfully deleted"
    )
