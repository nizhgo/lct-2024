import { z } from "zod";
import { UsersDto } from "api/models/users.model.ts";

export namespace GapsDto {
  export const Gap = z.object({
    id: z.number(),
    user_id: z.number(),
    start_time: z.string(),
    end_time: z.string(),
    is_working: z.boolean(),
    status: z.string(),
    description: z.string(),
    is_deleted: z.boolean(),
    user: UsersDto.User,
  });

  export type Gap = z.infer<typeof Gap>;
}
