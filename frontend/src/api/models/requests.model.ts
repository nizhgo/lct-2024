import { z } from "zod";
import { PassengerDto } from "api/models/passenger.model.ts";

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

  export const Line = z.enum([
    "1",
    "2",
    "3",
    "4",
    "4А",
    "5",
    "6",
    "7",
    "8",
    "8А",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "БКЛ",
    "БКЛ(А)",
    "Д1",
    "Д2",
    "Д3",
    "Д4",
    "Д5",
    "МЦК",
    "Л1",
  ]);

  export type Line = z.infer<typeof Line>;

  export const Station = z.object({
    id_line: z.number(),
    name_station: z.string(),
    name_line: Line,
    id: z.number(),
  });

  export type Station = z.infer<typeof Station>;

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
    ticket: z.object({}).nullable(),
    station_from: Station,
    station_to: Station,
  });

  export type Request = z.infer<typeof Request>;

  export const RequestForm = z.object({
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
    baggage_weight: z.number().min(0, "Вес багажа не может быть отрицательным"),
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
