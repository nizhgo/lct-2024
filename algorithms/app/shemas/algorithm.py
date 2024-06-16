from pydantic import BaseModel
import datetime
from typing import Literal


class AlgorithmRequest(BaseModel):
    distribution_type: Literal["auto", "manual"]
    current_time: datetime.datetime
