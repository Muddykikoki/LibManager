import "dotenv/config";
import { prisma } from "../src/utils/prisma.js";
import { hash } from "bcryptjs";


async function main() {
  await prisma.emprestimo.deleteMany();
  await prisma.livro.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.user.deleteMany();

  console.log("Banco limpo!");

  const senhaHash = await hash("123456", 10);

  const user1 = await prisma.user.create({
    data: {
      nome: "João Silva",
      email: "joao@email.com",
      senha: senhaHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      nome: "Maria Santos",
      email: "maria@email.com",
      senha: senhaHash,
    },
  });

  console.log("Usuarios criados!");

  const catFiccao = await prisma.categoria.create({
    data: { nome: "Ficção" },
  });

  const catTecnico = await prisma.categoria.create({
    data: { nome: "Técnico" },
  });

  const catRomance = await prisma.categoria.create({
    data: { nome: "Romance" },
  });

  console.log("Categorias criadas!");

  const livro1 = await prisma.livro.create({
    data: {
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      editora: "Penguin",
      ano: 1899,
      categoriaId: catRomance.id,
    },
  });

  const livro2 = await prisma.livro.create({
    data: {
      titulo: "1984",
      autor: "George Orwell",
      editora: "Companhia das Letras",
      ano: 1949,
      categoriaId: catFiccao.id,
    },
  });

  const livro3 = await prisma.livro.create({
    data: {
      titulo: "Clean Code",
      autor: "Robert C. Martin",
      editora: "Alta Books",
      ano: 2008,
      categoriaId: catTecnico.id,
    },
  });

  console.log("Livros criados!");

  await prisma.emprestimo.create({
    data: {
      usuarioId: user1.id,
      livroId: livro1.id,
      dataPrevista: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ),
    },
  });

  await prisma.emprestimo.create({
    data: {
      usuarioId: user2.id,
      livroId: livro3.id,
      dataPrevista: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
      dataDevolucao: new Date(),
      status: "DEVOLVIDO",
    },
  });

  console.log("Emprestimos criados!");
  console.log("Seed concluido!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });