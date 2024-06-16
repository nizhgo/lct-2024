from fastapi import APIRouter

from app.api.routers import algorithm

api_router = APIRouter()
api_router.include_router(algorithm.router, prefix="/algorithm", tags=["algorithm"])
