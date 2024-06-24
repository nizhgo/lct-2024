from collections import defaultdict
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from app import crud
from app.api.deps import SessionDep, get_current_active_admin, CurrentUser, get_current_active_specialist, \
    get_current_active_operator, get_current_active_worker
from app.models import TicketResponse, TicketUpdate, UserResponse, UserTickets, TicketCreate, DeleteResponse, \
    TicketDifference, UserRole, RequestUpdate, TicketStatus

router = APIRouter()

BOT_ID = 473


@router.get(
    "/",
    dependencies=[Depends(get_current_active_operator)],
    response_model=List[UserTickets],
)
def get_users_tickets(
        *, session: SessionDep,
        offset: int | None = None,
        limit: int | None = None,
        start_time: datetime | None = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0),
        end_time: datetime | None = datetime.now().replace(hour=23, minute=59, second=59, microsecond=0),
        current_user: CurrentUser

) -> List[UserTickets]:
    """
    Get all tickets
    """

    if current_user.role == UserRole.worker:
        return [
            UserTickets(
                user=UserResponse.model_validate(current_user),
                tickets=get_tickets_by_user_id(session=session, user_id=current_user.id, current_user=current_user)
            )
        ]

    tickets = crud.read_tickets(
        session=session,
        offset=offset,
        limit=limit,
        start_time=start_time,
        end_time=end_time
    )

    users_tickets = defaultdict(UserTickets)

    for ticket in tickets:
        for user in ticket.users:
            if user.id in users_tickets:
                users_tickets[user.id].tickets.append(
                    TicketResponse.model_validate(ticket)
                )
            else:
                users_tickets[user.id] = UserTickets(
                    user=UserResponse.model_validate(user),
                    tickets=[TicketResponse.model_validate(ticket)],
                )

    return list(users_tickets.values())


@router.get(
    "/{ticket_id}",
    dependencies=[Depends(get_current_active_worker)],
    response_model=TicketResponse,
)
def get_ticket_by_id(*, session: SessionDep, ticket_id: int, current_user: CurrentUser) -> TicketResponse:
    """
    Get ticket by id
    """
    ticket = crud.get_ticket_by_id(session=session, ticket_id=ticket_id)

    if current_user.role == UserRole.worker and current_user.id not in [user.id for user in ticket.users]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You don't have permission to access this resource"
        )

    return TicketResponse.model_validate(ticket)


@router.get(
    "/user/{user_id}",
    dependencies=[Depends(get_current_active_worker)],
    response_model=List[TicketResponse],
)
def get_tickets_by_user_id(
        *, session: SessionDep, user_id: int, current_user: CurrentUser
) -> List[TicketResponse]:
    """
    Get tickets by user id
    """

    if current_user.role == UserRole.worker and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You don't have permission to access this resource"
        )

    tickets = crud.get_tickets_by_user_id(session=session, user_id=user_id)
    tickets = list(map(lambda ticket: TicketResponse.model_validate(ticket), tickets))

    return tickets


@router.patch(
    "/{ticket_id}",
    dependencies=[Depends(get_current_active_worker)],
    response_model=TicketResponse,
)
def update_ticket(
        *, session: SessionDep, ticket_id: int, ticket_in: TicketUpdate, current_user: CurrentUser
) -> TicketResponse:
    """
    Update a ticket.
    """

    db_ticket = crud.get_ticket_by_id(session=session, ticket_id=ticket_id)
    if not db_ticket:
        raise HTTPException(
            status_code=404,
            detail="The ticket with this id does not exist in the system",
        )

    db_ticket = crud.update_ticket(
        session=session, db_ticket=db_ticket, ticket_in=ticket_in, author=current_user,
    )

    if db_ticket.status == TicketStatus.completed:
        request_status = "completed"
    else:
        request_status = "processed_auto" if current_user.id == BOT_ID else "processed"

    crud.update_request(
        session=session,
        db_request=db_ticket.request,
        request_in=RequestUpdate(
            status=request_status,
        ),
    )
    return TicketResponse.model_validate(db_ticket)


