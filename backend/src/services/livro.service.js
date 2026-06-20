import * as livroRepository from "../repository/livro.repository.js";
import * as categoriaRepository from "../repository/categoria.repository.js";

export async function cadastrar(dados) {
  const categorias = await categoriaRepository.buscarPorIds(dados.categoriaIds);
  if (categorias.length !== dados.categoriaIds.length) {
    throw new Error("Uma ou mais categorias não foram encontradas");
  }
  let todosCategoriaIds = [...dados.categoriaIds];
  for (const categoria of categorias) {
    if (categoria.categoriasBaseIds?.length > 0) {
      for (const baseId of categoria.categoriasBaseIds) {
        if (!todosCategoriaIds.includes(baseId)) {
          todosCategoriaIds.push(baseId);
        }
      }
    }
  }
  return livroRepository.criar({ ...dados, categoriaIds: todosCategoriaIds });
}

export async function listar() {
  return livroRepository.listar();
}

export async function buscarPorId(id) {
  const livro = await livroRepository.buscarPorId(id);
  if (!livro) {
    throw new Error("Livro não encontrado");
  }
  return livro;
}

export async function encontrar(termo) {
  if (!termo || termo.trim() === "") {
    throw new Error("Termo de busca é obrigatório");
  }
  return livroRepository.encontrar(termo);
}

export async function atualizar(id, dados) {
  const livro = await livroRepository.buscarPorId(id);
  if (!livro) {
    throw new Error("Livro não encontrado");
  }

  if (dados.categoriaIds) {
    const categorias = await categoriaRepository.buscarPorIds(
      dados.categoriaIds,
    );
    if (categorias.length !== dados.categoriaIds.length) {
      throw new Error("Uma ou mais categorias não foram encontradas");
    }
    let todosCategoriaIds = [...dados.categoriaIds];
    for (const categoria of categorias) {
      if (categoria.categoriasBaseIds?.length > 0) {
        for (const baseId of categoria.categoriasBaseIds) {
          if (!todosCategoriaIds.includes(baseId)) {
            todosCategoriaIds.push(baseId);
          }
        }
      }
    }
    dados.categoriaIds = todosCategoriaIds;
  }
  return livroRepository.atualizar(id, dados);
}

export async function deletar(id) {
  const livro = await livroRepository.buscarPorId(id);
  if (!livro) {
    throw new Error("Livro não encontrado");
  }
  const temEmprestimo = await livroRepository.temEmprestimoAtivo(id);
  if (temEmprestimo) {
    throw new Error("Livro não pode ser deletado: há empréstimo em andamento");
  }
  return livroRepository.deletar(id);
}
