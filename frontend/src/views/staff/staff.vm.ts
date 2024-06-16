import { makeAutoObservable } from "mobx";
import { UsersDto } from "api/models/users.model.ts";
import { UsersEndpoint } from "api/endpoints/users.endpoint.ts";
import { InfinityScrollProvider } from "utils/infinity-scroll.tsx";
import { toast } from "react-toastify";

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
  async onCheck(data: string): Promise<boolean> {
    try {
      await UsersEndpoint.check(data);
      toast.success("Пассажир успешно обновлен");
      return true;
    } catch (e) {
      if (e instanceof Error)
        toast.error(`Ошибка при обновлении пассажира: ${e.message}`);
      console.error(e);
      return false;
    }
  }
}
