import { PrismaClient } from "../src/generated/prisma/index.js";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Exportando dados do banco...");

  const dados = {
    usuarios: await prisma.User.findMany(),
    categorias: await prisma.Categoria.findMany(),
    livros: await prisma.Livro.findMany(),
    exemplares: await prisma.Exemplar.findMany(),
    emprestimos: await prisma.Emprestimo.findMany(),
    reservas: await prisma.Reserva.findMany(),
    compras: await prisma.Compra.findMany(),
    refreshTokens: await prisma.RefreshToken.findMany(),
  };

  const caminho = path.join(process.cwd(), "prisma", "data.json");
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));

  console.log(`Exportado para prisma/data.json`);
  console.log(`  Usuários: ${dados.usuarios.length}`);
  console.log(`  Categorias: ${dados.categorias.length}`);
  console.log(`  Livros: ${dados.livros.length}`);
  console.log(`  Exemplares: ${dados.exemplares.length}`);
  console.log(`  Empréstimos: ${dados.emprestimos.length}`);
  console.log(`  Reservas: ${dados.reservas.length}`);
  console.log(`  Compras: ${dados.compras.length}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Erro ao exportar:", e);
  process.exit(1);
});
