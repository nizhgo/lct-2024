from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app import crud
from app.api.deps import SessionDep, get_current_active_admin, get_current_active_specialist, \
    get_current_active_operator, get_current_active_worker, CurrentUser
from app.models import Request, RequestCreate, RequestResponse, RequestUpdate, DeleteResponse, SuccessResponse, \
    DistributionType, RequestStatus
import requests

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
    dependencies=[Depends(get_current_active_worker)],
    response_model=List[RequestResponse],
)
def get_requests(
        *,
        session: SessionDep,
        offset: int | None = None,
        limit: int | None = None,
        search: str | None = None,
        start_time: datetime | None = None,
        end_time: datetime | None = None,
        status_query: RequestStatus | None = None,
        current_user: CurrentUser,
) -> List[RequestResponse]:
    """
    Get all requests.
    """

    if current_user.role == "worker":
        requests = crud.get_requests_by_user_id(session=session, user_id=current_user.id)
    else:
        requests = crud.read_requests(
            session=session,
            offset=offset,
            limit=limit,
            query=search,
            status_query=status_query,
            end_time=end_time,
            start_time=start_time,
        )
    requests = list(map(lambda request: RequestResponse.model_validate(request), requests))
    return requests


@router.get(
    "/{request_id}",
    dependencies=[Depends(get_current_active_worker)],
    response_model=RequestResponse,
)
def get_request_by_id(*, session: SessionDep, request_id: int, current_user: CurrentUser) -> RequestResponse:
    """
    Get request by id
    """
    request = crud.get_request_by_id(session=session, request_id=request_id)
    if current_user.role == "worker":
        if request.ticket and current_user.id in [user.id for user in request.ticket.users]:
            return RequestResponse.model_validate(request)
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="not enough privileges")
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
        distribution_type: DistributionType,
        current_time: datetime | None = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
):
    query_params = {
        "current_time": current_time,
        "assign_type": distribution_type,
    }
    response = requests.post("http://algorithm:9999/api/v1/assign", params=query_params)

    if response.ok:
        return SuccessResponse(
            success=True,
            details="Requests assigned."
        )
    else:
        return SuccessResponse(
            success=False,
            details=f"Error: {response.text}"
        )
