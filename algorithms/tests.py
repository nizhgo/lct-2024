from entity import User, Event
from datetime import datetime
from algo import assign
from pprint import pprint
from parsers import get_routes


def test_event_not_on_time() -> (list[User], list[Event]):
    users = []
    events = []

    user = User(
        id=1,
        current_station=None,
        start=datetime.now().replace(hour=8, minute=0),
        end=datetime.now().replace(hour=17, minute=0),
        sex="male",
        has_lunch=False,
    )

    event_1 = Event(
        id=2,
        is_permanent=False,
        type="request",
        user_ids=[],
        male_count=1,
        female_count=0,
        start=datetime.now().replace(hour=9, minute=0),
        end=datetime.now().replace(hour=10, minute=0),
        coefficient=1,
        station_from="БКЛ Зюзино",
        station_to="Сходня МЦД-3(П)",
        has_ticket=False,
    )

    event_2 = Event(
        id=3,
        is_permanent=False,
        type="request",
        user_ids=[],
        male_count=1,
        female_count=0,
        start=datetime.now().replace(hour=10, minute=30),
        end=datetime.now().replace(hour=11, minute=30),
        coefficient=1,
        station_from="БКЛ Зюзино",
        station_to="Сходня МЦД-3(П)",
        has_ticket=False,
    )

    users, events = [user], [event_1, event_2]
    result = assign(users, events)
    pprint(result)


def test_event_on_time():
    users = []
    events = []

    user = User(
        id=1,
        current_station=None,
        start=datetime.now().replace(hour=8, minute=0),
        end=datetime.now().replace(hour=17, minute=0),
        sex="male",
        has_lunch=False,
    )

    event_1 = Event(
        id=2,
        is_permanent=False,
        type="request",
        user_ids=[],
        male_count=1,
        female_count=0,
        start=datetime.now().replace(hour=9, minute=0),
        end=datetime.now().replace(hour=10, minute=0),
        coefficient=1,
        station_from="Фрунзенская",
        station_to="Спортивная",
        has_ticket=False,
    )

    event_2 = Event(
        id=3,
        is_permanent=False,
        type="request",
        user_ids=[],
        male_count=1,
        female_count=0,
        start=datetime.now().replace(hour=10, minute=30),
        end=datetime.now().replace(hour=11, minute=30),
        coefficient=1,
        station_from="Фрунзенская",
        station_to="Спортивная",
        has_ticket=False,
    )

    event_3 = Event(
        id=3,
        is_permanent=False,
        type="request",
        user_ids=[],
        male_count=1,
        female_count=0,
        start=datetime.now().replace(hour=12, minute=00),
        end=datetime.now().replace(hour=12, minute=30),
        coefficient=1,
        station_from="Фрунзенская",
        station_to="Спортивная",
        has_ticket=False,
    )

    event_4 = Event(
        id=3,
        is_permanent=False,
        type="request",
        user_ids=[],
        male_count=1,
        female_count=0,
        start=datetime.now().replace(hour=15, minute=00),
        end=datetime.now().replace(hour=15, minute=30),
        coefficient=1,
        station_from="Фрунзенская",
        station_to="Спортивная",
        has_ticket=False,
    )

    users, events = [user], [event_1, event_2, event_3, event_4]
    result = assign(users, events)
    pprint(result)


test_event_on_time()
