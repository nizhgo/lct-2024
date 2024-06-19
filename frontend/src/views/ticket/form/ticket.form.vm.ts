import { InfinityScrollProvider } from "utils/infinity-scroll.tsx";
import { StationsDto } from "api/models/stations.models.ts";
import { PassengerDto } from "api/models/passenger.model.ts";
import { makeAutoObservable } from "mobx";
import { StationsEndpoint } from "api/endpoints/stations.endpoint.ts";
import { PassengerEndpoint } from "api/endpoints/passenger.endpoint.ts";
import { toast } from "react-toastify";
import { TicketsDto } from "api/models/tickets.model.ts";
import { TicketsEndpoint } from "api/endpoints/tickets.endpoint.ts";

export class TicketCreateViewModel {
  stationProvider: InfinityScrollProvider<StationsDto.Station>;
  passengerProvider: InfinityScrollProvider<PassengerDto.Passenger>;
  constructor() {
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

  async onSubmit(data: TicketsDto.TicketForm): Promise<boolean> {
    console.log("data", data);
    try {
      await TicketsEndpoint.create(data);
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
