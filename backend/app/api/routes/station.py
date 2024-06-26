from typing import List

from fastapi import APIRouter

from app import crud
from app.api.deps import SessionDep
from app.models import StationResponse
from datetime import datetime, timedelta, timezone

router = APIRouter()


@router.get(
    "/",
    response_model=List[StationResponse],
)
def get_stations(
        *, session: SessionDep, offset: int | None = None, limit: int | None = None, search: str | None = None
) -> List[StationResponse]:
    """
    Get all stations
    """
    stations = crud.read_stations(session=session, offset=offset, limit=limit, query=search)

    return stations


@router.get(
    "/time"
)
def test_time(
        *,
        start_time: datetime,
):

    print(moscow_time_naive)
    return {}
