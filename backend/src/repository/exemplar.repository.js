import { prisma } from "../utils/prisma.js";

export async function criar(dados) {
  return prisma.Exemplar.create({
    data: {
      livroId: dados.livroId,
      estado: dados.estado || "NOVO",
    },
  });
}

export async function buscarPorId(id) {
  return prisma.Exemplar.findUnique({
    where: { id },
    include: { livro: true },
  });
}

export async function listarPorLivro(livroId) {
  return prisma.Exemplar.findMany({
    where: { livroId, vendido: false },
    include: { livro: true },
  });
}

export async function listarDisponiveis(livroId) {
  return prisma.Exemplar.findMany({
    where: { livroId, disponivel: true, vendido: false },
    include: { livro: true },
  });
}

export async function atualizarEstado(id, estado) {
  return prisma.Exemplar.update({
    where: { id },
    data: { estado },
  });
}

export async function marcarIndisponivel(id) {
  return prisma.Exemplar.update({
    where: { id },
    data: { disponivel: false },
  });
}

export async function marcarDisponivel(id) {
  return prisma.Exemplar.update({
    where: { id },
    data: { disponivel: true },
  });
}

export async function marcarVendido(id) {
  return prisma.Exemplar.update({
    where: { id },
    data: { vendido: true, disponivel: false },
  });
}

export async function buscarDisponivelPorLivroEEstado(livroId, estado) {
  return prisma.Exemplar.findFirst({
    where: {
      livroId,
      estado,
      disponivel: true,
      vendido: false,
    },
  });
}
