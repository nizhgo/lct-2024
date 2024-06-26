import datetime
import enum
from typing import List

from sqlmodel import Column, Enum, Field, Relationship, SQLModel

from .link import UserTicket


class UserRole(str, enum.Enum):
    admin = "admin"
    specialist = "specialist"
    operator = "operator"
    worker = "worker"


class UserRank(str, enum.Enum):
    administrator = "ЦА"
    specialist = "ЦС"
    cu = "ЦУ"
    cio = "ЦИО"
    csi = "ЦСИ"
    ci = "ЦИ"


class UserShift(str, enum.Enum):
    first = "1"
    second = "2"
    first_night = "1(Н)"
    second_night = "2(Н)"
    five = "5"


class UserWorkingHours(str, enum.Enum):
    a = "07:00-19:00"
    b = "08:00-20:00"
    c = "08:00-17:00"
    d = "20:00-08:00"
    e = "08:00-16:00"
    f = "10:00-22:00"


class UserSex(str, enum.Enum):
    male = "male"
    female = "female"


# ЦУ-1, ЦУ-2, ЦУ-3, ЦУ-3(Н), ЦУ-4, ЦУ-4(Н), ЦУ-5, ЦУ-8


class UserArea(str, enum.Enum):
    cu1 = "ЦУ-1"
    cu2 = "ЦУ-2"
    cu3 = "ЦУ-3"
    cu4 = "ЦУ-4"
    cu5 = "ЦУ-5"
    cu8 = "ЦУ-8"
    cu3_night = "ЦУ-3 (Н)"
    cu4_night = "ЦУ-4 (Н)"


class UserBase(SQLModel):
    first_name: str = Field()
    second_name: str = Field()
    patronymic: str = Field()

    work_phone: str = Field()
    personal_phone: str = Field()
    personnel_number: str = Field(nullable=True)
    role: UserRole = Field()
    rank: UserRank = Field(sa_column=Column(Enum(UserRank).values_callable))
    shift: UserShift = Field(sa_column=Column(Enum(UserShift).values_callable))
    working_hours: UserWorkingHours = Field(
        sa_column=Column(Enum(UserWorkingHours).values_callable)
    )
    sex: UserSex = Field(sa_column=Column(Enum(UserSex).values_callable))
    area: UserArea = Field(sa_column=Column(Enum(UserArea).values_callable))
    is_lite: bool = Field()

    @property
    def initials(self) -> str:
        return f"{self.second_name} {self.first_name[0]}.{self.patronymic[0]}."

    @property
    def should_work_today(self) -> bool:
        today = datetime.datetime.now().date()
        return UserBase.should_work_date(today, self.shift)

    @staticmethod
    def should_work_date(date: datetime.date, shift: UserShift) -> bool:
        start_date = datetime.date(1970, 1, 1)
        if shift == UserShift.five:
            return date.weekday() <= 4
        elif shift in [UserShift.first, UserShift.first_night]:
            return (date - start_date).days % 4 in [0, 1] or (shift != UserShift.five)
        else:
            return (date - start_date).days % 4 in [2, 3] or (shift != UserShift.five)

    @staticmethod
    def should_work_time(date: datetime.datetime, shift: UserShift, working_hours: UserWorkingHours):
        time_format = "%H:%M"
        time_start = datetime.datetime.strptime(
            working_hours.split("-")[0], time_format
        ).time()
        time_end = datetime.datetime.strptime(
            working_hours.split("-")[1], time_format
        ).time()
        if shift in [UserShift.first, UserShift.second, UserShift.five]:
            return User.should_work_date(date.date(), shift) and time_start < date.time() < time_end or (shift != UserShift.five)
        else:
            return (User.should_work_date(date.date(), shift) and time_start < date.time()) or (User.should_work_date(date.date() - datetime.timedelta(days=1),shift) and date.time() < time_end) or (shift != UserShift.five)


class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
    hashed_password: str
    tokens: List["Token"] = Relationship(back_populates="user")
    tickets: List["Ticket"] = Relationship(
        back_populates="users", link_model=UserTicket
    )
    gaps: List["Gap"] = Relationship(back_populates="user")
    attendances: List["Attendance"] = Relationship(back_populates="user")

    @property
    def is_working(self) -> bool:
        time_format = "%H:%M"
        time_start = datetime.datetime.strptime(
            self.working_hours.split("-")[0], time_format
        ).time()
        time_end = datetime.datetime.strptime(
            self.working_hours.split("-")[1], time_format
        ).time()
        time_cur = datetime.datetime.now().time()

        now = datetime.datetime.now()

        date_today = now.date()
        date_yesterday = (now - datetime.timedelta(days=1)).date()

        if time_cur < time_end < time_start:
            for attendance in self.attendances:
                if attendance.datetime.date() == date_yesterday:
                    return True
        else:
            for attendance in self.attendances:
                if attendance.datetime.date() == date_today:
                    return True
        return False


class Credentials(SQLModel):
    personal_phone: str
    password: str


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int

    is_working: bool
    initials: str
    should_work_today: bool


class UserUpdate(UserBase):
    first_name: str | None = None
    second_name: str | None = None
    patronymic: str | None = None

    work_phone: str | None = None
    personal_phone: str | None = None
    personnel_number: str | None = None
    role: str | None = None
    rank: str | None = None
    shift: str | None = None
    working_hours: str | None = None
    sex: str | None = None
    area: str | None = None
    is_lite: bool | None = None


class UserTickets(SQLModel):
    user: "UserResponse"
    tickets: List["TicketResponse"]


from .attendance import Attendance
from .gap import Gap
from .ticket import Ticket, TicketResponse
from .token import Token

User.update_forward_refs()
UserResponse.update_forward_refs()
UserTickets.update_forward_refs()
