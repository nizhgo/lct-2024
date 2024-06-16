import datetime as dt

from sqlmodel import Field, Relationship, SQLModel


class AttendanceBase(SQLModel):
    user_id: int = Field(default=None, foreign_key="user.id", nullable=False)
    datetime: dt.datetime = Field()


class Attendance(AttendanceBase, table=True):
    id: int = Field(default=None, primary_key=True)
    user: "User" = Relationship(back_populates="attendances")


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceResponse(AttendanceBase):
    pass


from .user import User

Attendance.update_forward_refs()
