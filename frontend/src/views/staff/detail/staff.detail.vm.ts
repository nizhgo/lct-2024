import { makeAutoObservable, runInAction } from "mobx";
import { UsersDto } from "api/models/users.model.ts";
import { UsersEndpoint } from "api/endpoints/users.endpoint.ts";
import { toast } from "react-toastify";

export class StaffDetailsViewModel {
  data: UsersDto.User | null = null;
  loading = true;

  constructor(private id: string) {
    makeAutoObservable(this);
  }

  async loadStaff() {
    try {
      const staff = await UsersEndpoint.findById(this.id);
      runInAction(() => {
        this.data = staff;
        this.loading = false;
      });
    } catch (e) {
      if (e instanceof Error)
        toast.error(`Ошибка загрузки сотрудника: ${e.message}`);
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
