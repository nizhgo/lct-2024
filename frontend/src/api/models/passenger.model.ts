import { z } from "zod";
import { UsersDto } from "api/models/users.model.ts";

export namespace PassengerDto {
  //{
  //         "contact_details": "+78008008080",
  //         "name": "Тестовый юзер юзерович",
  //         "has_cardiac_pacemaker": true,
  //         "category": "string",
  //         "sex": "male",
  //         "additional_information": "some add inf",
  //         "id": 1
  //     }

  export const Passenger = z.object({
    id: z.number(),
    first_name: z.string(),
    second_name: z.string(),
    patronymic: z.string(),
    category: z.string(),
    additional_information: z.string(),
    has_cardiac_pacemaker: z.boolean(),
    contact_details: z.string(),
    sex: UsersDto.Gengers,
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
