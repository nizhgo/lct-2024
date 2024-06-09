import { z } from "zod";

export namespace PassengerDto {
  export const Passenger = z.object({
    id: z.number(),
    full_name: z.string(),
    category: z.enum(["CAT1", "CAT2", "CAT3"]),
    description: z.string(),
    phone: z.string(),
  });

  export type Passenger = z.infer<typeof PassengerDto.Passenger>;

  export const PassengerForm = z.object({
    full_name: z.string(),
    category: z.enum(["CAT1", "CAT2", "CAT3"]),
    description: z.string(),
    phone: z.string(),
  });

  export type PassengerForm = z.infer<typeof PassengerDto.PassengerForm>;
}
