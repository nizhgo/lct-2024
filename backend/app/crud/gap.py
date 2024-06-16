from datetime import datetime
from typing import List

from sqlmodel import Session, select, and_

from app.models import Gap, GapCreate, GapUpdate


def read_gaps(
    *,
    session: Session,
    offset: int | None = None,
    limit: int | None = None,
    start_time: datetime | None = None,
    end_time: datetime | None = None,
    find_intersection: bool | None = False
) -> List[Gap]:
    statement = select(Gap)

    if find_intersection:
        statement = statement.where(
            and_(
                start_time < Gap.end_time,
                end_time > Gap.start_time
            )
        )
    else:
        if start_time:
            statement = statement.where(Gap.start_time >= start_time)
        if end_time:
            statement = statement.where(Gap.end_time <= end_time)

    statement = statement.order_by(Gap.start_time).offset(offset).limit(limit)
    gaps = session.exec(statement).unique().all()

    return gaps


def get_gaps_by_user_id(
    *,
    session: Session,
    user_id: int,
    offset: int | None = None,
    limit: int | None = None,
    start_time: datetime | None = None,
    end_time: datetime | None = None,
    find_intersection: bool | None = False
) -> List[Gap]:
    statement = select(Gap).where(Gap.user_id == user_id)

    if find_intersection:
        statement = statement.where(
            and_(
                start_time < Gap.end_time,
                end_time > Gap.start_time
            )
        )
    else:
        if start_time:
            statement = statement.where(Gap.start_time >= start_time)
        if end_time:
            statement = statement.where(Gap.end_time <= end_time)

    statement = statement.order_by(Gap.start_time).offset(offset).limit(limit)
    gaps = session.exec(statement).unique().all()

    return gaps


def get_gap_by_id(*, session: Session, gap_id: int) -> Gap:
    statement = select(Gap).where(Gap.id == gap_id)
    gap = session.exec(statement).first()

    return gap


def update_gap(*, session: Session, db_gap: Gap, gap_in: GapUpdate) -> Gap:
    gap_data = gap_in.model_dump(exclude_unset=True)
    db_gap.sqlmodel_update(gap_data)
    session.add(db_gap)
    session.commit()
    session.refresh(db_gap)
    return db_gap


def create_gap(*, session: Session, gap_create: GapCreate) -> Gap:
    # TODO: validate time
    db_obj = Gap.model_validate(gap_create)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def delete_gap(*, session: Session, gap_id: int) -> Gap | None:
    statement = select(Gap).where(Gap.id == gap_id)
    db_gap = session.exec(statement).first()

    if db_gap is None:
        return None

    session.delete(db_gap)
    session.commit()
    return db_gap

