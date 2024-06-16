from typing import List
from datetime import datetime
from sqlmodel import Session, delete, select, and_

from app.models import Ticket, TicketUpdate, UserTicket, TicketCreate, Request, User, TicketChange


def read_tickets(*, session: Session,
                 offset: int | None = None,
                 limit: int | None = None,
                 start_time: datetime | None = None,
                 end_time: datetime | None = None,
                 find_intersection: bool | None = False
                 ) -> List[Ticket]:
    statement = select(Ticket)

    if find_intersection:
        statement = statement.where(
            and_(
                start_time < Ticket.end_time,
                end_time > Ticket.start_time
            )
        )
    else:
        if start_time:
            statement = statement.where(Ticket.start_time >= start_time)
        if end_time:
            statement = statement.where(Ticket.start_time <= end_time)

    statement = statement.order_by(Ticket.start_time).offset(offset).limit(limit)
    tickets = session.exec(statement).all()

    return tickets


def get_tickets_by_user_id(*, session: Session, user_id: int) -> List[Ticket]:
    statement = select(Ticket).join(Ticket.users).where(User.id == user_id)
    tickets = session.exec(statement).all()

    return tickets


def get_ticket_by_id(*, session: Session, ticket_id: int) -> Ticket:
    statement = select(Ticket).where(Ticket.id == ticket_id)
    ticket = session.exec(statement).first()

    return ticket


def update_ticket(
        *, session: Session, db_ticket: Ticket, ticket_in: TicketUpdate, author: User
) -> Ticket:
    ticket_data = ticket_in.model_dump(exclude_unset=True)
    if "user_ids" in ticket_data:
        statement = delete(UserTicket).where(UserTicket.ticket_id == db_ticket.id)
        session.exec(statement)

        for user_id in ticket_data["user_ids"]:
            user_ticket = UserTicket(user_id=user_id, ticket_id=db_ticket.id)
            session.add(user_ticket)
            session.commit()

        ticket_data.pop("user_ids")
    db_ticket.sqlmodel_update(ticket_data)
    session.add(db_ticket)
    session.commit()
    session.refresh(db_ticket)

    db_obj_change = TicketChange(
        request_id=db_ticket.request_id,
        route=db_ticket.route,
        start_time=db_ticket.start_time,
        end_time=db_ticket.end_time,
        real_end_time=db_ticket.real_end_time,
        additional_information=db_ticket.additional_information,
        status=db_ticket.status,
        ticket_id=db_ticket.id,
        author_id=author.id,
        change_date=datetime.now(),
        user_ids=[user.id for user in db_ticket.users],
    )

    session.add(db_obj_change)
    session.commit()
    session.refresh(db_obj_change)

    return db_ticket


def create_ticket(*, session: Session, users: list[User], ticket_create: TicketCreate, author: User):
    db_obj = Ticket.model_validate(
        ticket_create, update={"users": users}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)

    db_obj_change = TicketChange(
        request_id=db_obj.request_id,
        route=db_obj.route,
        start_time=db_obj.start_time,
        end_time=db_obj.end_time,
        real_end_time=db_obj.real_end_time,
        additional_information=db_obj.additional_information,
        status=db_obj.status,
        ticket_id=db_obj.id,
        author_id=author.id,
        change_date=datetime.now(),
        user_ids=[user.id for user in db_obj.users],
    )

    session.add(db_obj_change)
    session.commit()
    session.refresh(db_obj_change)

    return db_obj


def delete_ticket(*, session: Session, ticket_id: int) -> Ticket | None:
    statement = select(Ticket).where(Ticket.id == ticket_id)
    ticket = session.exec(statement).first()

    if ticket is None:
        return None

    session.delete(ticket)
    session.commit()
    return ticket


def create_ticket_change(*, session: Session, ticket_change_create: TicketChange):
    session.add(ticket_change_create)
    session.commit()


def get_ticket_changes_by_tecket_id(
        *, session: Session, ticket_id: int
) -> List[TicketChange]:
    statement = select(TicketChange).where(TicketChange.ticket_id == ticket_id)
    ticket_changes = session.exec(statement).all()

    return ticket_changes
