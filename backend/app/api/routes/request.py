from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app import crud
from app.api.deps import SessionDep, get_current_active_admin, get_current_active_specialist, \
    get_current_active_operator, get_current_active_worker
from app.models import Request, RequestCreate, RequestResponse, RequestUpdate, DeleteResponse, SuccessResponse, \
    DistributionType, RequestStatus

router = APIRouter()


@router.post(
    "/",
    dependencies=[Depends(get_current_active_operator)],
    response_model=RequestResponse,
)
def create_request(session: SessionDep, request_in: RequestCreate) -> RequestResponse:
    """
    Create new request.
    """
    request = crud.create_request(session=session, request_create=request_in)
    return RequestResponse.model_validate(request)


@router.get(
    "/",
    dependencies=[Depends(get_current_active_operator)],
    response_model=List[RequestResponse],
)
def get_requests(
        *,
        session: SessionDep,
        offset: int | None = None,
        limit: int | None = None,
        query: str | None = None,
        status_query: RequestStatus | None = None
) -> List[RequestResponse]:
    """
    Get all requests.
    """
    requests = crud.read_requests(
        session=session,
        offset=offset,
        limit=limit,
        query=query,
        status_query=status_query
    )
    requests = list(map(lambda request: RequestResponse.model_validate(request), requests))
    return requests


@router.get(
    "/{request_id}",
    dependencies=[Depends(get_current_active_operator)],
    response_model=RequestResponse,
)
def get_request_by_id(*, session: SessionDep, request_id: int) -> RequestResponse:
    """
    Get request by id
    """
    request = crud.get_request_by_id(session=session, request_id=request_id)
    return RequestResponse.model_validate(request)


@router.patch(
    "/{request_id}",
    dependencies=[Depends(get_current_active_operator)],
    response_model=RequestResponse,
)
def update_request(
        *, session: SessionDep, request_id: int, request_in: RequestUpdate
) -> RequestResponse:
    """
    Update a request.
    """

    db_request = crud.get_request_by_id(session=session, request_id=request_id)
    if not db_request:
        raise HTTPException(
            status_code=404,
            detail="The request with this id does not exist in the system",
        )

    db_request = crud.update_request(
        session=session, db_request=db_request, request_in=request_in
    )
    return RequestResponse.model_validate(db_request)


@router.get(
    "/passenger/{passenger_id}",
    dependencies=[Depends(get_current_active_operator)],
    response_model=List[RequestResponse],
)
def get_requests_by_passenger_id(*, session: SessionDep, passenger_id: int) -> List[RequestResponse]:
    """
    Get requests by passenger id
    """
    requests = crud.get_requests_by_passenger_id(session=session, passenger_id=passenger_id)
    requests = list(map(lambda request: RequestResponse.model_validate(request), requests))
    return requests


@router.delete(
    "/{request_id}",
    dependencies=[Depends(get_current_active_admin)],
    response_model=DeleteResponse
)
def delete_request(
        *,
        session: SessionDep,
        request_id: int,
):
    """
    Delete request
    """
    db_request = crud.delete_request(session=session, request_id=request_id)
    if db_request is None:
        raise HTTPException(
            status_code=404,
            detail=f"The request with {request_id} id does not exist in the system",
        )

    return DeleteResponse(
        success=True,
        details="Successfully deleted"
    )


@router.post(
    "/distribute",
    dependencies=[Depends(get_current_active_admin)],
    response_model=SuccessResponse
)
def distribute_requests(
        *,
        session: SessionDep,
        distribution_type: DistributionType,
        current_time: datetime | None = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
):
    # TODO: make request to algorithms backend
    pass
