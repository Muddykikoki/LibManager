import { prisma } from "../utils/prisma.js";

export async function criar(dados) {
  return prisma.Livro.create({
    data: {
      titulo: dados.titulo,
      autor: dados.autor,
      editora: dados.editora,
      ano: dados.ano,
      descricao: dados.descricao,
      preco: dados.preco,
      categoriaIds: dados.categoriaIds,
    },
  });
}

export async function buscarPorId(id) {
  return prisma.Livro.findUnique({
    where: { id },
    include: {
      categorias: { select: { id: true, nome: true } },
      exemplares: { where: { vendido: false } },
    },
  });
}

export async function listar() {
  return prisma.Livro.findMany({
    include: {
      categorias: { select: { id: true, nome: true } },
    },
  });
}

export async function encontrar(termo) {
  const include = {
    categorias: { select: { id: true, nome: true } },
  };
  const palavras = termo
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0);
  const categoriasMatch = await prisma.Categoria.findMany({
    where: { nome: { contains: termo, mode: "insensitive" } },
    select: { id: true, nome: true },
  });
  const categoriaIds = categoriasMatch.map((c) => c.id);
  const pontuacao = new Map();

  function adicionar(livro, pontos) {
    const existente = pontuacao.get(livro.id);
    if (existente) {
      existente.pontos += pontos;
    } else {
      pontuacao.set(livro.id, { livro, pontos });
    }
  }

  for (const palavra of palavras) {
    const porTitulo = await prisma.Livro.findMany({
      where: { titulo: { contains: palavra, mode: "insensitive" } },
      include,
    });
    porTitulo.forEach((l) => {
      const bonus = l.titulo.startsWith(palavra)
        ? 2
        : l.titulo.toLowerCase().startsWith(palavra.toLowerCase())
          ? 1
          : 0;
      adicionar(l, 100 + bonus);
    });
    if (categoriaIds.length > 0) {
      const porCategoria = await prisma.Livro.findMany({
        where: { categoriaIds: { hasSome: categoriaIds } },
        include,
      });
      porCategoria.forEach((l) => adicionar(l, 80));
    }

    const porAutor = await prisma.Livro.findMany({
      where: { autor: { contains: palavra, mode: "insensitive" } },
      include,
    });
    porAutor.forEach((l) => {
      const bonus = l.autor.toLowerCase() === palavra.toLowerCase() ? 1 : 0;
      adicionar(l, 60 + bonus);
    });

    const porEditora = await prisma.Livro.findMany({
      where: { editora: { contains: palavra, mode: "insensitive" } },
      include,
    });
    porEditora.forEach((l) => adicionar(l, 40));

    const porDescricao = await prisma.Livro.findMany({
      where: { descricao: { contains: palavra, mode: "insensitive" } },
      include,
    });
    porDescricao.forEach((l) => adicionar(l, 20));
    const anoNumerico = parseInt(palavra);
    if (!isNaN(anoNumerico)) {
      const porAno = await prisma.Livro.findMany({
        where: { ano: anoNumerico },
        include,
      });
      porAno.forEach((l) => adicionar(l, 30));
    }
  }
  const resultados = [...pontuacao.values()]
    .sort((a, b) => b.pontos - a.pontos)
    .map((item) => item.livro);
  return resultados;
}

export async function atualizar(id, dados) {
  return prisma.Livro.update({
    where: { id },
    data: dados,
  });
}

export async function deletar(id) {
  return prisma.Livro.delete({ where: { id } });
}

export async function temEmprestimoAtivo(id) {
  const emprestimo = await prisma.Emprestimo.findFirst({
    where: { livroId: id, status: "EMPRESTADO" },
  });
  return !!emprestimo;
}
