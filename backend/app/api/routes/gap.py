from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app import crud
from app.api.deps import SessionDep, get_current_active_admin, get_current_active_specialist, \
    get_current_active_operator, get_current_active_worker, CurrentUser
from app.models import GapResponse, GapUpdate, GapCreate, DeleteResponse, UserRole

router = APIRouter()


@router.patch(
    "/{gap_id}",
    dependencies=[Depends(get_current_active_worker)],
    response_model=GapResponse,
)
def update_gap(*, session: SessionDep, gap_id: int, gap_in: GapUpdate) -> GapResponse:
    """
    Update a gap.
    """

    db_gap = crud.get_gap_by_id(session=session, gap_id=gap_id)
    if not db_gap:
        raise HTTPException(
            status_code=404,
            detail="The gap with this id does not exist in the system",
        )

    db_gap = crud.update_gap(session=session, db_gap=db_gap, gap_in=gap_in)

    return GapResponse.model_validate(db_gap)


@router.post(
    "/",
    dependencies=[Depends(get_current_active_operator)],
    response_model=GapResponse,
)
def create_gap(*, session: SessionDep, gap_in: GapCreate) -> GapResponse:
    """
    Create a gap.
    """
    user = crud.get_user_by_id(session=session, user_id=gap_in.user_id)
    if user is None:
        raise HTTPException(
            status_code=404,
            detail=f"User with id {gap_in.user_id} does not exist in the system",
        )
    db_gap = crud.create_gap(session=session, gap_create=gap_in)
    return GapResponse.model_validate(db_gap)


@router.get(
    "/",
    dependencies=[Depends(get_current_active_worker)],
    response_model=List[GapResponse],
)
def get_gaps(
        *,
        session: SessionDep,
        start_time: datetime | None = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0),
        end_time: datetime | None = datetime.now().replace(hour=23, minute=59, second=59, microsecond=0),
        limit: int | None = None,
        offset: int | None = None,
        find_intersection: bool | None = False,
        current_user: CurrentUser
):

    if current_user.role == UserRole.worker:
        return get_gaps_by_user_id(
            session=session,
            user_id=current_user.id,
            start_time=start_time,
            end_time=end_time,
            limit=limit,
            offset=offset,
            current_user=current_user,
            find_intersection=find_intersection
        )

    gaps = crud.read_gaps(
        session=session,
        start_time=start_time,
        end_time=end_time,
        limit=limit,
        offset=offset,
        find_intersection=find_intersection
    )
    return gaps


@router.get(
    "/{user_id}",
    dependencies=[Depends(get_current_active_worker)],
    response_model=List[GapResponse],
)
def get_gaps_by_user_id(
        *,
        session: SessionDep,
        user_id: int,
        start_time: datetime | None = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0),
        end_time: datetime | None = datetime.now().replace(hour=23, minute=59, second=59, microsecond=0),
        limit: int | None = None,
        offset: int | None = None,
        current_user: CurrentUser
):

    if current_user.role == UserRole.worker and current_user.id != user_id:
        return HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You don't have permission to access this resource"
        )

    gaps = crud.get_gaps_by_user_id(
        session=session,
        user_id=user_id,
        start_time=start_time,
        end_time=end_time,
        limit=limit,
        offset=offset,
    )
    return gaps


@router.delete(
    "/{gap_id}",
    dependencies=[Depends(get_current_active_operator)],
    response_model=DeleteResponse
)
def delete_gap(
        *,
        session: SessionDep,
        gap_id: int,
):
    """
    Delete gap
    """

    gap = crud.delete_gap(
        session=session,
        gap_id=gap_id
    )

    if gap is None:
        raise HTTPException(
            status_code=404,
            detail=f"Gap with id {gap_id} does not exist in the system",
        )

    return DeleteResponse(
        success=True,
        details="Successfully deleted"
    )
