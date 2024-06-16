from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException

from app.distribution_algorithm.main import start_algorithm

router = APIRouter()


@router.post(
    "/",
)
def algorithm_distribute(distribution_type: str, current_time: datetime = datetime.now()):
    """
    Start distribution algorithm.
    """
    start_algorithm(distribution_type, current_time)

    return {"message": "success!"}
