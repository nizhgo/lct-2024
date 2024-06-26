import { z } from "zod";
import { UsersDto } from "api/models/users.model.ts";

export namespace AuthDto {
  export const AuthForm = z.object({
    personal_phone: z.string().min(1, "Это поле не может быть пустым"),
    password: z.string().min(1, "Это поле не может быть пустым"),
  });

  export type AuthForm = z.infer<typeof AuthForm>;

  export const AuthUser = z.object({
    first_name: z.string(),
    second_name: z.string(),
    patronymic: z.string(),
    work_phone: z.string(),
    personal_phone: z.string(),
    personnel_number: z.string(),
    role: UsersDto.Roles,
    rank: UsersDto.Ranks,
    shift: UsersDto.Shifts,
    working_hours: z.string(),
  });

  export type AuthUser = z.infer<typeof AuthUser>;

  export const AuthResponse = z.object({
    access_token: z.string(),
    user_id: z.number(),
    user: AuthUser.required(),
  });

  export type AuthResponse = z.infer<typeof AuthResponse>;
}
