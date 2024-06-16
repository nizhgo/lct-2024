import { RequestsDto } from "api/models/requests.model.ts";
import { makeAutoObservable } from "mobx";
import { RequestsEndpoint } from "api/endpoints/requests.endpoint.ts";

export class RequestEditViewModel {
  data: RequestsDto.Request | null = null;
  loading = true;
  id: string;

  constructor(id: string) {
    this.id = id;
    makeAutoObservable(this);
  }

  async loadRequest() {
    try {
      this.loading = true;
      this.data = await RequestsEndpoint.findById(this.id);
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }
}
