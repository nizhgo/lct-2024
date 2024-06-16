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
    users: z.array(UsersDto.User),
    request: z.object({
      id: z.number(),
    }),
  });

  export const TicketShort = z.object({
    request_id: z.number(),
    route: z.array(z.string()),
    start_time: z.string(),
    end_time: z.string().nullable(),
    real_end_time: z.string().nullable(),
    additional_information: z.string(),
    status: TicketStatus,
    users: z.array(UsersDto.User),
  });

  export type TicketShort = z.infer<typeof TicketShort>;
}