import { makeAutoObservable, runInAction } from "mobx";
import { UsersDto } from "api/models/users.model.ts";
import { UsersEndpoint } from "api/endpoints/users.endpoint.ts";
import { toast } from "react-toastify";
import { GapsDto } from "api/models/gaps.model.ts";
import { GapEndpoint } from "api/endpoints/gaps.endpoint.ts";

export class StaffDetailsViewModel {
  data: UsersDto.User | null = null;
  gaps: GapsDto.Gap[] = [];
  loading = true;

  constructor(private id: string) {
    makeAutoObservable(this);
  }

  async loadStaff() {
    try {
      const staff = await UsersEndpoint.findById(this.id);
      const gaps = await GapEndpoint.findByUser(this.id);
      runInAction(() => {
        this.data = staff;
        this.gaps = gaps;
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

  async addGap(data: GapsDto.GapForm): Promise<boolean> {
    try {
      await GapEndpoint.create(data);
      return true;
    } catch {
      toast.error("Не удалось добавить событие");
      return false;
    }
  }
}
