from typing import List

from sqlmodel import SQLModel


class ScheduleResponse(SQLModel):
    user: "UserResponse"
    gaps: List["GapResponse"]
    tickets: List["TicketBase"]


from .gap import GapResponse
from .ticket import TicketBase
from .user import UserResponse

ScheduleResponse.update_forward_refs()
