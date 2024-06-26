from typing import List

from sqlmodel import Session, select, or_

from app.models import Station


def read_stations(*, session: Session, offset: int, limit: int, query: str | None = None) -> List[Station]:
    statement = select(Station).offset(offset).limit(limit)

    if query:
        statement = statement.where(
            or_(
                Station.name_station.ilike('%' + query + '%')
            )
        )

    stations = session.exec(statement).unique().all()

    return stations
