import { z } from "zod";
import { UsersDto } from "api/models/users.model.ts";

export namespace TicketsDto {
  export const TicketStatus = z.enum([
    "Принята",
    "Инспектор выехал",
    "Инспектор на месте",
    "Поездка",
    "Заявка закончена",
    "Пассажир опаздывает",
    "Инспектор опаздывает",
  ]);

  export type TicketStatus = z.infer<typeof TicketStatus>;

  export const ticketStatus = [
    "Принята",
    "Инспектор выехал",
    "Инспектор на месте",
    "Поездка",
    "Заявка закончена",
    "Пассажир опаздывает",
    "Инспектор опаздывает",
  ];

  export const Ticket = z.object({
    request_id: z.number(),
    route: z.array(z.string()),
    start_time: z.string(),
    end_time: z.string().nullable(),
    real_end_time: z.string().nullable(),
    additional_information: z.string(),
    status: TicketStatus,
    users: z.array(UsersDto.User).nullable(),
    request: z.object({
      id: z.number(),
    }).optional(),
  });

  export const TicketShort = z.object({
    id: z.number(),
    request_id: z.number(),
    route: z.array(z.string()),
    start_time: z.string(),
    end_time: z.string().nullable(),
    real_end_time: z.string().nullable(),
    additional_information: z.string(),
    status: TicketStatus,
    users: z.array(UsersDto.User).nullable(),
  });

  export type TicketShort = z.infer<typeof TicketShort>;

  export const TicketForm = z.object({
    request_id: z.number(),
    route: z.array(z.string()),
    start_time: z.string(),
    end_time: z.string().nullable(),
    real_end_time: z.string().nullable(),
    additional_information: z.string(),
    status: TicketStatus,
    user_ids: z.array(z.number()),
  });

  export type TicketForm = z.infer<typeof TicketForm>;

  export const convertTicketShortToForm = (ticket: TicketShort): TicketForm => {
    return {
      request_id: ticket.request_id,
      route: ticket.route,
      start_time: ticket.start_time,
      end_time: ticket.end_time,
      real_end_time: ticket.real_end_time,
      additional_information: ticket.additional_information,
      status: ticket.status,
      user_ids: ticket.users?.map((user) => user.id) ?? [],
    };
  }
}
