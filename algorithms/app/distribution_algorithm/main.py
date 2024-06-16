from datetime import datetime, timedelta, time, timezone
from app.distribution_algorithm.data_processing import init, get_all_users, parse_all_users, get_all_requests, \
    get_all_gaps
from app.utils import get_path, get_time_from_station, get_user_time_from_station, map_coefficient_by_category
import pickle
from pprint import pprint

from typing import List, Dict

ticket_id_to_users = {}  # {id: [user_id]}
ticket_list = []  # [{'id': {}}]


def add_gaps_to_requests(ticket_events: List[Dict], gaps: List[Dict]) -> List[Dict]:
    for gap in gaps:
        gap["type"] = "gap"
        gap_start = gap
        gap_start["datetime"] = gap.get("start_time")
        gap_start["type_operation"] = "start"
        gap_end = gap
        gap_end["datetime"] = gap.get("end_time")
        gap_end["type_operation"] = "end"
        ticket_events.append(gap_start)
        ticket_events.append(gap_end)

    return ticket_events


def get_station_distances() -> List[Dict]:
    station_distances = [{}]

    for w in range(1, 5):
        with open(f"data/calculated_paths_{w}.p", "rb") as f:
            station_distances_w = pickle.load(f)
            station_distances.append(station_distances_w)

    return station_distances


def check_user_available(user: Dict, start_time: datetime, end_time: datetime) -> bool:
    start_work, end_work = user["working_hours"].split("-")
    start_hours, end_hours = start_time.hour, end_time.hour
    if start_hours >= start_work and end_hours <= end_work:
        return True

    return False


def get_rescheduled_users(station_from_id: int, start_time: datetime, users_list_ids: List[Dict],
                          limit_female: int, limit_male: int, station_distances_w: Dict) -> (datetime, List[Dict]):
    new_start_time = start_time - timedelta(minutes=15)

    target_users = []

    for user_id in users_list_ids:
        user = users.get(user_id)

        if user.get("sex") == "male":
            if not limit_male:
                continue
            limit_male -= 1

        if user.get("sex") == "female":
            if not limit_female:
                continue
            limit_female -= 1

        target_users.append(user)

        # Если не успевает - переносим время
        if get_user_time_from_station(user, station_from_id, station_distances_w) > new_start_time:
            new_start_time = get_user_time_from_station(user, station_from_id, station_distances_w)

            # Набрали всех
        if not limit_male and not limit_female:
            break

    return new_start_time, target_users


def get_closest_users(station_from_id: int, start_time: datetime, supposed_end_time: datetime, users_ids: set, users: Dict,
                      limit_female: int, limit_male: int, station_distances_w: Dict) -> (datetime, List[Dict]):
    """Выбор ближайших по расстоянию мужчин и женщин"""

    users_list_ids = list(users_ids)

    users_list_ids.sort(
        key=lambda x: (
            get_user_time_from_station(users.get(x), station_from_id, station_distances_w),
            users.get(x).get("area"),
            float('inf') if users.get(x).get("rank") == "ЦУ" else float('inf') - 1
        )
    )
    new_start_time = start_time - timedelta(minutes=15)
    # print(new_start_time)

    target_users = []

    for user_id in users_list_ids:
        user = users.get(user_id)
        # Если не успевает - не берем
        if get_user_time_from_station(user, station_from_id, station_distances_w) > new_start_time:
            continue

        user_available = check_user_available(user, start_time, supposed_end_time)
        if not user_available:
            continue

        if user.get("sex") == "male":
            if not limit_male:
                continue
            limit_male -= 1

        if user.get("sex") == "female":
            if not limit_female:
                continue
            limit_female -= 1

        target_users.append(user)

        # Набрали всех
        if not limit_male and not limit_female:
            break

    if limit_male > 0 or limit_female > 0:
        print(f"Необходимо перенести заявку на {new_start_time + timedelta(minutes=15)}")
        return get_rescheduled_users(station_from_id, start_time, users_list_ids,
                                     limit_female, limit_male, station_distances_w)

    print('closest ', target_users)
    return new_start_time, target_users


