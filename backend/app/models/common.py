import enum

from sqlmodel import Field, SQLModel, Enum


class DeleteResponse(SQLModel):
    success: bool = Field()
    details: str = Field()


class SuccessResponse(SQLModel):
    success: bool = Field()
    details: str = Field()


class DistributionType(str, enum.Enum):
    auto = "auto"
    manual = "manual"
