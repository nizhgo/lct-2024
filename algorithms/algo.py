from collections import defaultdict
from pprint import pprint

from entity import User, Event, UserSchedule, Bracket, Segment
from utils import sort_users_by_time, match_user, get_time, generate_random_datetime, get_path
from parsers import get_routes
from datetime import timedelta, datetime
from globals import BASE

NORMAL_COEFFICIENT = 1
TRAVEL_LAG = timedelta(minutes=15)


# TODO: parsers(serializers,deserializers)

def assign(users: list[User], events: list[Event]) -> dict:
    # init
    get_routes()
    result = defaultdict(list)
    unassigned_events = []
    events.sort(key=lambda event: event.start)

    lunch_supposed_time_by_user_id = {}

    for user in users:
        start_time = user.start + timedelta(hours=3.5)
        end_time = user.end - timedelta(hours=2 + 1)

        lunch_supposed_time_by_user_id[user.id] = generate_random_datetime(start_time, end_time)

    for event in events:
        if event.is_permanent and event.user_ids:
            for user_id in event.user_ids:
                user = User.get(user_id)
                result[user.id].append(event.object_id)
                user.free_time = event.end
                user.current_station = event.station_to
            continue

        sorted_users = sort_users_by_time(event.station_from, users, NORMAL_COEFFICIENT)
        male_count = event.male_count
        female_count = event.female_count
        assigned_users = []
        for user in sorted_users:
            if female_count == 0:
                break
            if user.sex == "female" and match_user(user, event):
                assigned_users.append(user.id)
                female_count -= 1
        for user in sorted_users:
            if female_count + male_count == 0:
                break
            if user.sex == "male" and match_user(user, event):
                if female_count:
                    female_count -= 1
                else:
                    male_count -= 1
                assigned_users.append(user.id)
            else:
                pass
        if (male_count + female_count) != 0:
            event.user_ids = []
            unassigned_events.append(event)
            continue
        else:
            event.user_ids = assigned_users

        for user_id in assigned_users:
            user = User.get(user_id)
            user.free_time = event.end
            if event.station_to:
                user.current_station = event.station_to
            result[user_id].append(event.object_id)

            # unc
            # events_ = [Event.get(event_id) for event_id in result[user_id]]
            # events_.sort(key=lambda event: event.start)
            #
            # for i in range(1, len(events_)):
            #     if events_[i - 1].end > events_[i].start - (
            #             TRAVEL_LAG if events_[i].type == "request" else timedelta()):
            #         print(user_id, events_[i - 1], events_[i])

            if user.free_time >= lunch_supposed_time_by_user_id[user_id] and not user.has_lunch:
                lunch = Event(
                    type="lunch",
                    is_permanent=True,
                    user_ids=[user_id],
                    male_count=0,
                    female_count=1,
                    start=user.free_time,
                    end=user.free_time + timedelta(hours=1),
                    coefficient=1,
                    station_from=None,
                    station_to=None,
                    has_ticket=False
                )
                if match_user(user, lunch):
                    result[user_id].append(
                        lunch.object_id
                    )
                    user.free_time += timedelta(hours=1)
                    user.has_lunch = True
                else:
                    Event.delete(lunch.object_id)

    segments: list[Segment] = []

    for user in users:
        if len(result[user.id]) == 0:
            segments.append(
                Segment(
                    station_from=None,
                    station_to=None,
                    start=user.start,
                    end=user.end,
                    user_id=user.id,
                    sex=user.sex
                )
            )
            continue
        first_event = Event.get(result[user.id][0])
        segments.append(
            Segment(
                station_from=None,
                station_to=first_event.station_from,
                start=user.start,
                end=first_event.start - TRAVEL_LAG,
                user_id=user.id,
                sex=user.sex
            )
        )
        for event_iter in range(1, len(result[user.id])):
            prev_event = Event.get(result[user.id][event_iter - 1])
            current_event = Event.get(result[user.id][event_iter])
            segments.append(
                Segment(
                    station_from=prev_event.station_to,
                    station_to=current_event.station_from,
                    start=prev_event.end,
                    end=current_event.start - TRAVEL_LAG,
                    user_id=user.id,
                    sex=user.sex
                )
            )
        last_event = Event.get(result[user.id][-1])
        segments.append(
            Segment(
                station_from=last_event.station_to,
                station_to=None,
                start=last_event.end,
                end=user.end,
                user_id=user.id,
                sex=user.sex
            )
        )

    for event in unassigned_events:
        brackets: list[Bracket] = []
        for segment in segments:
            start = segment.start + get_time(segment.station_from, event.station_from, NORMAL_COEFFICIENT)
            end = segment.end - get_time(event.station_to, segment.station_to,
                                         NORMAL_COEFFICIENT) - event.duration - TRAVEL_LAG
            if end < start:
                continue

            brackets.append(
                Bracket(
                    segment_object_id=segment.object_id,
                    user_id=segment.user_id,
                    time=start,
                    true_time=segment.start,
                    type="open",
                    sex=segment.sex,
                )
            )
            brackets.append(
                Bracket(
                    segment_object_id=segment.object_id,
                    user_id=segment.user_id,
                    time=end,
                    true_time=segment.end,
                    type="close",
                    sex=segment.sex,
                )
            )
        brackets.sort(key=lambda b: [b.time, b.type == "close"])
        new_segments: list[Segment] = segments
        males_open = set()
        females_open = set()

        for bracket in brackets:
            if bracket.type == "open":
                if bracket.sex == "male":
                    males_open.add((bracket.user_id, bracket.segment_object_id))
                else:
                    females_open.add((bracket.user_id, bracket.segment_object_id))
                if min(len(females_open), event.female_count) + len(
                        males_open) == event.male_count + event.female_count:
                    female_get_count = min(len(females_open), event.female_count)
                    user_ids_segment_object_ids = list(females_open)[:female_get_count] + list(males_open)
                    if bracket.time >= event.start - TRAVEL_LAG:
                        event.start = bracket.time + TRAVEL_LAG
                        event.end = event.start + get_time(event.station_from, event.station_to, event.coefficient)
                        new_segments = []
                        event.user_ids = [user_id for user_id, _ in user_ids_segment_object_ids]
                        for user_id, segment_object_id in user_ids_segment_object_ids:
                            result[user_id].append(event.object_id)

                            # unc
                            # events_ = [Event.get(event_id) for event_id in result[user_id]]
                            # events_.sort(key=lambda event: event.start)
                            # for i in range(1, len(events_)):
                            #     if events_[i - 1].end > events_[i].start - (
                            #             TRAVEL_LAG if events_[i].type == "request" else timedelta()):
                            #         print(user_id, events_[i - 1], events_[i])

                            segment = Segment.get(bracket.segment_object_id)
                            new_segments.append(
                                Segment(
                                    station_from=segment.station_from,
                                    station_to=event.station_from,
                                    start=segment.start,
                                    end=event.start - TRAVEL_LAG - get_time(Segment.get(segment_object_id).station_from,
                                                                            event.station_from, NORMAL_COEFFICIENT),
                                    user_id=segment.user_id,
                                    sex=segment.sex,
                                ))
                            new_segments.append(
                                Segment(
                                    station_from=event.station_to,
                                    station_to=segment.station_to,
                                    start=event.end,
                                    end=segment.end,
                                    user_id=segment.user_id,
                                    sex=segment.sex,
                                ))
                        for segment in segments:
                            if segment.object_id not in [segment_object_id for _, segment_object_id in
                                                         user_ids_segment_object_ids]:
                                new_segments.append(segment)
                        break
            else:
                if bracket.sex == "male":
                    males_open.discard((bracket.user_id, bracket.segment_object_id))
                else:
                    females_open.discard((bracket.user_id, bracket.segment_object_id))
        segments = new_segments


    for (user_id, event_ids) in result.items():
        events_ = [Event.get(event_id) for event_id in event_ids]
        events_.sort(key=lambda event: event.start)

        for i in range(1, len(events_)):
            if events_[i - 1].end > events_[i].start - (TRAVEL_LAG if events_[i].type == "request" else timedelta()):
                print(user_id, event_ids, events_[i - 1], events_[i])

    return result
