from collections import defaultdict
from datetime import datetime, time

import requests
from typing import List, Dict, Optional

from pprint import pprint

ENDPOINT_URL = "https://api.papuas.tech/api/v1"

s = requests.session()


def set_headers(TOKEN: str) -> None:
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }
    s.headers = headers


def login() -> None:
    response = s.post(f"{ENDPOINT_URL}/users/signin",
                      json={
                          "personal_phone": "2",
                          "password": "2"
                      })

    TOKEN = response.json().get("access_token")

    set_headers(TOKEN)


def get_all_users() -> List[Dict]:
    response = s.get(f"{ENDPOINT_URL}/users/")

    return response.json()


def parse_all_users(users: List[Dict]) -> Dict:
    parsed_users = {}
    for user in users:
        if user.get("role") == "worker" and user.get("should_work_today"):
            user["current_station_name"] = None
            user["time_end"] = datetime.combine(datetime(year=1970, month=1, day=1), datetime.min.time())
            start_work, end_work = user["working_hours"].split("-")
            user["start_hour"], user["start_minute"] = map(int, start_work.split(":"))
            user["end_hour"], user["end_minute"] = map(int, start_work.split(":"))
            parsed_users[user.get("id")] = user

    return parsed_users


get_request_by_id = defaultdict(dict)


def form_request_instance(distribution_type: str, current_time: datetime, request: Dict) -> Optional[Dict]:
    request["datetime"] = datetime.strptime(request.get("datetime"), "%Y-%m-%dT%H:%M:%S")
    request["station_from"] = request.get("station_from").get("name_station")
    request["station_to"] = request.get("station_to").get("name_station")
    request["type"] = "request"
    get_request_by_id[request["id"]] = request

    # Если уже распределяли (и время раньше текущего), то либо не берем, либо берем пользователей
    if request.get("ticket") is not None:
        request["ticket"]["start_time"] = datetime.strptime(request.get("ticket").get("start_time"),
                                                            "%Y-%m-%dT%H:%M:%S")
        request["ticket"]["end_time"] = datetime.strptime(request.get("ticket").get("end_time"), "%Y-%m-%dT%H:%M:%S")
        request_ticket = request.get("ticket")

        if request_ticket.get("end_time") <= current_time:
            return None

        elif request_ticket.get("start_time") <= current_time:
            closest_users = request.get("users")
            request["closest_users"] = closest_users

    request["type_operation"] = "start"

    # Оставляем заявку с тикетом, созданным вручную
    if distribution_type == "manual" and request.get("status") == "processed":
        closest_users = request.get("users")
        request["closest_users"] = closest_users

    return request


def get_all_requests(distribution_type: str, current_time: datetime) -> List[Dict]:
    """Distribution_type: manual (keep entries made by operator) or auto (reschedule all entries using algorithm)"""

    response = s.get(f"{ENDPOINT_URL}/requests/")
    requests_list = response.json()
    result = []
    for request in requests_list:
        if request.get("datetime") is None:
            print(request)
            pass
        updated_request = form_request_instance(distribution_type, current_time, request)
        if updated_request is not None:
            result.append(updated_request)

    return result


def get_all_gaps(start_time: datetime, end_time: datetime) -> List[Dict]:
    params = {"start_time": start_time, "end_time": end_time}
    response = s.get(f"{ENDPOINT_URL}/gaps/", params=params)

    return response.json()


def parse_all_requests(tickets: List[Dict]):
    tickets_events = []
    pass


def create_or_update_ticket(ticket):
    route_name = []
    for station in ticket["route"]:
        route_name.append(station["name_station"])
    request_data = {
        "request_id": ticket["id"],
        "route": route_name,
        "start_time": ticket["start_time"].strftime("%Y-%m-%d %H:%M:%S"),
        "end_time": ticket["end_time"].strftime("%Y-%m-%d %H:%M:%S"),
        "additional_information": "",
        "status": "Принята",
        "user_ids": ticket["user_ids"],
    }

    # Если тикет был назначен, то делаем update, иначе create
    if ticket.get("ticket") is not None:
        response = s.patch(f"{ENDPOINT_URL}/tickets/{ticket.get('id')}", json=request_data)
    else:
        response = s.post(f"{ENDPOINT_URL}/tickets/", json=request_data)

    if not response.ok:
        print(response.json())
    return response.ok


def init():
    TOKEN = "64hsT4sHhGZt3ynF65RceaN0lVPY43j7olv89soUKB1JvXDjmCE0uO2vxGtKDKyJETL_T-jlGLDBkba2GHjw-w"
    set_headers(TOKEN)
    # login()
    print(s.headers)


if __name__ == "__main__":
    init()
    users = get_all_users()
    # pprint(parse_all_users(users))
    # pprint(get_all_requests())
    now = datetime.now()
    start_time = datetime.combine(now.date(), time.min)
    end_time = datetime.combine(now.date(), time.max)