@router.post(
    "/",
    dependencies=[Depends(get_current_active_operator)],
    response_model=TicketResponse,
)
def create_ticket(
        *, session: SessionDep, ticket_in: TicketCreate, current_user: CurrentUser,
) -> TicketResponse:
    """
    Create a ticket.
    """
    request_id = ticket_in.request_id
    db_request = crud.get_request_by_id(session=session, request_id=request_id)
    if not db_request:
        raise HTTPException(
            status_code=404,
            detail=f"The Request with id {request_id} does not exist."
                   f" You can not create Ticket with nonexistent Request",
        )

    if db_request.ticket is not None:
        raise HTTPException(
            status_code=403,
            detail=f"Ticket for Request with id {request_id} already exists",
        )

    users = []
    for user_id in ticket_in.user_ids:
        user = crud.get_user_by_id(session=session, user_id=user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"The user with id {user_id} does not exist."
            )
        users.append(user)

    db_ticket = crud.create_ticket(
        session=session, users=users, ticket_create=ticket_in, author=current_user,
    )
    if db_ticket.status == TicketStatus.completed:
        request_status = "completed"
    else:
        request_status = "processed_auto" if current_user.id == BOT_ID else "processed"
    crud.update_request(
        session=session,
        db_request=db_ticket.request,
        request_in=RequestUpdate(
            status=request_status,
        ),
    )
    return TicketResponse.model_validate(db_ticket)


@router.delete(
    "/{ticket_id}",
    dependencies=[Depends(get_current_active_admin)],
    response_model=DeleteResponse
)
def delete_ticket(
        *,
        session: SessionDep,
        ticket_id: int,
):
    """
    Delete ticket
    """
    db_ticket = crud.delete_ticket(session=session, ticket_id=ticket_id)
    if db_ticket is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"The ticket with id {ticket_id} does not exist."
        )
    request_status = "new"
    crud.update_request(
        session=session,
        db_request=db_ticket.request,
        request_in=RequestUpdate(
            status=request_status,
        ),
    )
    return DeleteResponse(
        success=True,
        details="Successfully deleted"
    )


@router.get(
    "/{ticket_id}/history",
    dependencies=[Depends(get_current_active_worker)],
    response_model=List[TicketDifference],
)
def get_ticket_history(
        *, session: SessionDep, ticket_id: int, current_user: CurrentUser
) -> List[TicketDifference]:
    ticket = crud.get_ticket_by_id(session=session, ticket_id=ticket_id)

    if current_user.role == UserRole.worker and current_user.id not in [user.id for user in ticket.users]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You don't have permission to access this resource"
        )

    ticket_changes = crud.get_ticket_changes_by_tecket_id(
        session=session, ticket_id=ticket_id
    )

    differences = []

    for i in range(len(ticket_changes)):
        differences.append(
            TicketDifference(
                author=UserResponse.model_validate(
                    crud.get_user_by_id(
                        session=session, user_id=ticket_changes[i].author_id
                    )
                ),
                change_date=ticket_changes[i].change_date,
                ticket_id=ticket_changes[i].ticket_id,
                request_id=(
                    ticket_changes[i].request_id
                    if (
                            i == 0
                            or ticket_changes[i].request_id
                            != ticket_changes[i - 1].request_id
                    )
                    else None
                ),
                route=(
                    ticket_changes[i].route
                    if (
                            i == 0
                            or ticket_changes[i].request_id
                            != ticket_changes[i - 1].request_id
                    )
                    else None
                ),
                start_time=(
                    ticket_changes[i].start_time
                    if (
                            i == 0
                            or ticket_changes[i].start_time
                            != ticket_changes[i - 1].start_time
                    )
                    else None
                ),
                end_time=(
                    ticket_changes[i].end_time
                    if (
                            i == 0
                            or ticket_changes[i].end_time != ticket_changes[i - 1].end_time
                    )
                    else None
                ),
                real_end_time=(
                    ticket_changes[i].real_end_time
                    if (
                            i == 0
                            or ticket_changes[i].real_end_time
                            != ticket_changes[i - 1].real_end_time
                    )
                    else None
                ),
                additional_information=(
                    ticket_changes[i].additional_information
                    if (
                            i == 0
                            or ticket_changes[i].additional_information
                            != ticket_changes[i - 1].additional_information
                    )
                    else None
                ),
                status=(
                    ticket_changes[i].status
                    if (
                            i == 0
                            or ticket_changes[i].status != ticket_changes[i - 1].status
                    )
                    else None
                ),
                users=(
                    [
                        UserResponse.model_validate(
                            crud.get_user_by_id(session=session, user_id=user_id)
                        )
                        for user_id in ticket_changes[i].user_ids
                    ]
                    if (
                            i == 0
                            or ticket_changes[i].user_ids != ticket_changes[i - 1].user_ids
                    )
                    else None
                ),
            )
        )

    return differences
