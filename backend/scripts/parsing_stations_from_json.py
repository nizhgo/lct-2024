import json
from app.models import Station
from sqlmodel import create_engine, Session

engine = create_engine("postgresql+psycopg://postgres:changethis@papuas.tech:6432/app")
session = Session(engine)

file = open("Наименование станций метро correct.json", "r", encoding="utf8").read()
d = json.loads(file)

for elem in d:
    db_obj = Station(
        id=int(elem["id"]),
        id_line=int(elem["id_line"]),
        name_station=elem["name_station"],
        name_line=elem["name_line"]
    )
    print(db_obj)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)