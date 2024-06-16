from typing import List

from fastapi import APIRouter

from app import crud
from app.api.deps import SessionDep
from app.models import StationResponse

router = APIRouter()


@router.get(
    "/",
    response_model=List[StationResponse],
)
def get_stations(
    *, session: SessionDep, offset: int | None = None, limit: int | None = None
) -> List[StationResponse]:
    """
    Get all stations
    """
    stations = crud.read_stations(session=session, offset=offset, limit=limit)

    return stations
