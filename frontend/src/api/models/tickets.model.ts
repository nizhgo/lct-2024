import { z } from "zod";
import { UsersDto } from "api/models/users.model.ts";

export namespace TicketsDto {
  import User = UsersDto.User;
  export const Roles = z.enum(["admin", "worker", "operator", "specialist"]);

  export type Roles = z.infer<typeof UsersDto.Roles>;

  export const rolesValues: Roles[] = [
    "admin",
    "worker",
    "operator",
    "specialist",
  ];

  export const Ranks = z.enum(["ЦУ", "ЦСИ", "ЦИО", "ЦИ", "ЦА"]);

  export type Ranks = z.infer<typeof UsersDto.Ranks>;

  export const ranksValues: Ranks[] = ["ЦУ", "ЦСИ", "ЦИО", "ЦИ"];

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
    end_time: z.string().optional(),
    real_end_time: z.string().optional(),
    additional_information: z.string().optional(),
    status: TicketStatus,
    users: z.array(UsersDto.User).optional(),
    request: z
      .object({
        id: z.number(),
      })
      .optional(),
  });

  export type Ticket = z.infer<typeof Ticket>;

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

  export const ChangeLogAuthor = z.object({
    first_name: z.string(),
    second_name: z.string(),
    patronymic: z.string(),
    work_phone: z.string().nullable(),
    personal_phone: z.string().nullable(),
    personnel_number: z.string(),
    role: Roles,
    rank: Ranks,
    shift: z.string(),
    working_hours: z.string(),
    sex: z.string(),
    area: z.string(),
    is_lite: z.boolean(),
    id: z.number(),
    is_working: z.boolean(),
    initials: z.string(),
    should_work_today: z.boolean(),
  });

  export const ChangeLog = z.object({
    author: ChangeLogAuthor,
    change_date: z.string(),
    ticket_id: z.number(),
    request_id: z.number().nullable(),
    route: z.array(z.string()).nullable(),
    start_time: z.string().nullable(),
    end_time: z.string().nullable(),
    real_end_time: z.string().nullable(),
    additional_information: z.string().nullable(),
    status: TicketStatus.nullable(),
    users: z.array(User).nullable(),
  });

  export type ChangeLog = z.infer<typeof ChangeLog>;

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
  };
}
