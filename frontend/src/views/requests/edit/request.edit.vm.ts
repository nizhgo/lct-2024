import { RequestsDto } from "api/models/requests.model.ts";
import { makeAutoObservable, runInAction } from "mobx";
import { RequestsEndpoint } from "api/endpoints/requests.endpoint.ts";
import { InfinityScrollProvider } from "utils/infinity-scroll.tsx";
import { StationsDto } from "api/models/stations.models.ts";
import { PassengerDto } from "api/models/passenger.model.ts";
import { StationsEndpoint } from "api/endpoints/stations.endpoint.ts";
import { PassengerEndpoint } from "api/endpoints/passenger.endpoint.ts";
import { toast } from "react-toastify";

export class RequestEditViewModel {
  data: RequestsDto.Request | null = null;
  loading = true;
  id: string;
  stationProvider: InfinityScrollProvider<StationsDto.Station>;
  passengerProvider: InfinityScrollProvider<PassengerDto.Passenger>;

  constructor(id: string) {
    this.id = id;
    this.stationProvider = new InfinityScrollProvider(
      this.fetchStations.bind(this),
    );
    this.passengerProvider = new InfinityScrollProvider(
      this.fetchPassengers.bind(this),
    );
    makeAutoObservable(this);
  }

  async fetchStations(offset: number, limit: number, search?: string) {
    try {
      return await StationsEndpoint.findAll(offset, limit, search);
    } catch (e) {
      console.error("Failed to load stations", e);
      return [];
    }
  }

  async fetchPassengers(offset: number, limit: number, search?: string) {
    try {
      return await PassengerEndpoint.findAll(offset, limit, search);
    } catch (e) {
      console.error("Failed to load passengers", e);
      return [];
    }
  }

  async loadRequest() {
    this.loading = true;
    try {
      const response = await RequestsEndpoint.findById(this.id);
      this.stationProvider.data = [...this.stationProvider.data, response.station_from, response.station_to];
      this.passengerProvider.data = [...this.passengerProvider.data, response.passenger];
      runInAction(() => {
        this.data = response;
      });
    } catch (error) {
      console.error(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async onSubmit(data: RequestsDto.RequestForm): Promise<boolean> {
    console.log("data", data);
    try {
      await RequestsEndpoint.update(this.id, data);
      toast.success("Заявка успешно обновлена");
      return true;
    } catch (e) {
      if (e instanceof Error) {
        toast.error(`Ошибка при обновлении заявки: ${e.message}`);
      }
      console.error(e);
      return false;
    }
  }
}
