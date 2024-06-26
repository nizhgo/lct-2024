import { TicketsEndpoint } from "api/endpoints/tickets.endpoint.ts";
import { TicketsDto } from "api/models/tickets.model.ts";
import { makeAutoObservable } from "mobx";

export class ChangeLogPageViewModel {
  data: TicketsDto.ChangeLog[] | null = null;
  loading: boolean = true;

  constructor(private id: string) {
    makeAutoObservable(this);
  }
  async loadHistory() {
    try {
      this.data = await TicketsEndpoint.history(this.id);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }
}
