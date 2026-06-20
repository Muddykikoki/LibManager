import { z } from "zod";

export const usuarioSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  nivel_perfil: z.enum(["LEITOR", "BIBLIOTECARIO", "DEV"]).optional(),
});

export const atualizarUsuarioSchema = usuarioSchema.partial();
