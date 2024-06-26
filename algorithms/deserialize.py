from entity import Event, User
from utils import get_path
import requests

ENDPOINT_URL = "https://api.papuas.tech/api/v1/"
TOKEN = "R-OekIJntqVDaaRaaqPKw7ZQoZIcZKB51rjoCEVSmntpBdp-k01LppDp4plvuHRYAMQmbL-WB-XMgjCVFI2oKQ"
session = requests.session()
HEADERS = {"Authorization": f"Bearer {TOKEN}"}
session.headers = HEADERS


def patch_ticket(event: Event):
    path = get_path(event.station_from, event.station_to, event.coefficient)
    data = {
        "request_id": event.id,
        "route": [station["name_station"] for station in path],
        "start_time": event.start.strftime("%Y-%m-%dT%H:%M:%S"),
        "end_time": event.end.strftime("%Y-%m-%dT%H:%M:%S"),
        "real_end_time": event.end.strftime("%Y-%m-%dT%H:%M:%S"),
        "additional_information": "",
        "status": "Принята",
        "user_ids": event.user_ids,
    }
    response = session.patch(ENDPOINT_URL + f"tickets/{event.ticket_id}", json=data)
    response.raise_for_status()


def post_ticket(event: Event):
    path = get_path(event.station_from, event.station_to, event.coefficient)
    data = {
        "request_id": event.id,
        "route": [station["name_station"] for station in path],
        "start_time": event.start.strftime("%Y-%m-%dT%H:%M:%S"),
        "end_time": event.end.strftime("%Y-%m-%dT%H:%M:%S"),
        "real_end_time": event.end.strftime("%Y-%m-%dT%H:%M:%S"),
        "additional_information": "",
        "status": "Принята",
        "user_ids": event.user_ids,
    }
    response = session.post(ENDPOINT_URL + f"tickets/", json=data)
    response.raise_for_status()


def delete_ticket(event: Event):
    response = session.delete(ENDPOINT_URL + f"tickets/{event.ticket_id}")
    response.raise_for_status()


def post_gap(event: Event):
    data = {
        "user_id": event.user_ids[0],
        "start_time": event.start.strftime("%Y-%m-%dT%H:%M:%S"),
        "end_time": event.end.strftime("%Y-%m-%dT%H:%M:%S"),
        "is_working": True,
        "status": "обед",
        "description": "",
    }
    response = session.post(ENDPOINT_URL + f"gaps/", json=data)
    response.raise_for_status()


def patch_request(event_change: dict, request_id):
    data = event_change
    response = session.patch(ENDPOINT_URL + f"requests/{request_id}", json=data)
    response.raise_for_status()


def commit_to_server():
    for event in Event.all():
        try:
            if event.type == "request":
                if event.user_ids:
                    if event.has_ticket:
                        patch_ticket(event)
                    else:
                        post_ticket(event)
                else:
                    if event.has_ticket:
                        delete_ticket(event)
                    patch_request({
                        "status": "distribution_error"
                    }, event.id)
            elif event.type == "lunch":
                post_gap(event)
        except Exception as e:
            print(e)
