import json
from collections import defaultdict
import pickle


file = open("Наименование станций метро correct.json", "r", encoding="utf8").read()
d = json.loads(file)

id_to_info = {}
for elem in d:

    id_to_info[int(elem["id"])] = {
        "id": int(elem["id"]),
        "id_line": int(elem["id_line"]),
        "name_station": elem["name_station"],
        "name_line": elem["name_line"]
    }


for coefficient in [1,  2, 3, 4]:
    file = open("Метро время между станциями.json", "r", encoding="utf8").read()
    d = json.loads(file)
    n = 440
    graph = defaultdict(lambda: [])

    # добавление рёбер-дорог между станциями
    for elem in d:
        elem["id_st1"] = int(elem["id_st1"])
        elem["id_st2"] = int(elem["id_st2"])
        elem["time"] = float(elem["time"].replace(",", "."))
        graph[elem["id_st1"]].append([elem["id_st2"], elem["time"]])
        graph[elem["id_st2"]].append([elem["id_st1"], elem["time"]])

    file = open("Метро время пересадки между станциями.json", "r", encoding="utf8").read()
    d = json.loads(file)

    # добавление рёбер-пересадок между станциями
    for elem in d:
        elem["id1"] = int(elem["id1"])
        elem["id2"] = int(elem["id2"])
        elem["time"] = float(elem["time"].replace(",", ".")) * 1.0
        graph[elem["id1"]].append([elem["id2"], elem["time"]])

    res = []

    # для каждой стартовой вершины путём алгоритма Дейстры находим кратчайшее расстояние до остальных вершин
    for start in range(1, n + 1):
        INF = 10 ** 10
        dist = defaultdict(lambda: INF)
        prev = defaultdict(lambda: 0)
        dist[start] = 0
        used = defaultdict(lambda: False)
        min_dist = 0
        min_vertex = start
        while min_dist < INF:
            i = min_vertex 
            used[i] = True 
            for [j, w] in graph[i]:
                if dist[i] + w < dist[j]:
                    dist[j] = dist[i] + w
                    prev[j] = i
            min_dist = INF
            for j in range(n):
                if not used[j] and dist[j] < min_dist:
                    min_dist = dist[j]
                    min_vertex = j
        # для каждой конечной вершины находим полный путь от начальной вершины
        for end in range(1, n + 1):
            path = []
            i = end
            while i != 0:
                if i in id_to_info:
                    path.append(id_to_info[i])
                i = prev[i]
            path = path[::-1]
            res.append(
                {
                    "station_from": start,
                    "station_to": end,
                    "time": dist[end],
                    "path": path
                }
            )
    
    with open(f"calculated_paths_{coefficient}.p", 'wb') as fp:
        pickle.dump(res, fp, protocol=pickle.HIGHEST_PROTOCOL)
        