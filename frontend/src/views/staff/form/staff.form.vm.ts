import { makeAutoObservable } from "mobx";
import { UsersEndpoint } from "api/endpoints/users.endpoint.ts";
import { toast } from "react-toastify";
import { UsersDto } from "api/models/users.model.ts"; // Correct path to the user model

export class WorkerRegPageViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  async onSubmit(
    data: UsersDto.UserForm,
  ): Promise<UsersDto.RegistrationResponse | false> {
    console.log("data", data);
    try {
      const res = await UsersEndpoint.create(data);
      return res;
    } catch (e) {
      if (e instanceof Error)
        toast.error(`Ошибка при создании сотрудника: ${e.message}`);
      console.error(e);
      return false;
    }
  }
}
