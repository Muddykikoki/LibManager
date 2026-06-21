import * as categoriaRepository from "../repository/categoria.repository.js";

export async function cadastrar(dados) {
  const existente = await categoriaRepository.buscarPorNome(dados.nome);
  if (existente) {
    throw new Error("Categoria já existe");
  }

  const criarDados = { nome: dados.nome };

  if (dados.categoriasBaseIds?.length > 0) {
    const bases = await categoriaRepository.buscarPorIds(
      dados.categoriasBaseIds,
    );
    if (bases.length !== dados.categoriasBaseIds.length) {
      throw new Error("Uma ou mais categorias base não foram encontradas");
    }
    criarDados.categoriasBase = {
      connect: dados.categoriasBaseIds.map((id) => ({ id })),
    };
  }

  return categoriaRepository.criar(criarDados);
}

export async function vincularSubcategorias(id, categoriasBaseIds) {
  const categoria = await categoriaRepository.buscarPorId(id);
  if (!categoria) {
    throw new Error("Categoria não encontrada");
  }

  const bases = await categoriaRepository.buscarPorIds(categoriasBaseIds);
  if (bases.length !== categoriasBaseIds.length) {
    throw new Error("Uma ou mais categorias base não foram encontradas");
  }

  return categoriaRepository.atualizar(id, {
    categoriasBase: {
      connect: categoriasBaseIds.map((baseId) => ({ id: baseId })),
    },
  });
}

export async function criarSubcategoria(id, subCategoriaIds) {
  const categoria = await categoriaRepository.buscarPorId(id);
  if (!categoria) {
    throw new Error("Categoria não encontrada");
  }

  const subCategorias = await categoriaRepository.buscarPorIds(subCategoriaIds);
  if (subCategorias.length !== subCategoriaIds.length) {
    throw new Error("Uma ou mais subcategorias não foram encontradas");
  }

  return categoriaRepository.atualizar(id, {
    subCategoriaIds,
    subCategorias: { connect: subCategoriaIds.map((subId) => ({ id: subId })) },
  });
}

export async function listar() {
  const categorias = await categoriaRepository.listar();

  const bases = categorias
    .filter((c) => !c.categoriasBase || c.categoriasBase.length === 0)
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const compostas = categorias
    .filter((c) => c.categoriasBase && c.categoriasBase.length > 0)
    .sort((a, b) => a.nome.localeCompare(b.nome));

  return [...bases, ...compostas];
}

export async function atualizar(id, dados) {
  const categoria = await categoriaRepository.buscarPorId(id);
  if (!categoria) {
    throw new Error("Categoria não encontrada");
  }

  if (dados.nome && dados.nome !== categoria.nome) {
    const existente = await categoriaRepository.buscarPorNome(dados.nome);
    if (existente) {
      throw new Error("Já existe uma categoria com esse nome");
    }
  }

  const atualizarDados = {};
  if (dados.nome) {
    atualizarDados.nome = dados.nome;
  }

  if (dados.categoriasBaseIds !== undefined) {
    if (dados.categoriasBaseIds.length > 0) {
      const bases = await categoriaRepository.buscarPorIds(
        dados.categoriasBaseIds,
      );
      if (bases.length !== dados.categoriasBaseIds.length) {
        throw new Error("Uma ou mais categorias base não foram encontradas");
      }
      atualizarDados.categoriasBase = {
        set: dados.categoriasBaseIds.map((id) => ({ id })),
      };
    } else {
      atualizarDados.categoriasBase = { set: [] };
    }
  }

  return categoriaRepository.atualizar(id, atualizarDados);
}

export async function deletar(id) {
  const categoria = await categoriaRepository.buscarPorId(id);
  if (!categoria) {
    throw new Error("Categoria não encontrada");
  }

  const temLivros = await categoriaRepository.temLivros(id);
  if (temLivros) {
    throw new Error("Categoria não pode ser deletada: há livros vinculados");
  }

  return categoriaRepository.deletar(id);
}
