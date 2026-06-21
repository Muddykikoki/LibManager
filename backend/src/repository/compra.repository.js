import { prisma } from "../utils/prisma.js";

export async function criar(dados) {
  return prisma.Compra.create({ data: dados });
}

export async function buscarPorId(id) {
  return prisma.Compra.findUnique({
    where: { id },
    include: {
      exemplar: { include: { livro: true } },
      user: { select: { id: true, nome: true, email: true } },
    },
  });
}

export async function buscarPendentePorExemplar(exemplarId) {
  return prisma.Compra.findFirst({
    where: { exemplarId, status: "PENDENTE" },
  });
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

export async function listarPendentes() {
  return prisma.Compra.findMany({
    where: { status: "PENDENTE" },
    include: {
      exemplar: { include: { livro: true } },
      user: { select: { id: true, nome: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function listarPorUser(userId) {
  return prisma.Compra.findMany({
    where: { userId },
    include: {
      exemplar: { include: { livro: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function atualizarStatus(id, dados) {
  return prisma.Compra.update({
    where: { id },
    data: dados,
  });
}
