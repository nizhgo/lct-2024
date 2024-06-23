import { z } from "zod";
import { UsersDto } from "api/models/users.model.ts";

export namespace GapsDto {
  //"отсутствие""болезнь""командировка""отпуск""конференция""отгул""обучение""отпуск по уходу за ребёнком""обед"
  export const Status = z.enum([
    "отсутствие",
    "болезнь",
    "командировка",
    "отпуск",
    "конференция",
    "отгул",
    "обучение",
    "отпуск по уходу за ребёнком",
    "обед",
  ]);

  export type Status = z.infer<typeof GapsDto.Status>;
  export const statusValues: Status[] = [
    "отсутствие",
    "болезнь",
    "командировка",
    "отпуск",
    "конференция",
    "отгул",
    "обучение",
    "отпуск по уходу за ребёнком",
    "обед",
  ];
  export const Gap = z.object({
    id: z.number(),
    user_id: z.number(),
    start_time: z.string(),
    end_time: z.string(),
    is_working: z.boolean(),
    status: Status,
    description: z.string(),
    is_deleted: z.boolean(),
    user: UsersDto.User,
  });

  export type Gap = z.infer<typeof Gap>;

  export const GapForm = z.object({
    user_id: z.number(),
    start_time: z.string().min(1, "Необходимо указать время начала"),
    end_time: z.string().min(1, "Необходимо указать время окончания"),
    is_working: z.boolean().default(false),
    status: Status,
    description: z.string().min(1, "Необходимо указать причину"),
    is_deleted: z.boolean().default(false),
  });

  export type GapForm = z.infer<typeof GapForm>;
}
