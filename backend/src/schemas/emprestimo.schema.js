import { z } from "zod";

export const emprestimoSchema = z.object({
  usuarioId: z.number().int(),
  livroId: z.number().int(),
  dataDevolucao: z.string().datetime(),
});

export const atualizarEmprestimoSchema = emprestimoSchema.partial();
