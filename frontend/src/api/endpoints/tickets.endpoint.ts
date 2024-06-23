import { Http } from "utils/api/http.ts";
import { z } from "zod";
import { TicketsDto } from "api/models/tickets.model.ts";

export const TicketsEndpoint = new (class TicketsEndpoint {
  findAll = async (offset: number, limit: number, query?: string) => {
    return await Http.request("/tickets/")
      .withSearch({ offset, limit, query })
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

})();
