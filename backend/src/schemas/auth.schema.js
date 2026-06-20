import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve possuir no mínimo 6 caracteres"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token obrigatório"),
});
