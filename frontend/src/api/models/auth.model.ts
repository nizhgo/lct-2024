import { z } from "zod";

export namespace AuthDto {
  //WORK IN PROGRESS
  export const AuthForm = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  export type AuthPayload = z.infer<typeof AuthForm>;
}
