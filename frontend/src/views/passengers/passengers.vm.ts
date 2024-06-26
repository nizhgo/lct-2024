import { makeAutoObservable } from "mobx";
import { PassengerDto } from "api/models/passenger.model.ts";
import { PassengerEndpoint } from "api/endpoints/passenger.endpoint.ts";
import { InfinityScrollProvider } from "utils/infinity-scroll.tsx";

export class PassengersPageViewModel {
  provider: InfinityScrollProvider<PassengerDto.Passenger> =
    new InfinityScrollProvider(this.fetchRequests.bind(this));

  constructor() {
    makeAutoObservable(this);
  }

  async fetchRequests(offset: number, limit: number, search?: string) {
    try {
      return await PassengerEndpoint.findAll(
        offset,
        limit,
        search,
        this.provider && this.provider.filters,
      );
    } catch (e) {
      console.error("Failed to load passengers", e);
      return [];
    }
  }
}
