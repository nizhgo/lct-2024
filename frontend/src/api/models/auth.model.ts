import { z } from "zod";

export namespace AuthDto {
  //WORK IN PROGRESS
  export const AuthPayload = z.object({
    email: z.string(),
    password: z.string(),
  });

  export type AuthPayload = z.infer<typeof AuthPayload>;
}
