import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { PassengerEndpoint } from "api/endpoints/passenger.endpoint.ts";
import { PassengerDto } from "api/models/passenger.model.ts"; // Correct path to the user model

export class PassengerFormViewModel {
  constructor() {
    makeAutoObservable(this);
  }

  async onSubmit(data: PassengerDto.PassengerForm): Promise<boolean> {
    console.log("data", data);
    try {
      await PassengerEndpoint.create(data);
    } catch (e) {
      if (e instanceof Error)
        toast.error(`Ошибка при создании пассажира: ${e.message}`);
      console.error(e);
      return false;
    }
    toast("Пассажир успешно создан");
    return true;
  }
}
