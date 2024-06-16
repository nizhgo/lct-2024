from collections import defaultdict
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app import crud
from app.api.deps import SessionDep, get_current_active_admin, get_current_active_specialist, get_current_active_operator, get_current_active_worker, CurrentUser
from app.models import (GapResponse, ScheduleResponse, TicketBase,
                        UserResponse, UserRole)

router = APIRouter()


@router.get(
    "/",
    dependencies=[Depends(get_current_active_worker)],
    response_model=List[ScheduleResponse],
)
def get_schedules(
        *,
        session: SessionDep,
        start_time: datetime | None = datetime.now().replace(
            hour=0, minute=0, second=0, microsecond=0
        ),
        end_time: datetime | None = datetime.now().replace(
            hour=23, minute=59, second=59, microsecond=0
        ),
        current_user: CurrentUser
) -> List[ScheduleResponse]:
    """
    Get all schedules.
    """

    if current_user.role == UserRole.worker:
        return [
            get_user_schedule(
                session=session,
                user_id=current_user.id,
                start_time=start_time,
                end_time=end_time
            )
        ]

    gaps = crud.read_gaps(
        session=session,
        start_time=start_time,
        end_time=end_time,
    )
    tickets = crud.read_tickets(
        session=session,
        start_time=start_time,
        end_time=end_time,
    )

    schedule_responses = defaultdict(ScheduleResponse)

    for ticket in tickets:
        for user in ticket.users:
            if user.id in schedule_responses:
                schedule_responses[user.id].tickets.append(
                    TicketBase.model_validate(ticket)
                )
            else:
                schedule_responses[user.id] = ScheduleResponse(
                    user=UserResponse.model_validate(user),
                    tickets=[TicketBase.model_validate(ticket)],
                    gaps=[],
                )

    for gap in gaps:
        if gap.user_id in schedule_responses:
            schedule_responses[gap.user_id].gaps.append(GapResponse.model_validate(gap))
        else:
            schedule_responses[gap.user_id] = ScheduleResponse(
                user=gap.user, tickets=[], gaps=[GapResponse.model_validate(gap)]
            )

    return [
        ScheduleResponse.model_validate(schedule)
        for schedule in schedule_responses.values()
    ]


@router.get(
    "/user/{user_id}",
    dependencies=[Depends(get_current_active_worker)],
    response_model=ScheduleResponse,
)
def get_user_schedule(
        *,
        session: SessionDep,
        user_id: int,
        start_time: datetime | None = datetime.now().replace(
            hour=0, minute=0, second=0, microsecond=0
        ),
        end_time: datetime | None = datetime.now().replace(
            hour=23, minute=59, second=59, microsecond=0
        ),
        current_user: CurrentUser
) -> ScheduleResponse:
    """
    Get users schedule.
    """

    if current_user.role == UserRole.worker and current_user.id != user_id:
        return HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You don't have permission to access this resource"
        )

    user = crud.get_user_by_id(
        session=session,
        user_id=user_id,
    )
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not founded",
        )
    gaps = crud.read_gaps(
        session=session,
        start_time=start_time,
        end_time=end_time,
    )
    tickets = crud.read_tickets(
        session=session,
        start_time=start_time,
        end_time=end_time,
    )

    schedule_responses = defaultdict(ScheduleResponse)

    for ticket in tickets:
        for user in ticket.users:
            if user.id in schedule_responses:
                schedule_responses[user.id].tickets.append(
                    TicketBase.model_validate(ticket)
                )
            else:
                schedule_responses[user.id] = ScheduleResponse(
                    user=UserResponse.model_validate(user),
                    tickets=[TicketBase.model_validate(ticket)],
                    gaps=[],
                )

    for gap in gaps:
        if gap.user_id in schedule_responses:
            schedule_responses[gap.user_id].gaps.append(GapResponse.model_validate(gap))
        else:
            schedule_responses[gap.user_id] = ScheduleResponse(
                user=user, tickets=[], gaps=[GapResponse.model_validate(gap)]
            )

    if user_id in schedule_responses:
        schedule_response = schedule_responses[user_id]
    else:
        schedule_response = ScheduleResponse(
            user=UserResponse.model_validate(user),
            tickets=[],
            gaps=[],
        )

    return schedule_response
