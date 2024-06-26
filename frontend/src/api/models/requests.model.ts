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
    "distribution_error",
  ]);

  export type RequestsStatus = z.infer<typeof RequestsStatus>;

  export const requestsStatuses: RequestsStatus[] = [
    "new",
    "processed_auto",
    "processed",
    "completed",
    "distribution_error",
  ];

  export const AcceptationMethod = z.enum(["phone", "internet"]);

  export type AcceptationMethod = z.infer<typeof AcceptationMethod>;

  export const acceptationMethods: AcceptationMethod[] = ["phone", "internet"];

  export const Request = z.object({
    passenger_id: z.number(),
    description_from: z.string().optional(),
    description_to: z.string().optional(),
    datetime: z.string(),
    acceptation_method: z.string(),
    passengers_count: z.number(),
    category: PassengerDto.PassengerCategory,
    male_users_count: z.number().optional(),
    female_users_count: z.number().optional(),
    status: RequestsStatus,
    additional_information: z.string(),
    baggage_type: z.string().nullable().optional(),
    baggage_weight: z.number().nullable().optional(),
    baggage_help: z.boolean().nullable().optional(),
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
    description_from: z.string().optional(),
    description_to: z.string().optional(),
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
      .default(0)
      .optional(),
    female_users_count: z
      .number()
      .min(0, "Количество женщин не может быть отрицательным")
      .default(0)
      .optional(),
    additional_information: z.string().optional(),
    baggage_type: z.string().nullable().optional(),
    baggage_weight: z.number().nullable().optional(),
    baggage_help: z.boolean().nullable().optional().default(false),
  });

  export type RequestForm = z.infer<typeof RequestForm>;

  const statusLocalizations: Record<RequestsStatus, string> = {
    new: "Новая",
    processed_auto: "Обработана автоматически",
    processed: "Обработана",
    completed: "Завершена",
    distribution_error: "Не удалось распределить автоматически",
  };

  export const localizeRequestStatus = (status: RequestsStatus) =>
    statusLocalizations[status];

  const acceptationMethodLocalizations: Record<AcceptationMethod, string> = {
    phone: "Телефон",
    internet: "Интернет",
  };

  export const localizeAcceptationMethod = (method: AcceptationMethod) =>
    acceptationMethodLocalizations[method];

  export const convertRequestToForm = (request: Request): RequestForm => {
    return {
      passenger_id: request.passenger_id,
      station_from_id: request.station_from.id,
      station_to_id: request.station_to.id,
      description_from: request.description_from,
      description_to: request.description_to,
      datetime: request.datetime,
      acceptation_method: request.acceptation_method,
      passengers_count: request.passengers_count,
      category: request.category,
      male_users_count: request.male_users_count,
      female_users_count: request.female_users_count,
      baggage_weight: request.baggage_weight,
      baggage_help: request.baggage_help || false,
    };
  };
}
