from typing import List

from sqlmodel import Session, select

from app.models import Station


def read_stations(*, session: Session, offset: int, limit: int) -> List[Station]:
    statement = select(Station).offset(offset).limit(limit)
    stations = session.exec(statement).unique().all()

    return stations
