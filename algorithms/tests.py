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


def test_3():
    event1 = Event(
        id=771,
        object_id=371,
        type='request',
        is_permanent=False,
        user_ids=[455],
        male_count=0,
        female_count=1,
        start=datetime(2024, 6, 24, 16, 20),
        end=datetime(2024, 6, 24, 17, 25),
        coefficient=4,
        station_from='Бульвар Рокоссовского',
        station_to='Аэропорт Внуково',
        has_ticket=True,
        ticket_id=1284
    )

    # Create the second Event object
    event2 = Event(
        id=259,
        object_id=448,
        type='gap',
        is_permanent=True,
        user_ids=[455],
        male_count=0,
        female_count=1,
        start=datetime(2024, 6, 24, 16, 20),
        end=datetime(2024, 6, 24, 17, 20),
        coefficient=1,
        station_from=None,
        station_to=None,
        has_ticket=False,
        ticket_id=None
    )

    user = User(
        id=455,
        current_station='Первомайская',
        start=datetime(2024, 6, 24, 7, 0, 55, 901989),
        end=datetime(2024, 6, 24, 19, 0, 55, 901993),
        free_time=datetime(2024, 6, 24, 14, 53),
        sex='female',
        has_lunch=True
    )

    result = assign([user], [event1, event2])
    return result


def test_4():
    event1 = Event(
        id=1179,
        object_id=213,
        type='request',
        is_permanent=False,
        user_ids=[],
        male_count=3,
        female_count=0,
        start=datetime(2024, 6, 26, 17, 33),
        end=datetime(2024, 6, 26, 17, 33),
        coefficient=4,
        station_from='Полянка',
        station_to='Полянка',
        has_ticket=True,
        ticket_id=1962
    )

    # Create the second Event object
    event2 = Event(
        id=1554,
        object_id=105,
        type='request',
        is_permanent=False,
        user_ids=[],
        male_count=2,
        female_count=0,
        start=datetime(2024, 6, 26, 17, 42),
        end=datetime(2024, 6, 26, 17, 45),
        coefficient=2,
        station_from='Чеховская',
        station_to='Пушкинская',
        has_ticket=True,
        ticket_id=1703
    )

    user = User(
        id=455,
        current_station='Первомайская',
        start=datetime(2024, 6, 26, 7, 0, 55, 901989),
        end=datetime(2024, 6, 26, 19, 0, 55, 901993),
        free_time=datetime(2024, 6, 26, 0, 0),
        sex='male',
        has_lunch=True
    )

    user2 = User(
        id=456,
        current_station='Первомайская',
        start=datetime(2024, 6, 26, 7, 0, 55, 901989),
        end=datetime(2024, 6, 26, 19, 0, 55, 901993),
        free_time=datetime(2024, 6, 26, 0, 0),
        sex='male',
        has_lunch=True
    )

    user3 = User(
        id=457,
        current_station='Первомайская',
        start=datetime(2024, 6, 26, 7, 0, 55, 901989),
        end=datetime(2024, 6, 26, 19, 0, 55, 901993),
        free_time=datetime(2024, 6, 26, 0, 0),
        sex='male',
        has_lunch=True
    )

    result = assign([user, user2, user3], [event1, event2])
    pprint(Event.all())
    return result


