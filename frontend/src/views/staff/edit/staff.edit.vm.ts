import { makeAutoObservable, runInAction } from "mobx";
import { UsersDto } from "api/models/users.model.ts";
import { UsersEndpoint } from "api/endpoints/users.endpoint.ts";
import { toast } from "react-toastify";

export class StaffEditViewModel {
  data: UsersDto.UserUpdateForm | null = null;
  loading = true;
  id: string;

  constructor(id: string) {
    this.id = id;
    makeAutoObservable(this);
  }

  async loadStaff() {
    this.loading = true;
    try {
      const response = await UsersEndpoint.findById(this.id);
      runInAction(() => {
        this.data = UsersDto.convertUserToForm(response);
      });
    } catch (error) {
      console.error("Failed to load staff", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async onSubmit(data: UsersDto.UserUpdateForm): Promise<boolean> {
    try {
      await UsersEndpoint.update(this.id, data);
      toast("Сотрудник успешно обновлен");
      return true;
    } catch (e) {
      if (e instanceof Error) {
        toast.error(`Ошибка при обновлении сотрудника: ${e.message}`);
        console.error(e);
      }
      return false;
    }
  }

  async onDelete(): Promise<boolean> {
    try {
      await UsersEndpoint.delete(this.id);
      toast.success("Сотрудник успешно удален");
      return true;
    } catch (e) {
      if (e instanceof Error)
        toast.error(`Ошибка при удалении сотрудника: ${e.message}`);
      console.error(e);
      return false;
    }
  }
}
