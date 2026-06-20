import * as exemplarRepository from "../repository/exemplar.repository.js";
import * as livroRepository from "../repository/livro.repository.js";

const DOWNGRADE = { NOVO: "OTIMO", OTIMO: "BOM", BOM: "USADO", USADO: null };

export async function criar(dados) {
  const livro = await livroRepository.buscarPorId(dados.livroId);
  if (!livro) {
    throw new Error("Livro não encontrado");
  }
  return exemplarRepository.criar(dados);
}

export async function listarPorLivro(livroId) {
  return exemplarRepository.listarPorLivro(livroId);
}

export async function listarDisponiveis(livroId) {
  return exemplarRepository.listarDisponiveis(livroId);
}

export async function atualizarEstado(id, novoEstado, perfil) {
  const exemplar = await exemplarRepository.buscarPorId(id);
  if (!exemplar) {
    throw new Error("Exemplar não encontrado");
  }

  if (exemplar.vendido) {
    throw new Error("Exemplar já foi vendido");
  }

  if (perfil === "DEV") {
    return exemplarRepository.atualizarEstado(id, novoEstado);
  }

  const permitido = DOWNGRADE[exemplar.estado];
  if (novoEstado !== permitido) {
    throw new Error(
      `BIBLIOTECARIO só pode mudar de ${exemplar.estado} para ${permitido}. Para subir o estado, peça ao DEV.`,
    );
  }

  return exemplarRepository.atualizarEstado(id, novoEstado);
}
