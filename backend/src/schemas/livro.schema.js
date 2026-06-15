import { z } from "zod";

export const livroSchema = z.object({
  titulo: z.string().min(1),
  autor: z.string().min(1),
  ano: z.number().int(),
  categoriaId: z.number().int(),
});

export const atualizarLivroSchema = livroSchema.partial();