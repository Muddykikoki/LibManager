import { z } from "zod";

export const compraSchema = z.object({
  exemplarId: z.string().min(1),
  pagoMoedas: z.boolean().default(false),
});
