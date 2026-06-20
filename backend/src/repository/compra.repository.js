import { prisma } from "../utils/prisma.js";

export async function criar(dados) {
  return prisma.Compra.create({ data: dados });
}

export async function listar() {
  return prisma.Compra.findMany({
    include: {
      exemplar: { include: { livro: true } },
      user: { select: { id: true, nome: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listarPorUsuario(userId) {
  return prisma.Compra.findMany({
    where: { userId },
    include: {
      exemplar: { include: { livro: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
