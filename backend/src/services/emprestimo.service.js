import * as emprestimoRepository from "../repository/emprestimo.repository.js";
import * as exemplarRepository from "../repository/exemplar.repository.js";
import * as usuarioRepository from "../repository/usuario.repository.js";

const DIAS_MINIMO_MOEDAS = 7;

export async function criar(dados) {
  const exemplar = await exemplarRepository.buscarPorId(dados.exemplarId);
  if (!exemplar) {
    throw new Error("Exemplar não encontrado");
  }
  if (exemplar.vendido) {
    throw new Error("Exemplar já foi vendido");
  }
  if (!exemplar.disponivel) {
    throw new Error("Exemplar já está emprestado");
  }

  const usuario = await usuarioRepository.buscarPorId(dados.usuarioId);
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  const emprestimoAtivo = await emprestimoRepository.buscarAtivoPorExemplar(
    dados.exemplarId,
  );
  if (emprestimoAtivo) {
    throw new Error("Exemplar já possui empréstimo ativo");
  }

  const dataPrevista = new Date();
  dataPrevista.setDate(dataPrevista.getDate() + (dados.dias || 14));

  await exemplarRepository.marcarIndisponivel(dados.exemplarId);

  return emprestimoRepository.criar({
    usuarioId: dados.usuarioId,
    exemplarId: dados.exemplarId,
    dataPrevista,
  });
}

export async function listar() {
  return emprestimoRepository.listar();
}

export async function listarPorUsuario(usuarioId) {
  return emprestimoRepository.listarPorUsuario(usuarioId);
}

export async function devolver(id, estadoExemplar, perfil) {
  const emprestimo = await emprestimoRepository.buscarPorId(id);
  if (!emprestimo) {
    throw new Error("Empréstimo não encontrado");
  }
  if (emprestimo.status !== "EMPRESTADO") {
    throw new Error("Empréstimo já foi finalizado");
  }

  const agora = new Date();
  const atrasado = agora > emprestimo.dataPrevista;
  const diasEmprestado = Math.ceil(
    (agora - emprestimo.dataEmprestimo) / (1000 * 60 * 60 * 24),
  );
  const tempoMinimo = diasEmprestado >= DIAS_MINIMO_MOEDAS;

  let moedasGanhas = 0;
  if (!atrasado && tempoMinimo) {
    const precoBase = emprestimo.exemplar.livro.preco;
    moedasGanhas = Math.ceil(precoBase * 0.1);

    const usuario = await usuarioRepository.buscarPorId(emprestimo.usuarioId);
    await usuarioRepository.atualizar(emprestimo.usuarioId, {
      moedas: (usuario.moedas || 0) + moedasGanhas,
    });
  }

  await exemplarRepository.marcarDisponivel(emprestimo.exemplarId);

  if (estadoExemplar) {
    if (perfil === "BIBLIOTECARIO") {
      const hierarquia = { NOVO: 4, OTIMO: 3, BOM: 2, USADO: 1 };
      const estadoAtual = emprestimo.exemplar.estado;
      if (hierarquia[estadoExemplar] > hierarquia[estadoAtual]) {
        throw new Error(
          "Bibliotecários não podem melhorar o estado do exemplar",
        );
      }
    }
    await exemplarRepository.atualizarEstado(
      emprestimo.exemplarId,
      estadoExemplar,
    );
  }

  return emprestimoRepository.devolver(id, {
    dataDevolucao: agora,
    moedasGanhas,
    status: atrasado ? "ATRASADO" : "DEVOLVIDO",
  });
}
