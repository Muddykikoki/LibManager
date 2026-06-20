import { z } from "zod";

export const exemplarSchema = z.object({
  livroId: z.string().min(1),
  estado: z.enum(["NOVO", "OTIMO", "BOM", "USADO"]).default("NOVO"),
});

export const atualizarEstadoSchema = z.object({
  estado: z.enum(["NOVO", "OTIMO", "BOM", "USADO"]),
});
