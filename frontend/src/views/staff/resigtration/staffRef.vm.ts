import { makeAutoObservable } from "mobx";
import { UsersEndpoint } from "api/endpoints/users.endpoint.ts";
import { toast } from "react-toastify";
import { UsersDto } from "api/models/users.model.ts"; // Correct path to the user model

export class WorkerRegPageViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  async onSubmit(data: UsersDto.UserForm): Promise<boolean> {
    console.log("data", data);
    try {
      await UsersEndpoint.create(data);
    } catch (e) {
      if (e instanceof Error)
        toast.error(`Ошибка при создании сотрудника: ${e.message}`);
      console.error(e);
      return false;
    }
    toast("Cотрудник успешно создан");
    return true;
  }
}
