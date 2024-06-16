from typing import List

from sqlmodel import Session, select, or_

from app.models import Passenger, PassengerCreate, PassengerUpdate, PassengerSex, PassengerCategory


def create_passenger(
    *, session: Session, passenger_create: PassengerCreate
) -> Passenger:
    db_obj = Passenger.model_validate(passenger_create)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def read_passengers(
        *,
        session: Session,
        offset: int | None = None,
        limit: int | None = None,
        query: str | None = None,
        sex_query: PassengerSex | None = None,
        category_query: PassengerCategory | None = None,
        has_cardiac_pacemaker_query: bool | None = None
) -> List[Passenger]:
    statement = select(Passenger).offset(offset).limit(limit)

    if query:
        statement = statement.where(
            or_(
                Passenger.name.ilike('%' + query + '%'),
                Passenger.contact_details.ilike('%' + query + '%'),
                Passenger.sex.ilike('%' + query + '%'),
                Passenger.category.ilike('%' + query + '%'),
                Passenger.additional_information.ilike('%' + query + '%'),
            )
        )

    if sex_query:
        statement = statement.where(Passenger.sex == sex_query)

    if category_query:
        statement = statement.where(Passenger.category == category_query)

    if has_cardiac_pacemaker_query:
        statement = statement.where(Passenger.has_cardiac_pacemaker == has_cardiac_pacemaker_query)

    passengers = session.exec(statement).all()

    return passengers


def get_passenger_by_id(*, session: Session, passenger_id: int) -> Passenger:
    statement = select(Passenger).where(Passenger.id == passenger_id)
    passenger = session.exec(statement).first()

    return passenger


def update_passenger(
    *, session: Session, db_passenger: Passenger, passenger_in: PassengerUpdate
) -> Passenger:
    passenger_data = passenger_in.model_dump(exclude_unset=True)
    db_passenger.sqlmodel_update(passenger_data)
    session.add(db_passenger)
    session.commit()
    session.refresh(db_passenger)
    return db_passenger


def delete_passenger(*, session: Session, passenger_id: int) -> Passenger | None:
    statement = select(Passenger).where(Passenger.id == passenger_id)
    db_passenger = session.exec(statement).first()

    if db_passenger is None:
        return None

    session.delete(db_passenger)
    session.commit()
    return db_passenger
