import { prisma } from "../utils/prisma.js";

export async function criar(dados) {
  return prisma.Categoria.create({ data: dados });
}

export async function buscarPorId(id) {
  return prisma.Categoria.findUnique({
    where: { id },
    include: {
      categoriasBase: true,
      subCategorias: true,
    },
  });
}

export async function buscarPorNome(nome) {
  return prisma.Categoria.findUnique({ where: { nome } });
}

export async function listar() {
  return prisma.Categoria.findMany({
    include: {
      categoriasBase: { select: { id: true, nome: true } },
      subCategorias: { select: { id: true, nome: true } },
    },
  });
}

export async function atualizar(id, dados) {
  return prisma.Categoria.update({ where: { id }, data: dados });
}

export async function deletar(id) {
  return prisma.Categoria.delete({ where: { id } });
}

export async function buscarPorIds(ids) {
  return prisma.Categoria.findMany({
    where: { id: { in: ids } },
  });
}

export async function temLivros(id) {
  const livros = await prisma.Livro.findFirst({
    where: { categoriaIds: { has: id } },
  });
  return !!livros;
}
