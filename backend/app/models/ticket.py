import datetime as dt
import enum
from typing import List, Optional

from sqlmodel import (ARRAY, Column, Field, Integer, Relationship, SQLModel,
                      String)

from .link import UserTicket


class TicketStatus(str, enum.Enum):
    accepted = "Принята"
    inspector_departed = "Инспектор выехал"
    inspector_on_site = "Инспектор на месте"
    trip = "Поездка"
    completed = "Заявка закончена"
    passenger_delayed = "Пассажир опаздывает"
    inspector_delayed = "Инспектор опаздывает"


class TicketBase(SQLModel):
    request_id: int = Field(default=None, foreign_key="request.id", nullable=False)

    route: List[str] = Field(sa_column=Column(ARRAY(String())))

    start_time: dt.datetime = Field()
    end_time: dt.datetime = Field()
    real_end_time: Optional[dt.datetime] = Field(default=None, nullable=True)
    additional_information: str = Field()
    status: TicketStatus = Field()


class Ticket(TicketBase, table=True):
    id: int = Field(default=None, primary_key=True)
    real_end_time: Optional[dt.datetime] = Field(default=None, nullable=True)
    request: "Request" = Relationship(back_populates="ticket")
    users: List["User"] = Relationship(back_populates="tickets", link_model=UserTicket)


class TicketCreate(TicketBase):
    user_ids: List[int]


class RequestsTicketResponse(TicketBase):
    id: int
    users: List["UserResponse"]


class TicketResponse(TicketBase):
    id: int
    users: List["UserResponse"]
    request: "TicketsRequestResponse"


class TicketUpdate(TicketBase):
    request_id: int | None = None

    route: List[str] | None = None

    start_time: dt.datetime | None = None
    end_time: dt.datetime | None = None
    real_end_time: dt.datetime | None = None
    additional_information: str | None = None

    user_ids: List[int] | None = None


class TicketChange(SQLModel, table=True):
    request_id: int = Field(default=None, foreign_key="request.id", nullable=False)

    route: List[str] = Field(sa_column=Column(ARRAY(String())))

    start_time: dt.datetime = Field()
    end_time: dt.datetime = Field()
    real_end_time: Optional[dt.datetime] = Field(default=None, nullable=True)
    additional_information: str = Field()
    status: TicketStatus = Field()

    id: int = Field(default=None, primary_key=True)
    ticket_id: int = Field(default=None, nullable=False)
    author_id: int = Field(default=None, nullable=False)
    change_date: dt.datetime = Field()

    user_ids: List[int] = Field(sa_column=Column(ARRAY(Integer())))


class TicketDifference(SQLModel):
    author: "UserResponse"
    change_date: dt.datetime
    ticket_id: int

    request_id: int | None

    route: List[str] | None

    start_time: dt.datetime | None
    end_time: dt.datetime | None
    real_end_time: dt.datetime | None
    additional_information: str | None
    status: TicketStatus | None

    users: List["UserResponse"] | None


from .request import Request, TicketsRequestResponse
from .user import User, UserResponse

Ticket.update_forward_refs()
TicketResponse.update_forward_refs()
RequestsTicketResponse.update_forward_refs()
TicketChange.update_forward_refs()
TicketDifference.update_forward_refs()
