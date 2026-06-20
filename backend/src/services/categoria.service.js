import * as categoriaRepository from "../repository/categoria.repository.js";

export async function cadastrar(dados) {
  const existente = await categoriaRepository.buscarPorNome(dados.nome);
  if (existente) {
    throw new Error("Categoria já existe");
  }

  return categoriaRepository.criar({ nome: dados.nome });
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
    categoriasBase: { connect: categoriasBaseIds.map((baseId) => ({ id: baseId })) },
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
  return categoriaRepository.listar();
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

  return categoriaRepository.atualizar(id, dados);
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
