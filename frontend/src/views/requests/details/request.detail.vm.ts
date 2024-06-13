import { makeAutoObservable } from "mobx";
import { RequestsDto } from "api/models/requests.model.ts";
import { RequestsEndpoint } from "api/endpoints/requests.endpoint.ts";

export class RequestDetailsViewModel {
  data: RequestsDto.Request | null = null;
  loading: boolean = true;

  constructor(private id: string) {
    makeAutoObservable(this);
  }

  async loadRequest() {
    try {
      this.data = await RequestsEndpoint.findById(this.id);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }
}
