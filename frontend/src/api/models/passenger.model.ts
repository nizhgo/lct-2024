import { z } from "zod";
export namespace PassengerDto {
  export const PassengerCategory = z.enum([
    "ИЗТ",
    "ИЗ",
    "ИС",
    "ИК",
    "ИО",
    "ДИ",
    "ПЛ",
    "РД",
    "РДК",
    "ОГД",
    "ОВ",
    "ИУ",
  ]);

  export type PassengerCategory = z.infer<
    typeof PassengerDto.PassengerCategory
  >;

  export const Passenger = z.object({
    id: z.number(),
    name: z.string(),
    contact_details: z.string(),
    category: PassengerCategory,
    additional_information: z.string(),
    has_cardiac_pacemaker: z.boolean(),
    sex: z.string(),
  });

  export type Passenger = z.infer<typeof PassengerDto.Passenger>;

  export const PassengerForm = z.object({
    first_name: z.string(),
    second_name: z.string(),
    patronymic: z.string(),
    category: z.enum(["CAT1", "CAT2", "CAT3"]),
    description: z.string(),
    phone: z.string(),
  });

  export type PassengerForm = z.infer<typeof PassengerDto.PassengerForm>;
}
