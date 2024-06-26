from pydantic import BaseModel, model_validator
from datetime import datetime, timedelta
from typing import Literal, Optional, Any
from globals import BASE, GLOBAL_INDEX, USER_BASE


class Base(BaseModel):
    object_id: int | None = None

    def __new__(cls, *args, **kwargs):
        instance = super().__new__(cls)
        return instance

    def __init__(self, **kwargs):
        global GLOBAL_INDEX
        super().__init__(**kwargs)
        self.object_id = GLOBAL_INDEX
        GLOBAL_INDEX += 1
        BASE[self.object_id] = self

    @staticmethod
    def get(id_: int):
        return BASE[id_]

    @staticmethod
    def delete(id_: int):
        BASE.pop(id_)

    @classmethod
    def all(cls):
        result = []
        for instance in BASE.values():
            if isinstance(instance, cls):
                result.append(instance)
        return result


class Event(Base):
    id: int | None = None
    type: Literal["lunch", "gap", "request"]
    is_permanent: bool
    user_ids: list
    male_count: int
    female_count: int
    start: datetime
    end: datetime
    coefficient: Optional[int]
    station_from: str | None = None
    station_to: str | None = None
    # fields for deserialization
    has_ticket: bool = False
    ticket_id: int | None = None

    @property
    def duration(self) -> timedelta:
        return self.end - self.start


class User(BaseModel):
    id: int
    current_station: str | None = None
    start: datetime
    end: datetime
    free_time: datetime = datetime(year=1970, month=1, day=1)
    sex: Literal["male", "female"]
    has_lunch: bool

    def __new__(cls, *args, **kwargs):
        instance = super().__new__(cls)
        instance.__init__(
            **kwargs,
        )
        USER_BASE[instance.id] = instance
        return instance

    @staticmethod
    def get(id_: int):
        return USER_BASE[id_]


class Segment(Base):
    station_from: str | None = None
    station_to: str | None = None
    start: datetime
    end: datetime
    user_id: int
    sex: Literal["male", "female"]

    @property
    def duration(self) -> timedelta:
        return self.end - self.start


class Bracket(BaseModel):
    segment_object_id: int
    user_id: int
    time: datetime
    true_time: datetime
    type: Literal["open", "close"]
    sex: Literal["male", "female"]


class UserSchedule(BaseModel):
    user: User
    events: list[Event]
