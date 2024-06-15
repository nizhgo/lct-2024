import { makeAutoObservable } from "mobx";
import { UsersDto } from "api/models/users.model.ts";
import { UsersEndpoint } from "api/endpoints/users.endpoint.ts";
import { InfinityScrollProvider } from "utils/infinity-scroll.tsx";

export class StaffPageViewModel {
  provider: InfinityScrollProvider<UsersDto.User>;
  constructor() {
    this.provider = new InfinityScrollProvider(this.fetchRequests.bind(this));
    makeAutoObservable(this);
  }

  async fetchRequests(offset: number, limit: number, search?: string) {
    try {
      return await UsersEndpoint.findAll(offset, limit, search);
    } catch (e) {
      console.error("Failed to load staff", e);
      return [];
    }
  }
}
