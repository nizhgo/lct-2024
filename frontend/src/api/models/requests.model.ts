import { z } from "zod";
import { PassengerDto } from "api/models/passenger.model.ts";
import { StationsDto } from "api/models/stations.models.ts";
import { TicketsDto } from "api/models/tickets.model.ts";

export namespace RequestsDto {
  export const RequestsStatus = z.enum([
    "new",
    "processed_auto",
    "processed",
    "completed",
  ]);

  export type RequestsStatus = z.infer<typeof RequestsStatus>;

  export const requestsStatuses: RequestsStatus[] = [
    "new",
    "processed_auto",
    "processed",
    "completed",
  ];

  export const AcceptationMethod = z.enum(["phone", "email"]);

  export type AcceptationMethod = z.infer<typeof AcceptationMethod>;

  export const acceptationMethods: AcceptationMethod[] = ["phone", "email"];

  export const Request = z.object({
    passenger_id: z.number(),
    description_from: z.string().optional(),
    description_to: z.string().nullable().optional(),
    datetime: z.string(),
    acceptation_method: z.string(),
    passengers_count: z.number(),
    category: PassengerDto.PassengerCategory,
    male_users_count: z.number().nullable(),
    female_users_count: z.number().nullable(),
    status: RequestsStatus,
    additional_information: z.string(),
    baggage_type: z.string(),
    baggage_weight: z.number(),
    baggage_help: z.boolean(),
    id: z.number(),
    passenger: PassengerDto.Passenger,
    ticket: TicketsDto.TicketShort.nullable(),
    station_from: StationsDto.Station,
    station_to: StationsDto.Station,
  });

  export type Request = z.infer<typeof Request>;

  export const RequestForm = z.object({
    passenger_id: z.number().min(1, "Необходимо указать пассажира"),
    station_from_id: z
      .number()
      .min(1, "Необходимо указать станцию отправления"),
    station_to_id: z.number().min(1, "Необходимо указать станцию прибытия"),
    description_from: z.string(),
    description_to: z.string(),
    datetime: z.string().min(1, "Необходимо указать дату и время"),
    acceptation_method: z
      .string()
      .min(1, "Необходимо указать способ подтверждения"),
    passengers_count: z
      .number()
      .min(1, "Необходимо указать количество пассажиров"),
    category: PassengerDto.PassengerCategory,
    male_users_count: z
      .number()
      .min(0, "Количество мужчин не может быть отрицательным")
      .default(0),
    female_users_count: z
      .number()
      .min(0, "Количество женщин не может быть отрицательным")
      .default(0),
    additional_information: z.string(),
    baggage_type: z.string().optional(),
    baggage_weight: z.number().optional().default(0),
    baggage_help: z.boolean(),
  });

  export type RequestForm = z.infer<typeof RequestForm>;

  const statusLocalizations: Record<RequestsStatus, string> = {
    new: "Новая",
    processed_auto: "Обработана автоматически",
    processed: "Обработана",
    completed: "Завершена",
  };

  export const localizeRequestStatus = (status: RequestsStatus) =>
    statusLocalizations[status];

  const acceptationMethodLocalizations: Record<AcceptationMethod, string> = {
    phone: "Телефон",
    email: "Email",
  };

  export const localizeAcceptationMethod = (method: AcceptationMethod) =>
    acceptationMethodLocalizations[method];
}
