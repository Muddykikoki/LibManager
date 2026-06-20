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
    criarDados.categoriasBaseIds = dados.categoriasBaseIds;
    criarDados.categoriasBase = {
      connect: dados.categoriasBaseIds.map((id) => ({ id })),
    };
    for (const base of bases) {
      await categoriaRepository.atualizar(base.id, {
        subCategoriaIds: [...(base.subCategoriaIds || [])],
      });
    }
  }

  return categoriaRepository.criar(criarDados);
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
