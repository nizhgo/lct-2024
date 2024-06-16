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

  update = async (id: number, data: TicketsDto.TicketForm) => {
    return await Http.request(`/tickets/${id}`)
      .expectJson(TicketsDto.Ticket)
      .put(data);
  };
})();
