import datetime
import json
from app.models import Passenger, PassengerCreate, RequestCreate
from random import choices, choice
from app.crud import create_request, get_passenger_by_id
from sqlmodel import create_engine, Session

engine = create_engine("postgresql+psycopg://postgres:changethis@api.papuas.tech:6432/app")
session = Session(engine)

first_names_male = ["Александр", "Михаил", "Иван", "Максим", "Артём", "Даниил", "Дмитрий", "Кирилл", "Андрей", "Егор",
                    "Илья", "Алексей"]
last_names_male = ["Иванов", "Петров", "Сидоров", "Смирнов", "Кузнецов", "Попов", "Соколов", "Лебедев", "Козлов",
                   "Новиков", "Морозов", "Волков", "Соловьёв", "Васильев", "Зайцев"]
patronymics_male = ["Александрович", "Михайлович", "Иванович", "Максимович", "Артёмович", "Даниилович", "Дмитриевич",
                    "Кириллович", "Андреевич", "Егорович", "Ильич", "Алексеевич"]

first_names_female = ["София", "Анна", "Мария", "Ева", "Виктория", "Полина", "Алиса", "Варвара", "Василиса",
                      "Александра"]
last_names_female = ["Иванова", "Петрова", "Сидорова", "Смирнова", "Кузнецова", "Попова", "Соколова", "Лебедева",
                     "Козлова", "Новикова", "Морозова", "Волкова", "Соловьёва", "Васильева", "Зайцева"]
patronymics_female = ["Александровна", "Михайловна", "Ивановна", "Максимовна", "Артёмовна", "Данииловна", "Дмитриевна",
                      "Кирилловна", "Андреевна", "Егоровна", "Ильинична", "Алексеевна"]


def generate_phone():
    return '7' + ''.join(choices('0123456789', k=10))


def generate_sex():
    return choice(["male", "female"])


def generate_name(sex: str):
    if sex == "male":
        return choice(last_names_male) + ' ' + choice(first_names_male) + ' ' + choice(patronymics_male)
    else:
        return choice(last_names_female) + ' ' + choice(first_names_female) + ' ' + choice(patronymics_female)


file = open("Заявки.json", "r", encoding="utf8").read()
d = json.loads(file)

for elem in d:
    if get_passenger_by_id(session=session, passenger_id=int(elem["id_pas"])) is None:
        sex = generate_sex()
        passenger_create = PassengerCreate(
            name=generate_name(sex),
            contact_details=generate_phone(),
            sex=sex,
            category=elem["cat_pas"],
            additional_information='',
            has_cardiac_pacemaker=False
        )
        db_obj = Passenger.model_validate(passenger_create)
        db_obj.id = int(elem["id_pas"])
        session.add(db_obj)
        session.commit()
        session.refresh(db_obj)

    request = RequestCreate(
        passenger_id=int(elem["id_pas"]),
        station_from_id=int(elem["id_st1"]),
        station_to_id=int(elem["id_st2"]),
        description_from="",
        description_to="",
        datetime=datetime.datetime.strptime(elem["datetime"], "%d.%m.%Y %H:%M:%S"),
        acceptation_method="phone",
        passengers_count=1,
        category=elem["cat_pas"],
        male_users_count=int(elem["INSP_SEX_M"]),
        female_users_count=int(elem["INSP_SEX_F"]),
        status="new",
        additional_information="",
        baggage_type="No",
        baggage_weight=0.0,
        baggage_help=False
    )

    request.datetime = request.datetime.replace(year=2024, month=6, day=25)

    create_request(
        session=session,
        request_create=request,
    )
