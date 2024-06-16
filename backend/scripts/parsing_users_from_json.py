import json
from app.models import UserCreate
from random import choices
from app.crud import create_user
from sqlmodel import create_engine, Session

engine = create_engine("postgresql+psycopg://postgres:changethis@papuas.tech:6432/app")
session = Session(engine)


def generate_phone():
    return '7' + ''.join(choices('0123456789', k=10))


def generate_personnel_number():
    return ''.join(choices('0123456789', k=8))


rank_to_role = {
    "Администратор": "admin",
    "Специалист": "specialist",
    "ЦУ": "operator",
    "ЦИО": "operator",
    "ЦСИ": "worker",
    "ЦИ": "worker",
}
translate_sex = {
    "Мужской": "male",
    "Женский": "female"
}
shift_correcting = {
    "1": "1",
    "2": "2",
    "1Н": "1(Н)",
    "2Н": "2(Н)",
    "5": "5"
}
base_password = 'qwerty123'

file = open("Сотрудники.json", "r", encoding="utf8").read()
d = json.loads(file)

for elem in d:
    if len(elem["FIO"].split()) == 2:
        second_name = elem["FIO"].split()[0]
        first_name = elem["FIO"].split()[1][0]
        patronymic = elem["FIO"].split()[1][2]
    else:
        second_name = elem["FIO"].split()[0]
        first_name = elem["FIO"].split()[1][0]
        patronymic = elem["FIO"].split()[2][0]
    user = UserCreate(
        first_name=first_name,
        second_name=second_name,
        patronymic=patronymic,

        work_phone=generate_phone(),
        personal_phone=generate_phone(),
        personnel_number=generate_personnel_number(),
        role=rank_to_role[elem["RANK"]],
        rank=elem["RANK"],
        shift=shift_correcting[elem["SMENA"]],
        working_hours=elem["TIME_WORK"],
        sex=translate_sex[elem["SEX"]],
        area=elem["UCHASTOK"],
        is_lite=False
    )

    create_user(
        session=session,
        user_create=user,
        password=base_password
    )
