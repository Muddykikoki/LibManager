import { prisma } from "../utils/prisma.js";

export async function criar(dados) {
  return prisma.Emprestimo.create({
    data: {
      usuarioId: dados.usuarioId,
      exemplarId: dados.exemplarId,
      dataPrevista: dados.dataPrevista,
    },
  });
}

export async function buscarPorId(id) {
  return prisma.Emprestimo.findUnique({
    where: { id },
    include: {
      exemplar: { include: { livro: true } },
      usuario: { select: { id: true, nome: true, email: true } },
    },
  });
}

export async function listar() {
  return prisma.Emprestimo.findMany({
    include: {
      exemplar: { include: { livro: true } },
      usuario: { select: { id: true, nome: true, email: true } },
    },
    orderBy: { dataEmprestimo: "desc" },
  });
}

export async function listarPorUsuario(usuarioId) {
  return prisma.Emprestimo.findMany({
    where: { usuarioId },
    include: {
      exemplar: { include: { livro: true } },
    },
    orderBy: { dataEmprestimo: "desc" },
  });
}

export async function buscarAtivoPorExemplar(exemplarId) {
  return prisma.Emprestimo.findFirst({
    where: { exemplarId, status: "EMPRESTADO" },
  });
}

export async function devolver(id, dados) {
  return prisma.Emprestimo.update({
    where: { id },
    data: dados,
  });
}
