import { z } from "zod";

export namespace AuthDto {
  export const AuthForm = z.object({
    personal_phone: z.string(),
    password: z.string(),
  });

  export type AuthForm = z.infer<typeof AuthForm>;

  export const AuthUser = z.object({
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
  });

  export type AuthUser = z.infer<typeof AuthUser>;

  export const AuthResponse = z.object({
    access_token: z.string(),
    user_id: z.number(),
    user: AuthUser.required(),
  });

  export type AuthResponse = z.infer<typeof AuthResponse>;
}
