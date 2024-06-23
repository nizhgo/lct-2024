import { UsersDto } from "api/models/users.model.ts";
import { z } from "zod";
import { GapsDto } from "api/models/gaps.model.ts";
import { TicketsDto } from "api/models/tickets.model.ts";

export namespace ScheduleDto {
  export const Item = z.object({
    user: UsersDto.User,
    gaps: z.array(GapsDto.Gap),
    tickets: z.array(TicketsDto.Ticket).optional(),
  });

  export type Item = z.infer<typeof Item>;

  export const DistributionType = z.enum(["hard", "soft"]);

  export type DistributionType = z.infer<typeof DistributionType>;

  export const distributionTypes: { title: string; value: DistributionType }[] = [
    {
      title: "Распределение всех заявок",
      value: "hard",
    },
    {
      title: "Распределение нераспределенных заявок",
      value: "soft",
    },
  ];
}
