import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { PassengerEndpoint } from "api/endpoints/passenger.endpoint.ts";
import { PassengerDto } from "api/models/passenger.model.ts";

export class PassengerEditViewModel {
  data: PassengerDto.PassengerForm | null = null;
  loading = true;
  id: string;

  constructor(id: string) {
    this.id = id;
    makeAutoObservable(this);
  }

  async loadPassenger() {
    this.loading = true;
    try {
      const response = await PassengerEndpoint.findById(this.id);
      runInAction(() => {
        this.data = response;
      });
    } catch (error) {
      console.error("Failed to load passenger", error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async onSubmit(data: PassengerDto.PassengerForm): Promise<boolean> {
    try {
      await PassengerEndpoint.update(this.id, data);
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
