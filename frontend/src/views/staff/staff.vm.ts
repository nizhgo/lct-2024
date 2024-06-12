import { makeAutoObservable } from "mobx";
import { UsersDto } from "api/models/users.model.ts";
import { UsersEndpoint } from "api/endpoints/users.endpoint.ts";

export class StaffPageViewModel {
  constructor() {
    void this.#init();
    makeAutoObservable(this);
  }
  isLoading = true;
  staff: UsersDto.User[] = [];

  async #init() {
    const res = await UsersEndpoint.findAll();
    this.staff = res as unknown as UsersDto.User[];
    this.isLoading = false;
  }
}
