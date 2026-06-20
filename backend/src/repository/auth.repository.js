import { prisma } from "../utils/prisma.js";

export async function buscarUserPorEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
export async function salvarRefreshToken({ token, userId, expiresAt }) {
  return prisma.refreshToken.create({ data: { token, userId, expiresAt } });
}
export async function buscarRefreshToken(token) {
  return prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });
}
export async function deletarRefreshToken(token) {
  return prisma.refreshToken.delete({ where: { token } });
}
export async function deletarTodosRefreshTokensDoUser(userId) {
  return prisma.refreshToken.deleteMany({ where: { userId } });
}
