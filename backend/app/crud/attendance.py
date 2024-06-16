from sqlmodel import Session

from app.models import Attendance, AttendanceCreate


def create_attendance(
    *, session: Session, attendance_create: AttendanceCreate
) -> Attendance:
    db_obj = Attendance.model_validate(attendance_create)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj
