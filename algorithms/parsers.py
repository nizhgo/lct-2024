import pickle
from typing import Literal

import requests
from datetime import datetime

from entity import User, Event
from globals import ROUTES
from utils import get_work_time, get_time, get_coefficient

ENDPOINT_URL = "https://api.papuas.tech/api/v1/"
TOKEN = "R-OekIJntqVDaaRaaqPKw7ZQoZIcZKB51rjoCEVSmntpBdp-k01LppDp4plvuHRYAMQmbL-WB-XMgjCVFI2oKQ"
session = requests.session()
HEADERS = {"Authorization": f"Bearer {TOKEN}"}
session.headers = HEADERS


def get_routes() -> dict:
    """
    "('Мичуринец МЦД-4', 'Новогиреево')": {'time': 71.94999999999999, 'path': [{'id': 439, 'name_station': 'Мичуринец МЦД-4']:
    """
    result = {}
    for w in range(1, 5):
        with open(f"/сode/static/routes/calculated_paths_{w}.p", "rb") as f:
            routes = pickle.load(f)
            ROUTES[w] = routes
    return result


def get_requests(current_time: datetime, assign_type: Literal["hard", "soft"]) -> list[Event]:
    now = datetime.now()

    queries = {
        "start_time": datetime.strftime(current_time.replace(hour=0, minute=0, second=0, microsecond=0), "%Y-%m-%dT%H:%M:%S"),
        "end_time": datetime.strftime(current_time.replace(hour=23, minute=59, second=59, microsecond=999999),
                                      "%Y-%m-%dT%H:%M:%S"),
    }
    print(queries)

    response = session.get(f"{ENDPOINT_URL}requests/", params=queries)

    requests_list = []

    for request in response.json():
        station_from = request["station_from"]["name_station"]
        station_to = request["station_to"]["name_station"]
        user_ids = [user["id"] for user in request["ticket"]["users"]] if request.get("ticket") is not None else []
        request["datetime"] = datetime.strptime(request["datetime"], "%Y-%m-%dT%H:%M:%S")
        start = datetime.strptime(request["ticket"]["start_time"], "%Y-%m-%dT%H:%M:%S") if (
                    request.get("ticket") is not None) else request["datetime"]
        end = datetime.strptime(request["ticket"]["end_time"], "%Y-%m-%dT%H:%M:%S") if (
                request.get("ticket") is not None) else (
                request["datetime"] + get_time(station_from, station_to, get_coefficient(request["category"])))
        requests_list.append(
            Event(
                id=request["id"],
                type="request",
                is_permanent=(request.get("ticket") is not None and (
                        request["status"] in ["processed", "completed"] or assign_type == "soft")),
                user_ids=user_ids,
                male_count=request["male_users_count"],
                female_count=request["female_users_count"],
                start=start,
                end=end,
                coefficient=get_coefficient(request["category"]),
                station_from=station_from,
                station_to=station_to,
                # fields for deserialization
                has_ticket=(request.get("ticket") is not None),
                ticket_id=request["ticket"]["id"] if (request.get("ticket") is not None) else None,
            )
        )
    print("Length of requests_list:", len(requests_list))
    return requests_list


def get_users(current_date) -> list[User]:
    response = session.get(ENDPOINT_URL + "users/")

    users = []

    for user in response.json():
        user_obj = User(
            id=user["id"],
            **get_work_time(user["working_hours"], current_date=current_date),
            sex=user["sex"],
            has_lunch=False
        )
        if user["should_work_today"] and user["role"] == "worker":
            users.append(user_obj)

    return users


def get_gaps(current_time: datetime) -> list[Event]:
    now = datetime.now()

    queries = {
        "start_time": datetime.strftime(current_time.replace(hour=0, minute=0, second=0, microsecond=0), "%Y-%m-%dT%H:%M:%S"),
        "end_time": datetime.strftime(current_time.replace(hour=23, minute=59, second=59, microsecond=999999),
                                      "%Y-%m-%dT%H:%M:%S"),
        "find_intersection": True
    }

    response = session.get(f"{ENDPOINT_URL}gaps/", params=queries)
    gaps = []

    for gap in response.json():
        if gap["status"] == "обед":
            User.get(gap["user"]["id"]).has_lunch = True
        gaps.append(
            Event(
                id=gap["id"],
                type="gap",
                is_permanent=True,
                user_ids=[gap["user"]["id"]],
                male_count=0,
                female_count=1,
                start=datetime.strptime(gap["start_time"], "%Y-%m-%dT%H:%M:%S"),
                end=datetime.strptime(gap["end_time"], "%Y-%m-%dT%H:%M:%S"),
                coefficient=1,
                station_from=None,
                station_to=None,
                # fields for deserialization
                has_ticket=False
            )
        )

    return gaps


def get_events(current_time: datetime, assign_type: Literal["hard", "soft"]) -> list[Event]:
    return list(sorted(get_requests(current_time, assign_type) + get_gaps(current_time), key=lambda event: event.start))
