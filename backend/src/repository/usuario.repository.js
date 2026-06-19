import { prisma } from "../utils/prisma.js";

export async function criar(dados) {
  console.log("Criando usuário com dados:", dados);
  return prisma.User.create({ data: dados });
}

export async function buscarPorId(id) {
  return prisma.User.findUnique({ where: { id: id } });
}

export async function buscarPorEmail(email) {
  return prisma.User.findUnique({ where: { email } });
}

export async function atualizar(id, dados) {
  return prisma.User.update({ where: { id: id }, data: dados });
}

export async function deletar(id) {
  return prisma.User.delete({ where: { id: id } });
}

export async function temEmprestimosAtivos(id) {
  const emprestimosAtivos = await prisma.Emprestimo.findFirst({
    where: {
      userId: id,
      status: "EMPRESTADO",
    },
  });
  return !!emprestimosAtivos;
}

export async function buscarEmprestimos(id) {
  return prisma.Emprestimo.findMany({
    where: { usuarioId: id },
    include: {
      livro: {
        select: {
          id: true,
          titulo: true,
          autor: true,
          editora: true,
          ano: true,
          disponivel: true,
        },
      },
    },
  });
}

export async function listar() {
  const usuarios = await prisma.User.findMany();
  console.log("Usuarios encontrado: ", usuarios);
  return usuarios;
}