def test_5():
    user = User(
        id=455,
        current_station='Первомайская',
        start=datetime(2024, 6, 26, 7, 0, 55, 901989),
        end=datetime(2024, 6, 26, 19, 0, 55, 901993),
        free_time=datetime(2024, 6, 26, 0, 0),
        sex='male',
        has_lunch=True
    )

    user2 = User(
        id=456,
        current_station='Первомайская',
        start=datetime(2024, 6, 26, 7, 0, 55, 901989),
        end=datetime(2024, 6, 26, 19, 0, 55, 901993),
        free_time=datetime(2024, 6, 26, 0, 0),
        sex='male',
        has_lunch=True
    )
    event1 = Event(
        id=29,
        type='request',
        is_permanent=False,
        user_ids=[],
        male_count=2,
        female_count=0,
        start=datetime(2024, 6, 26, 10, 14),
        end=datetime(2024, 6, 26, 10, 47),
        coefficient=2,
        station_from='Тропарёво',
        station_to='Достоевская',
        has_ticket=False,
        ticket_id=None
    )

    # Create the second Event object
    event2 = Event(
        id=231,
        type='request',
        is_permanent=False,
        user_ids=[],
        male_count=1,
        female_count=0,
        start=datetime(2024, 6, 26, 11, 0),
        end=datetime(2024, 6, 26, 11, 25),
        coefficient=3,
        station_from='Таганская ТКЛ',
        station_to='Котельники',
        has_ticket=False,
        ticket_id=None
    )

    result = assign([user, user2], [event1, event2])
    print(result)


def test_6():
    user = User(
        id=455,
        current_station='Первомайская',
        start=datetime(2024, 6, 26, 7, 0, 55, 901989),
        end=datetime(2024, 6, 26, 19, 0, 55, 901993),
        free_time=datetime(2024, 6, 26, 0, 0),
        sex='male',
        has_lunch=True
    )

    user2 = User(
        id=456,
        current_station='Первомайская',
        start=datetime(2024, 6, 26, 7, 0, 55, 901989),
        end=datetime(2024, 6, 26, 19, 0, 55, 901993),
        free_time=datetime(2024, 6, 26, 0, 0),
        sex='male',
        has_lunch=True
    )
    event1 = Event(
        id=30,
        type='request',
        is_permanent=False,
        user_ids=[],
        male_count=2,
        female_count=0,
        start=datetime(2024, 6, 26, 14, 0),
        end=datetime(2024, 6, 26, 14, 31),
        coefficient=2,
        station_from='Цветной бульвар',
        station_to='Тропарёво',
        has_ticket=True,
        ticket_id=28
    )

    # Create the second Event object
    event2 = Event(
        id=30,
        type='gap',
        is_permanent=True,
        user_ids=[],
        male_count=0,
        female_count=1,
        start=datetime(2024, 6, 26, 14, 8),
        end=datetime(2024, 6, 26, 15, 8),
        coefficient=1,
        station_from=None,
        station_to=None,
        has_ticket=False,
        ticket_id=None
    )
    result = assign([user, user2], [event1, event2])
    print(result)


def test_7():
    user = User(
        id=455,
        current_station='Первомайская',
        start=datetime(2024, 6, 25, 7, 0, 55, 901989),
        end=datetime(2024, 6, 25, 19, 0, 55, 901993),
        free_time=datetime(2024, 6, 25, 0, 0),
        sex='male',
        has_lunch=True
    )

    user2 = User(
        id=456,
        current_station='Первомайская',
        start=datetime(2024, 6, 25, 7, 0, 55, 901989),
        end=datetime(2024, 6, 25, 19, 0, 55, 901993),
        free_time=datetime(2024, 6, 25, 0, 0),
        sex='male',
        has_lunch=True
    )
    event1 = Event(
        id=1090,
        type='request',
        is_permanent=False,
        user_ids=[425, 405],
        male_count=2,
        female_count=0,
        start=datetime(2024, 6, 25, 16, 2),
        end=datetime(2024, 6, 25, 16, 29),
        coefficient=2,
        station_from='Сходненская',
        station_to='Охотный ряд',
        has_ticket=False,
        ticket_id=None
    )

    # Create the second Event object
    event2 = Event(
        id=1094,
        type='request',
        is_permanent=False,
        user_ids=[425, 412],
            male_count=2,
        female_count=0,
        start=datetime(2024, 6, 25, 16, 40),
        end=datetime(2024, 6, 25, 16, 49),
        coefficient=2,
        station_from='Цветной бульвар',
        station_to='Серпуховская',
        has_ticket=False,
        ticket_id=None
    )
    result = assign([user, user2], [event1, event2])
    print(result)
    print(*Event.all(), sep="\n")

