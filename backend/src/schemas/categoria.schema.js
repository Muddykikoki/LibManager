import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z.string().min(1),
  categoriasBaseIds: z.array(z.string()).optional(),
});

export const subCategoriaSchema = z.object({
  id: z.string().min(1),
  categoriasBaseIds: z.array(z.string()).min(1),
});

export const atualizarCategoriaSchema = categoriaSchema.partial();

export const atualizarSubCategoriaSchema = categoriaSchema.partial();
