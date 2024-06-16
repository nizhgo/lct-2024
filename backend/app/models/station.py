from typing import List

from sqlmodel import Field, Relationship, SQLModel


class StationBase(SQLModel):
    id_line: int
    name_station: str
    name_line: str


class Station(StationBase, table=True):
    id: int = Field(default=None, primary_key=True)
    requests_from: List["Request"] = Relationship(
        back_populates="station_from",
        sa_relationship_kwargs={
            "primaryjoin": "Request.station_from_id==Station.id",
            "lazy": "joined",
        },
    )
    requests_to: List["Request"] = Relationship(
        back_populates="station_to",
        sa_relationship_kwargs={
            "primaryjoin": "Request.station_to_id==Station.id",
            "lazy": "joined",
        },
    )


class StationResponse(StationBase):
    id: int


from .request import Request

Station.update_forward_refs()
StationResponse.update_forward_refs()
