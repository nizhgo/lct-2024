import { z } from "zod";

export namespace StationsDto {
  export const Line = z.enum([
    "1",
    "2",
    "3",
    "4",
    "4А",
    "5",
    "6",
    "7",
    "8",
    "8А",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "БКЛ",
    "БКЛ(А)",
    "Д1",
    "Д2",
    "Д3",
    "Д4",
    "МЦК",
    "Л1",
  ]);

  export type Line = z.infer<typeof Line>;

  export const Station = z.object({
    id_line: z.number(),
    name_station: z.string(),
    name_line: Line,
    id: z.number(),
  });

  export type Station = z.infer<typeof Station>;
}
