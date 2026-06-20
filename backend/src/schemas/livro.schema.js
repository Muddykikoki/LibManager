import { z } from "zod";

export const livroSchema = z.object({
  titulo: z.string().min(1),
  autor: z.string().min(1),
  editora: z.string().optional(),
  descricao: z.string().optional(),
  preco: z.coerce.number().min(0, "Preço deve ser positivo"),
  ano: z.coerce
    .number()
    .int()
    .min(1, "Ano inválido")
    .max(new Date().getFullYear(), "Livros do futuro não são aceitos"),
  categoriaIds: z.array(z.string()).optional(),
});

export const atualizarLivroSchema = livroSchema.partial();
