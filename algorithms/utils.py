import random

from globals import ROUTES, BASE
from math import ceil
from entity import User, Event
from datetime import timedelta, datetime


def get_path(from_station: str, to_station: str, coefficient: int) -> (int, list[int]):
    if from_station is None or to_station is None:
        return []
    route = ROUTES[coefficient]
    response = route[str((from_station, to_station))]
    path = response["path"]
    return path


def get_coefficient(category: str) -> int:
    coefficients = {
        "ИЗТ": 4,
        "ИЗ": 2,
        "ИС": 1,
        "ИК": 4,
        "ИО": 3,
        "ДИ": 4,
        "ПЛ": 3,
        "РД": 2,
        "РДК": 2,
        "ОГД": 2,
        "ОВ": 3,
        "ИУ": 2
    }

    return coefficients.get(category)


def get_time(from_station: str, to_station: str, coefficient: int) -> (int, list[int]):
    if from_station is None or to_station is None:
        return timedelta(minutes=0)
    route = ROUTES[coefficient]
    response = route[str((from_station, to_station))]
    time = ceil(response["time"]) + 1.5 * coefficient + 0.3 * len(response["path"])
    if time == 0:
        print(from_station, to_station, coefficient)
    return timedelta(minutes=time)


def sort_users_by_time(station: str, users: list[User], coefficient) -> list:
    return list(sorted(users,
                       key=lambda user: user.free_time + get_time(user.current_station, station, coefficient)))


def parse_events_from_base() -> list[Event]:
    events = []
    for object_id in BASE:
        if isinstance(BASE[object_id], Event):
            events.append(BASE[object_id])
    return events


def match_user(user: User, event: Event) -> bool:
    all_events = parse_events_from_base()
    travel_time = get_time(user.current_station, event.station_from, event.coefficient)
    if event.type == "request":
        travel_time += timedelta(minutes=15)
    # юзер занят
    if event.start < user.free_time + travel_time:
        return False
    # не работает
    if not (user.start < event.start <= event.end < user.end):
        return False
    # не задевает permanent событие
    for some_event in all_events:
        if some_event.id == event.id and some_event.type == event.type:
            continue
        if all((
                some_event.is_permanent,
                user.id in some_event.user_ids,
                min(event.end, some_event.end) > max(event.start, some_event.start),
        )):
            return False

    return True


def generate_random_datetime(start_time, end_time):
    start_timestamp = start_time.timestamp()
    end_timestamp = end_time.timestamp()

    random_timestamp = random.uniform(start_timestamp, end_timestamp)

    random_datetime = datetime.fromtimestamp(random_timestamp)

    return random_datetime


def get_work_time(working_hours: str, current_date: datetime) -> dict:
    response = {}
    start_hours, start_minutes = map(int, working_hours.split('-')[0].split(':'))
    end_hours, end_minutes = map(int, working_hours.split('-')[1].split(':'))
    response["start"] = datetime.now().replace(hour=start_hours, minute=start_minutes, year=current_date.year,
                                               month=current_date.month, day=current_date.day)
    response["end"] = datetime.now().replace(hour=end_hours, minute=end_minutes, year=current_date.year,
                                             month=current_date.month, day=current_date.day)

    return response
