import { prisma } from "../utils/prisma.js";

export async function criar(dados) {
  return prisma.Reserva.create({
    data: {
      userId: dados.userId,
      livroId: dados.livroId,
      expiraEm: dados.expiraEm,
    },
  });
}

export async function buscarPorId(id) {
  return prisma.Reserva.findUnique({
    where: { id },
    include: {
      livro: { include: { categorias: { select: { id: true, nome: true } } } },
      user: { select: { id: true, nome: true, email: true } },
    },
  });
}

export async function buscarAtivaPorUserELivro(userId, livroId) {
  return prisma.Reserva.findFirst({
    where: { userId, livroId, status: "ATIVA" },
  });
}

export async function listarAtivas() {
  await expirarReservas();
  return prisma.Reserva.findMany({
    where: { status: "ATIVA" },
    include: {
      livro: true,
      user: { select: { id: true, nome: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listarPorUser(userId) {
  return prisma.Reserva.findMany({
    where: { userId },
    include: {
      livro: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function atualizarStatus(id, status) {
  return prisma.Reserva.update({
    where: { id },
    data: { status },
  });
}

export async function expirarReservas() {
  const agora = new Date();
  await prisma.Reserva.updateMany({
    where: {
      status: "ATIVA",
      expiraEm: { lt: agora },
    },
    data: { status: "EXPIRADA" },
  });
}
