import datetime as dt
import enum

from sqlmodel import Column, Enum, Field, Relationship, SQLModel


class GapStatus(str, enum.Enum):
    absence = "отсутствие"
    illness = "болезнь"
    business_trip = "командировка"
    vacation = "отпуск"
    conference = "конференция"
    day_off = "отгул"
    training = "обучение"
    childcare_leave = "отпуск по уходу за ребёнком"


class GapBase(SQLModel):
    user_id: int = Field(default=None, foreign_key="user.id", nullable=False)

    start_time: dt.datetime = Field()
    end_time: dt.datetime = Field()

    is_working: bool = Field()
    status: GapStatus = Field(sa_column=Column(Enum(GapStatus).values_callable))
    description: str = Field()

    is_deleted: bool = Field(default=False)


class Gap(GapBase, table=True):
    id: int = Field(default=None, primary_key=True)
    user: "User" = Relationship(back_populates="gaps")


class GapResponse(GapBase):
    id: int
    user: "UserResponse"


class GapCreate(GapBase):
    pass


class GapUpdate(GapBase):
    user_id: int | None = None

    start_time: dt.datetime | None = None
    end_time: dt.datetime | None = None

    is_working: bool | None = None
    status: GapStatus | None = None
    description: str | None = None

    is_deleted: bool | None = None


from .user import User, UserResponse

Gap.update_forward_refs()
GapResponse.update_forward_refs()
