import { z } from "zod";

export namespace UsersDto {
  export const Gengers = z.enum(["male", "female"]);

  export type Gengers = z.infer<typeof UsersDto.Gengers>;

  export const Shifts = z.enum(["day by day", "2/2", "1n", "2n", "5"]);

  export type Shifts = z.infer<typeof UsersDto.Shifts>;

  export const Roles = z.enum(["admin", "user"]); //TODO: add all roles

  export type Roles = z.infer<typeof UsersDto.Roles>;

  export const Ranks = z.enum(["a1", "a2", "a3"]); //TODO: add all ranks

  export type Ranks = z.infer<typeof UsersDto.Ranks>;

  export const Areas = z.enum([
    "ЦУ-1",
    "ЦУ-2",
    "ЦУ-3",
    "ЦУ-3 (Н)",
    "ЦУ-4",
    "ЦУ-4 (Н)",
    "ЦУ-5",
    "ЦУ-8",
  ]);

  export type Areas = z.infer<typeof UsersDto.Areas>;

  export const User = z.object({
    id: z.number(),
    first_name: z.string(),
    second_name: z.string(),
    patronymic: z.string(),
    work_phone: z.string(),
    personal_phone: z.string(),
    personnel_number: z.string(),
    role: z.string(),
    rank: z.string(),
    shift: z.string(),
    working_hours: z.string(),
    sex: z.string(),
    area: Areas,
    is_lite: z.boolean(),
  });

  export type User = z.infer<typeof UsersDto.User>;

  export const UserForm = z.object({
    first_name: z.string(),
    second_name: z.string(),
    patronymic: z.string(),
    work_phone: z.string(),
    personal_phone: z.string(),
    personnel_number: z.string(),
    role: Roles,
    rank: Ranks,
    shift: Shifts,
    working_hours: z.string(),
    sex: z.string(),
    area: Areas,
    is_lite: z.boolean(),
  });

  export type UserForm = z.infer<typeof UsersDto.UserForm>;
}
