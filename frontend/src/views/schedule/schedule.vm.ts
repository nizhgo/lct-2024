import { makeAutoObservable } from "mobx";
import moment from "moment";
import { ScheduleEndpoint } from "api/endpoints/schedule.endpoint";
import { ScheduleDto } from "api/models/schedule.model.ts";

interface TimelessItem {
  id: string;
  group: number;
  title: string;
  start_time: moment.Moment;
  end_time: moment.Moment;
  link: string;
}

export class ScheduleViewModel {
  currentDate = moment().startOf("day").add(3, "hours");
  groups: { id: number; title: string }[] = [];
  items: TimelessItem[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.currentDate = this.getQueryParams();
    this.loadSchedule();
  }

  async loadSchedule() {
    this.isLoading = true;
    const startTime = this.currentDate.toDate();
    const endTime = this.currentDate.clone().add(24, "hours").toDate();

    try {
      const scheduleData = await ScheduleEndpoint.findAll(startTime, endTime);

      this.groups = scheduleData.map((item: ScheduleDto.Item) => ({
        id: item.user.id,
        title: `${item.user.second_name} ${item.user.first_name} ${item.user.patronymic}`,
      }));

      this.items = scheduleData.flatMap((item: ScheduleDto.Item) => {
        const gaps = item.gaps.map((gap) => ({
          id: `gap-${gap.id}`,
          group: item.user.id,
          title: gap.status,
          start_time: moment(gap.start_time),
          end_time: moment(gap.end_time),
          link: `/staff/${item.user.id}`,
        }));

        const tickets = item.tickets.map((ticket) => ({
          id: `ticket-${ticket.request_id}-${item.user.id}`,
          group: item.user.id,
          title: `#${ticket.request_id}`,
          start_time: moment(ticket.start_time),
          end_time: moment(ticket.real_end_time || ticket.end_time),
          link: `/requests/${ticket.request_id}`,
        }));

        return [...gaps, ...tickets];
      });
    } catch (error) {
      console.error("Failed to load schedule", error);
    } finally {
      this.isLoading = false;
    }
  }

  setCurrentDate(date: moment.Moment) {
    this.currentDate = date;
    this.saveQueryParams();
    this.loadSchedule();
  }

  saveQueryParams() {
    const searchParams = new URLSearchParams();
    searchParams.set("date", this.currentDate.format("YYYY-MM-DD"));
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${searchParams}`,
    );
  }

  getQueryParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const date = searchParams.get("date");
    return date ? moment(date, "YYYY-MM-DD") : moment();
  }

  nextDay() {
    this.setCurrentDate(this.currentDate.clone().add(1, "days"));
  }

  prevDay() {
    this.setCurrentDate(this.currentDate.clone().subtract(1, "days"));
  }
}
