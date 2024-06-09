import { makeAutoObservable } from "mobx";
import { WorkersDto } from "api/models/workers.mode.ts";
import { WorkersEndpoint } from "api/endpoints/workers.endpoint.ts";

export class WorkersPageViewModel {
  constructor() {
    void this.#init();
    makeAutoObservable(this);
  }
  isLoading = true;
  staff: WorkersDto.Worker[] = [];

  async #init() {
    const res = await WorkersEndpoint.findAll();
    this.staff = res as unknown as WorkersDto.Worker[];
    this.isLoading = false;
  }
}
