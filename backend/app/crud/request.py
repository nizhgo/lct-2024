from typing import List

from sqlmodel import Session, select, or_

from app.models import Request, RequestCreate, RequestUpdate, RequestStatus, Passenger


def create_request(*, session: Session, request_create: RequestCreate) -> Request:
    db_obj = Request.model_validate(request_create)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def read_requests(
        *,
        session: Session,
        offset: int | None = None,
        limit: int | None = None,
        query: str | None = None,
        status_query: RequestStatus | None = None
) -> List[Request]:
    statement = select(Request).offset(offset).limit(limit)

    if query:
        statement = statement.join(Passenger).where(
            or_(
                Passenger.name.ilike('%' + query + '%')
            )
        )

    if status_query:
        statement = statement.where(Request.status == status_query)

    requests = session.exec(statement).all()

    return requests


def get_request_by_id(*, session: Session, request_id: int) -> Request:
    statement = select(Request).where(Request.id == request_id)
    request = session.exec(statement).first()

    return request


def get_requests_by_passenger_id(
    *, session: Session, passenger_id: int
) -> List[Request]:
    statement = select(Request).where(Request.passenger_id == passenger_id)
    requests = session.exec(statement).all()

    return requests


def update_request(
    *, session: Session, db_request: Request, request_in: RequestUpdate
) -> Request:
    request_data = request_in.model_dump(exclude_unset=True)
    db_request.sqlmodel_update(request_data)
    session.add(db_request)
    session.commit()
    session.refresh(db_request)
    return db_request


def delete_request(*, session: Session, request_id: int) -> Request | None:
    statement = select(Request).where(Request.id == request_id)
    db_request = session.exec(statement).first()

    if db_request is None:
        return None

    session.delete(db_request)
    session.commit()
    return db_request