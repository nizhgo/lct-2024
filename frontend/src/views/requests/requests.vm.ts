import { makeAutoObservable } from "mobx";
import { RequestsEndpoint } from "api/endpoints/requests.endpoint";
import { RequestsDto } from "api/models/requests.model";

export class RequestsPageViewModel {
  requests: RequestsDto.Request[] = [];
  isLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
    this.loadRequests();
  }

  async loadRequests() {
    this.isLoading = true;
    try {
      this.requests = await RequestsEndpoint.findAll();
    } catch (e) {
      console.error("Failed to load requests", e);
    } finally {
      this.isLoading = false;
    }
  }
}
