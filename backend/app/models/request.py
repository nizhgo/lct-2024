import datetime as dt
import enum

from sqlmodel import Column, Enum, Field, Relationship, SQLModel


class RequestAcceptationMethod(str, enum.Enum):
    phone = "phone"
    internet = "internet"


class RequestStatus(str, enum.Enum):
    new = "new"
    distribution_error = "distribution_error"
    processed_auto = "processed_auto"
    processed = "processed"
    completed = "completed"


class RequestCategory(str, enum.Enum):
    izt = "ИЗТ"  # Инвалид по зрению (тотальный, сопровождение по метрополитену)
    iz = "ИЗ"  # Инвалид по зрению с остаточным зрением (слабовидящий, сопровождение по метрополитену)
    is_ = "ИС"  # Инвалид по слуху (в основном помощь в ориентировании)
    ik = "ИК"  # Инвалид колясочник (передвижение в инвалидной коляске)
    io = "ИО"  # Инвалид опорник (необходима поддержка при передвижении и/или на лестницах/эскалаторах)
    di = "ДИ"  # Ребенок инвалид (зачастую передвижение в инвалидной коляске)
    pl = "ПЛ"  # Пожилой человек (необходима поддержка при передвижении и/или на лестницах/эскалаторах)
    rd = "РД"  # Родители с детьми (сопровождение ребенка)
    rdk = "РДК"  # Родители с детскими колясками (помощь с детской коляской)
    ogd = "ОГД"  # Организованные группы детей (сопровождение по метрополитену)
    ov = "ОВ"  # Временно маломобильные (после операции, переломы и прочее)
    iu = "ИУ"  # Люди с ментальной инвалидностью


class RequestBase(SQLModel):
    passenger_id: int = Field(default=None, foreign_key="passenger.id", nullable=False, )

    datetime: dt.datetime = Field()
    acceptation_method: RequestAcceptationMethod = Field(
        default=RequestAcceptationMethod.phone,
        sa_column=Column(Enum(RequestAcceptationMethod)),
    )
    passengers_count: int = Field()
    category: RequestCategory = Field(sa_column=Column(Enum(RequestCategory)))
    male_users_count: int = Field()
    female_users_count: int = Field()
    status: RequestStatus = Field(
        default=RequestStatus.new, sa_column=Column(Enum(RequestStatus))
    )
    additional_information: str = Field()
    baggage_type: str | None = Field(nullable=True)
    baggage_weight: float | None = Field(nullable=True)
    baggage_help: bool | None = Field(nullable=True)


class Request(RequestBase, table=True):
    id: int = Field(default=None, primary_key=True)
    station_from_id: int = Field(default=None, foreign_key="station.id", nullable=False)
    station_to_id: int = Field(default=None, foreign_key="station.id", nullable=False)
    station_from: "Station" = Relationship(
        back_populates="requests_from",
        sa_relationship_kwargs=dict(foreign_keys="[Request.station_from_id]"),
    )
    station_to: "Station" = Relationship(
        back_populates="requests_to",
        sa_relationship_kwargs=dict(foreign_keys="[Request.station_to_id]"),
    )
    passenger: "Passenger" = Relationship(back_populates="requests")
    ticket: "Ticket" = Relationship(back_populates="request", sa_relationship_kwargs={"cascade": "all,delete"})


class RequestCreate(RequestBase):
    station_from_id: int = Field()
    station_to_id: int = Field()
    baggage_type: str | None = None
    baggage_weight: float | None = None
    baggage_help: bool | None = None


class TicketsRequestResponse(RequestBase):
    id: int
    station_from: "Station"
    station_to: "Station"
    passenger: "PassengerResponse"


class RequestResponse(RequestBase):
    id: int
    station_from: "Station"
    station_to: "Station"
    passenger: "PassengerResponse"
    ticket: "RequestsTicketResponse | None" = None


class RequestUpdate(RequestBase):
    passenger_id: int | None = None

    station_from_id: int | None = None
    station_to_id: int | None = None
    datetime: dt.datetime | None = None
    acceptation_method: RequestAcceptationMethod | None = None
    passengers_count: int | None = None
    category: RequestCategory | None = None
    male_users_count: int | None = None
    female_users_count: int | None = None
    status: RequestStatus | None = None
    additional_information: str | None = None
    baggage_type: str | None = None
    baggage_weight: float | None = None
    baggage_help: bool | None = None


from .passenger import Passenger, PassengerResponse
from .station import Station
from .ticket import RequestsTicketResponse, Ticket
from .user import UserResponse

Request.update_forward_refs()
TicketsRequestResponse.update_forward_refs()
RequestResponse.update_forward_refs()
