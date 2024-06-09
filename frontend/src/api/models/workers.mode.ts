import { z } from "zod";

export namespace WorkersDto {
  export const Wroker = z.object({
    id: z.string(),
    name: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    gender: z.enum(["male", "female"]),
    personalPhone: z.string(),
    workPhone: z.string(),
    tabNumber: z.string(),
    birthDate: z.date(),
    position: z.string(), //todo ZDELAT` NORMALNO
    shift: z.enum(["day by day", "2/2", "1n", "2n", "5"]), //todo ZDELAT` NORMALNO
    area: z.string(), //todo ZDELAT` NORMALNO
    isLightWork: z.boolean(),
  });
  export type Worker = z.infer<typeof WorkersDto.Wroker>;
}
