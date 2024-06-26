import { Http } from "utils/api/http.ts";
import { z } from "zod";
import { TicketsDto } from "api/models/tickets.model.ts";

export const TicketsEndpoint = new (class TicketsEndpoint {
  findAll = async (offset: number, limit: number, search?: string) => {
    return await Http.request("/tickets/")
      .withSearch({ offset, limit, search })
      .expectJson(z.array(TicketsDto.Ticket))
      .get();
  };

  create = async (data: TicketsDto.TicketForm) => {
    return await Http.request("/tickets/")
      .expectJson(TicketsDto.Ticket)
      .post(data);
  };

  update = async (id: string, data: TicketsDto.TicketForm) => {
    return await Http.request(`/tickets/${id}`)
      .expectJson(TicketsDto.Ticket)
      .put(data);
  };

  history = async (id: string) => {
    return await Http.request(`/tickets/${id}/history`)
      .expectJson(z.array(TicketsDto.ChangeLog))
      .get();
  };
})();
