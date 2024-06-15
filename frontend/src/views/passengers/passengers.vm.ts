import { makeAutoObservable } from "mobx";
import { PassengerDto } from "api/models/passenger.model.ts";
import { PassengerEndpoint } from "api/endpoints/passenger.endpoint.ts";
import { InfinityScrollProvider } from "utils/infinity-scroll.tsx";

export class PassengersPageViewModel {
  provider: InfinityScrollProvider<PassengerDto.Passenger>;
  constructor() {
    this.provider = new InfinityScrollProvider(this.fetchRequests.bind(this));
    makeAutoObservable(this);
  }

  async fetchRequests(offset: number, limit: number, search?: string) {
    try {
      const response = await PassengerEndpoint.findAll(offset, limit, search);
      return response;
    } catch (e) {
      console.error("Failed to load passengers", e);
      return [];
    }
  }
}
