import { makeAutoObservable, runInAction } from "mobx";
import { PassengerDto } from "api/models/passenger.model.ts";
import { PassengerEndpoint } from "api/endpoints/passenger.endpoint.ts";

export class PassengerDetailsViewModel {
  data: PassengerDto.Passenger | null = null;
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
}
