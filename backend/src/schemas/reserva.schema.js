import { z } from "zod";

export const reservaSchema = z.object({
  livroId: z.string().min(1),
});
