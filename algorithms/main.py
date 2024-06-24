from datetime import datetime, timedelta

from typing import Literal
from algo import assign
from deserialize import commit_to_server
from parsers import get_routes, get_users, get_events
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from globals import BASE, USER_BASE

API_PREFIX = "/api/v1"

# data preparation
get_routes()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post(API_PREFIX + "/assign", response_model=dict)
def assign_requests(current_time: datetime, assign_type: Literal["hard", "soft"]):
    current_time += timedelta(hours=3)
    BASE.clear()
    USER_BASE.clear()
    users = get_users()
    events = get_events(current_time, assign_type)
    assign(users=users, events=events)
    commit_to_server()

    return {"message": "Request assign successful"}
