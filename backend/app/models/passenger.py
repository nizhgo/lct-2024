import enum
from typing import List

from sqlmodel import Column, Enum, Field, Relationship, SQLModel


class PassengerCategory(str, enum.Enum):
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


class PassengerSex(str, enum.Enum):
    male = "male"
    female = "female"


class PassengerBase(SQLModel):
    name: str = Field()
    contact_details: str = Field()
    sex: PassengerSex = Field(sa_column=Column(Enum(PassengerSex)))
    category: PassengerCategory = Field(
        sa_column=Column(Enum(PassengerCategory))
    )
    additional_information: str = Field()
    has_cardiac_pacemaker: bool = Field()


class Passenger(PassengerBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    requests: List["Request"] = Relationship(back_populates="passenger", sa_relationship_kwargs={"cascade": "delete"})


class PassengerCreate(PassengerBase):
    pass


class PassengerResponse(PassengerBase):
    id: int


class PassengerUpdate(PassengerBase):
    name: str | None = None
    contact_details: str | None = None
    sex: PassengerSex | None = None
    category: PassengerCategory | None = None
    additional_information: str | None = None
    has_cardiac_pacemaker: bool | None = None


from .request import Request

PassengerResponse.update_forward_refs()
