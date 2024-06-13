import { makeAutoObservable } from "mobx";
import { RequestsDto } from "api/models/requests.model.ts";
import { RequestsEndpoint } from "api/endpoints/requests.endpoint.ts";
import { toast } from "react-toastify";

export class RequestCreateViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  async onSubmit(data: RequestsDto.RequestForm): Promise<boolean> {
    console.log("data", data);
    try {
      await RequestsEndpoint.create(data);
      toast.success("Заявка успешно создана");
      return true;
    } catch (e) {
      if (e instanceof Error) {
        toast.error(`Ошибка при создании заявки: ${e.message}`);
      }
      console.error(e);
      return false;
    }
  }
}
