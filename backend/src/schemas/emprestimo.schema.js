import { z } from "zod";

export const emprestimoSchema = z.object({
  usuarioId: z.string().min(1),
  exemplarId: z.string().min(1),
  dias: z.coerce.number().int().min(1).default(14),
});

export const atualizarEmprestimoSchema = emprestimoSchema.partial();
