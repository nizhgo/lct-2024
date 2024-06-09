import { makeAutoObservable } from "mobx";
import {PassengerDto} from "api/models/passenger.model.ts";
import {PassengerEndpoint} from "api/endpoints/passenger.endpoint.ts";

export class PassengersPageViewModel {
  constructor() {
    void this.#init();
    makeAutoObservable(this);
  }
  isLoading = true;
  passengers: PassengerDto.Passenger[] = [];

  async #init() {
    const res = await PassengerEndpoint.findAll();
    this.passengers = res as unknown as PassengerDto.Passenger[];
    this.isLoading = false;
  }
}
