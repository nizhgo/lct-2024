from fastapi import APIRouter

from app.api.routes import (gap, passenger, request, schedule, station, ticket,
                            user)

api_router = APIRouter()
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(request.router, prefix="/requests", tags=["requests"])
api_router.include_router(passenger.router, prefix="/passengers", tags=["passengers"])
api_router.include_router(ticket.router, prefix="/tickets", tags=["tickets"])
api_router.include_router(gap.router, prefix="/gaps", tags=["gaps"])
api_router.include_router(schedule.router, prefix="/schedules", tags=["schedules"])
api_router.include_router(station.router, prefix="/stations", tags=["stations"])
