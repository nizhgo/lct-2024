import { z } from "zod";
import { UsersDto } from "api/models/users.model.ts";
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

  export const passengerCategoryValues: PassengerCategory[] = [
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
  ];

  export const Passenger = z.object({
    id: z.number(),
    name: z.string(),
    contact_details: z.string(),
    category: PassengerCategory,
    additional_information: z.string(),
    has_cardiac_pacemaker: z.boolean(),
    sex: UsersDto.Genders,
  });

  export type Passenger = z.infer<typeof PassengerDto.Passenger>;

  export const PassengerForm = z.object({
    name: z.string().min(1, { message: "Имя обязательно" }),
    contact_details: z
      .string()
      .min(1, { message: "Контактные данные обязательны" }),
    sex: UsersDto.Genders,
    category: PassengerCategory,
    additional_information: z.string().optional(),
    has_cardiac_pacemaker: z.boolean().default(false),
  });

  export type PassengerForm = z.infer<typeof PassengerDto.PassengerForm>;
}
