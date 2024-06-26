import { makeAutoObservable } from "mobx";
import { RequestsEndpoint } from "api/endpoints/requests.endpoint";
import { RequestsDto } from "api/models/requests.model";
import { InfinityScrollProvider } from "utils/infinity-scroll.tsx";

export class RequestsPageViewModel {
  provider: InfinityScrollProvider<RequestsDto.Request> =
    new InfinityScrollProvider(this.fetchRequests.bind(this));
  isLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchRequests(offset: number, limit: number, search?: string) {
    try {
      const response = await RequestsEndpoint.findAll(
        offset,
        limit,
        search,
        this.provider && this.provider.filters,
      );
      return response;
    } catch (e) {
      console.error("Failed to load requests", e);
      return [];
    }
  }
}