def tickets_distribution(ticket_events: List[Dict], users: Dict, station_distances: List[Dict]) -> Dict:
    """Каждому запросу определяем людей"""

    users_available_ids = set(users)

    start_idx = 0

    user_lunch_time = dict()

    while start_idx < len(ticket_events):
        ticket_events.sort(key=lambda x: (x.get("datetime"),
                                          x.get("operation") == "request",
                                          x.get("operation_type") == "start"))
        ticket_event = ticket_events[start_idx]
        print(ticket_event)

        # Если у нас событие gap, то удаляем или добавляем доступного пользователя
        if ticket_event.get("type") == "gap":
            if ticket_event.get("type_operation") == "start":
                users_available_ids.remove(ticket_event.get("user").get("id"))
            else:
                users_available_ids.add(ticket_event.get("user").get("id"))
            start_idx += 1
            continue

        if ticket_event.get("type_operation") == "end":
            # Отпускаем всех рабочих с задачи, которую уже закончили
            users_for_task = ticket_id_to_users.get(ticket_event.get("id"))
            for user_id in users_for_task:
                user = users.get(user_id)
                users[user_id]["current_station_id"] = ticket_event.get("to")
                users[user_id]["time_end"] = ticket_event.get("datetime")
                users_available_ids.add(user_id)
        else:
            # Добавляем людей на задачу
            limit_male = ticket_event.get("male_users_count")
            limit_female = ticket_event.get("female_users_count")
            station_distances_w = map_coefficient_by_category(ticket_event.get("category"), station_distances)
            supposed_end_time = ticket_event.get("datetime") + get_time_from_station(ticket_event.get("station_from"),
                                                                            ticket_event.get("station_to"),
                                                                            station_distances_w)

            if ticket_event.get("closest_users") is None:
                start_time, closest_users = get_closest_users(ticket_event.get("station_from"),
                                                              ticket_event.get("datetime"),
                                                              supposed_end_time,
                                                              users_available_ids, users, limit_female, limit_male,
                                                              station_distances_w)
            else:
                start_time, closest_users = ticket_event.get("ticket").get("start_time"), \
                    ticket_event.get("closest_users")

            ticket_event["datetime"] = start_time

            user_ids = []
            end_time = ticket_event.get("datetime") + get_time_from_station(ticket_event.get("station_from"),
                                                                            ticket_event.get("station_to"),
                                                                            station_distances_w)
            for user in closest_users:
                users_available_ids.remove(user.get("id"))
                user_ids.append(user.get("id"))
                users[user.get("id")]["end_time"] = end_time

            ticket_id_to_users[ticket_event.get("id")] = user_ids
            ticket_event_end = ticket_event
            ticket_event_end["datetime"] = end_time
            ticket_event_end["type"] = "request"
            ticket_event_end["type_operation"] = "end"

            ticket_event["start_time"] = start_time
            ticket_event["end_time"] = end_time
            ticket_event["route"] = get_path(ticket_event.get("station_from"),
                                             ticket_event.get("station_to"),
                                             station_distances_w)
            ticket_event["user_ids"] = user_ids
            ticket_events.append(ticket_event_end)
            ticket_list.append(ticket_event)
        start_idx += 1

    return ticket_id_to_users


users = dict()


def start_algorithm(distribution_type: str, current_time: datetime):
    global users
    init()
    users = parse_all_users(get_all_users())

    # Extract the timezone from current_time
    current_timezone = current_time.tzinfo

    # Combine date with time.min and time.max and apply the timezone
    start_time = datetime.combine(current_time.date(), time.min).replace(tzinfo=current_timezone)
    end_time = datetime.combine(current_time.date(), time.max).replace(tzinfo=current_timezone)

    station_distances = get_station_distances()
    gaps = get_all_gaps(start_time, end_time)

    requests_list = add_gaps_to_requests(get_all_requests(distribution_type, current_time), gaps)

    ticket_id_to_users = tickets_distribution(requests_list, users, station_distances)
    for ticket in ticket_list:
        print(ticket)
        # create_or_update_ticket(ticket)


if __name__ == "__main__":
    start_algorithm(distribution_type="manual", current_time=datetime.now())
