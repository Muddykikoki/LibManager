import { z } from "zod";

export const reservaSchema = z.object({
  livroId: z.string().min(1),
  estado: z.enum(["NOVO", "OTIMO", "BOM", "USADO"]),
});

export const atualizarReservaSchema = reservaSchema.partial();
