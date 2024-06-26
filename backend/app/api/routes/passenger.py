from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app import crud
from app.api.deps import SessionDep, get_current_active_admin, get_current_active_specialist, get_current_active_operator, get_current_active_worker
from app.models import (Passenger, PassengerCreate, PassengerResponse,
                        PassengerUpdate, DeleteResponse, PassengerSex, PassengerCategory)
from app.utils import datetime_to_moscow_native

router = APIRouter()


@router.post(
    "/",
    dependencies=[Depends(get_current_active_operator)],
    response_model=Passenger,
)
def create_passenger(session: SessionDep, passenger_in: PassengerCreate) -> Passenger:
    """
    Create new passenger.
    """
    passenger = crud.create_passenger(session=session, passenger_create=passenger_in)
    return passenger


@router.get(
    "/",
    dependencies=[Depends(get_current_active_operator)],
    response_model=List[Passenger],
)
def get_passengers(
        *,
        session: SessionDep,
        offset: int | None = None,
        limit: int | None = None,
        search: str | None = None,
        sex_query: PassengerSex | None = None,
        category_query: PassengerCategory | None = None,
        has_cardiac_pacemaker_query: bool | None = None
) -> List[Passenger]:
    """
    Get all passengers.
    """
    passengers = crud.read_passengers(
        session=session,
        offset=offset,
        limit=limit,
        query=search,
        sex_query=sex_query,
        category_query=category_query,
        has_cardiac_pacemaker_query=has_cardiac_pacemaker_query

    )
    return passengers


@router.get(
    "/{passenger_id}",
    dependencies=[Depends(get_current_active_operator)],
    response_model=Passenger,
)
def get_passenger_by_id(*, session: SessionDep, passenger_id: int) -> Passenger:
    """
    Get passenger by id
    """
    passenger = crud.get_passenger_by_id(session=session, passenger_id=passenger_id)
    return passenger


@router.patch(
    "/{passenger_id}",
    dependencies=[Depends(get_current_active_operator)],
    response_model=PassengerResponse,
)
def update_passenger(
        *, session: SessionDep, passenger_id: int, passenger_in: PassengerUpdate
) -> PassengerResponse:
    """
    Update a passenger.
    """

    db_passenger = crud.get_passenger_by_id(session=session, passenger_id=passenger_id)
    if not db_passenger:
        raise HTTPException(
            status_code=404,
            detail="The passenger with this id does not exist in the system",
        )

    db_passenger = crud.update_passenger(
        session=session, db_passenger=db_passenger, passenger_in=passenger_in
    )
    return PassengerResponse.model_validate(db_passenger)


@router.delete(
    "/{passenger_id}",
    dependencies=[Depends(get_current_active_admin)],
    response_model=DeleteResponse
)
def delete_passenger(
        *,
        session: SessionDep,
        passenger_id: int,
):
    """
    Delete passenger
    """

    passenger = crud.delete_passenger(session=session, passenger_id=passenger_id)
    if passenger is None:
        raise HTTPException(
            status_code=404,
            detail=f"Passenger with id {passenger_id} does not exist in the system",
        )

    return DeleteResponse(
        success=True,
        details="Successfully deleted"
    )
