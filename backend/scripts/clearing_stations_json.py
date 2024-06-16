import json


file = open("Наименование станций метро.json", "r", encoding="utf8")
d = json.load(file)

ids = set()
res = []

for elem in d:
    if int(elem["id"]) not in ids:
        res.append(elem)
        ids.add(int(elem["id"]))

file = open("Наименование станций метро correct.json", "w", encoding="utf8")
json.dump(res, file, ensure_ascii=False, indent=2)