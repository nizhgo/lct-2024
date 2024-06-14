import { makeAutoObservable, runInAction } from "mobx";
import { PassengerDto } from "api/models/passenger.model.ts";
import { PassengerEndpoint } from "api/endpoints/passenger.endpoint.ts";
import { RequestsEndpoint } from "api/endpoints/requests.endpoint.ts";
import { RequestsDto } from "api/models/requests.model.ts";

export class PassengerDetailsViewModel {
  data: PassengerDto.Passenger | null = null;
  requests: RequestsDto.Request[] = [];
  loading = true;
  id: string;

  constructor(id: string) {
    this.id = id;
    makeAutoObservable(this);
  }

  async loadPassenger() {
    this.loading = true;
    try {
      const response = await PassengerEndpoint.findById(this.id);
      runInAction(() => {
        this.data = response;
      });
    } catch (error) {
      console.error("Failed to load passenger", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
  async loadRequests() {
    this.loading = true;
    try {
      const response = await RequestsEndpoint.findByPassengerId(this.id);
      runInAction(() => {
        this.requests = response as unknown as RequestsDto.Request[];
      });
    } catch (error) {
      console.error("Failed to load passenger requests", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
