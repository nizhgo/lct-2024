from sqlmodel import Field, SQLModel


class UserTicket(SQLModel, table=True):
    user_id: int = Field(default=None, foreign_key="user.id", primary_key=True)
    ticket_id: int = Field(default=None, foreign_key="ticket.id", primary_key=True)
