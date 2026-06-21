import { z } from "zod";

export const compraSchema = z.object({
  exemplarId: z.string().min(1),
});
