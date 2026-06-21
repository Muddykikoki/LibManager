import { PrismaClient } from "../src/generated/prisma/index.js";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const caminho = path.join(process.cwd(), "prisma", "data.json");

  if (!fs.existsSync(caminho)) {
    console.error("Arquivo prisma/data.json não encontrado.");
    console.error("Execute primeiro: npm run db:export");
    process.exit(1);
  }

  const dados = JSON.parse(fs.readFileSync(caminho, "utf-8"));
  console.log("Limpando banco...");
  await prisma.RefreshToken.deleteMany();
  await prisma.Compra.deleteMany();
  await prisma.Reserva.deleteMany();
  await prisma.Emprestimo.deleteMany();
  await prisma.Exemplar.deleteMany();
  await prisma.Livro.deleteMany();
  await prisma.Categoria.deleteMany();
  await prisma.User.deleteMany();
  console.log(`Importando ${dados.usuarios.length} usuários...`);
  for (const u of dados.usuarios) {
    await prisma.User.create({
      data: {
        id: u.id,
        nome: u.nome,
        email: u.email,
        senha: u.senha,
        nivel_perfil: u.nivel_perfil,
        moedas: u.moedas || 0,
        createdAt: new Date(u.createdAt),
      },
    });
  }
  console.log(`Importando ${dados.categorias.length} categorias...`);
  for (const c of dados.categorias) {
    await prisma.Categoria.create({
      data: {
        id: c.id,
        nome: c.nome,
        createdAt: new Date(c.createdAt),
      },
    });
  }
  console.log("Conectando relações das categorias...");
  for (const c of dados.categorias) {
    try {
      const updates = {};

      if (c.categoriasBaseIds?.length > 0) {
        const idsExistentes = [];
        for (const id of c.categoriasBaseIds) {
          const existe = await prisma.Categoria.findUnique({ where: { id } });
          if (existe) idsExistentes.push(id);
        }
        if (idsExistentes.length > 0) {
          updates.categoriasBase = {
            connect: idsExistentes.map((id) => ({ id })),
          };
        }
      }

      if (c.subCategoriaIds?.length > 0) {
        const idsExistentes = [];
        for (const id of c.subCategoriaIds) {
          const existe = await prisma.Categoria.findUnique({ where: { id } });
          if (existe) idsExistentes.push(id);
        }
        if (idsExistentes.length > 0) {
          updates.subCategorias = {
            connect: idsExistentes.map((id) => ({ id })),
          };
        }
      }

      if (Object.keys(updates).length > 0) {
        await prisma.Categoria.update({
          where: { id: c.id },
          data: updates,
        });
      }
    } catch (e) {
      console.warn(
        `  Aviso: pulando relações da categoria "${c.nome}" — ${e.message}`,
      );
    }
  }
  console.log("Conectando categorias dos livros...");
  for (const l of dados.livros) {
    try {
      if (l.categoriaIds?.length > 0) {
        const idsExistentes = [];
        for (const id of l.categoriaIds) {
          const existe = await prisma.Categoria.findUnique({ where: { id } });
          if (existe) idsExistentes.push(id);
        }
        if (idsExistentes.length > 0) {
          await prisma.Livro.update({
            where: { id: l.id },
            data: {
              categorias: {
                connect: idsExistentes.map((id) => ({ id })),
              },
            },
          });
        }
      }
    } catch (e) {
      console.warn(
        `  Aviso: pulando categorias do livro "${l.titulo}" — ${e.message}`,
      );
    }
  }
  console.log(`Importando ${dados.exemplares.length} exemplares...`);
  for (const e of dados.exemplares) {
    await prisma.Exemplar.create({
      data: {
        id: e.id,
        livroId: e.livroId,
        estado: e.estado,
        disponivel: e.disponivel ?? true,
        vendido: e.vendido ?? false,
        createdAt: new Date(e.createdAt),
      },
    });
  }
  console.log(`Importando ${dados.emprestimos.length} empréstimos...`);
  for (const e of dados.emprestimos) {
    await prisma.Emprestimo.create({
      data: {
        id: e.id,
        usuarioId: e.usuarioId,
        exemplarId: e.exemplarId,
        dataEmprestimo: new Date(e.dataEmprestimo),
        dataPrevista: new Date(e.dataPrevista),
        dataDevolucao: e.dataDevolucao ? new Date(e.dataDevolucao) : null,
        moedasGanhas: e.moedasGanhas || 0,
        status: e.status,
      },
    });
  }
  console.log(`Importando ${dados.reservas.length} reservas...`);
  for (const r of dados.reservas) {
    await prisma.Reserva.create({
      data: {
        id: r.id,
        userId: r.userId,
        livroId: r.livroId,
        exemplarId: r.exemplarId,
        status: r.status,
        createdAt: new Date(r.createdAt),
        expiraEm: new Date(r.expiraEm),
      },
    });
  }
  console.log(`Importando ${dados.compras.length} compras...`);
  for (const c of dados.compras) {
    await prisma.Compra.create({
      data: {
        id: c.id,
        userId: c.userId,
        exemplarId: c.exemplarId,
        precoPago: c.precoPago,
        pagoMoedas: c.pagoMoedas ?? false,
        status: c.status,
        createdAt: new Date(c.createdAt),
      },
    });
  }
  console.log(
    `Importando ${dados.refreshTokens?.length || 0} refresh tokens...`,
  );
  for (const t of dados.refreshTokens || []) {
    await prisma.RefreshToken.create({
      data: {
        id: t.id,
        token: t.token,
        userId: t.userId,
        expiresAt: new Date(t.expiresAt),
        createdAt: new Date(t.createdAt),
      },
    });
  }

  console.log("Importação concluída!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Erro ao importar:", e);
  process.exit(1);
});
