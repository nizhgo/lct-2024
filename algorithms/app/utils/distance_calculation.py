from datetime import datetime, timedelta, time

from typing import List, Dict


def map_coefficient_by_category(category: str, station_distances: List[Dict]) -> Dict:
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

    return station_distances[coefficients.get(category)]


def get_path(station_from: str, station_to: str, station_distances_w: Dict) -> List[Dict]:
    if station_to is None or station_from is None:
        return []

    if str((station_from, station_to)) in station_distances_w:
        return station_distances_w.get(str((station_from, station_to))).get("path")
    elif str((station_to, station_from)) in station_distances_w:
        return station_distances_w.get(str((station_to, station_from))).get("path")
    else:
        print(f'Failed to find path from {station_from}-{station_to}')
        return []


def get_time_from_station(station_from_id: int, station_to_id: int, station_distances_w) -> timedelta:
    """Время пути от станции до станции"""

    # print('stations ', station_from_id, station_to_id)
    if station_to_id is None or station_from_id is None:
        return timedelta(minutes=0)

    if str((station_from_id, station_to_id)) in station_distances_w:
        return timedelta(minutes=station_distances_w.get(str((station_from_id, station_to_id))).get("time"))
    elif str((station_to_id, station_from_id)) in station_distances_w:
        return timedelta(minutes=station_distances_w.get(str((station_to_id, station_from_id))).get("time"))
    else:
        print(f'Failed to find path from {station_from_id}-{station_to_id}')
        return timedelta(minutes=0)


def get_user_time_from_station(user: Dict, station_from_id: int, station_distances_w: Dict) -> datetime.date:
    """Время пути от пользоветаля до станции"""

    path_time = get_time_from_station(user.get("current_station_name"), station_from_id, station_distances_w)
    return user.get("time_end") + path_time
