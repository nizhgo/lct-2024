from sqlmodel import Field, Relationship, SQLModel


class TokenBase(SQLModel):
    access_token: str
    user_id: int = Field(default=None, foreign_key="user.id", nullable=False)


class TokenCreate(TokenBase):
    pass


class Token(TokenBase, table=True):
    id: int = Field(default=None, primary_key=True)
    user: "User" = Relationship(back_populates="tokens")


class TokenResponse(TokenBase):
    id: int
    user: "UserResponse"


from .user import User, UserResponse

Token.update_forward_refs()
TokenResponse.update_forward_refs()
