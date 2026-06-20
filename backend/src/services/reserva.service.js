import * as reservaRepository from "../repository/reserva.repository.js";
import * as livroRepository from "../repository/livro.repository.js";
import * as usuarioRepository from "../repository/usuario.repository.js";

const HORAS_RESERVA = 24;

export async function criar(userId, livroId) {
  const livro = await livroRepository.buscarPorId(livroId);
  if (!livro) {
    throw new Error("Livro não encontrado");
  }
  const usuario = await usuarioRepository.buscarPorId(userId);
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }
  const reservaAtiva = await reservaRepository.buscarAtivaPorUserELivro(
    userId,
    livroId,
  );
  if (reservaAtiva) {
    throw new Error("Você já possui uma reserva ativa para este livro");
  }
  const exemplaresDisponiveis = livro.exemplares?.filter(
    (e) => e.disponivel && !e.vendido,
  );
  if (exemplaresDisponiveis?.length > 0) {
    throw new Error(
      "Este livro possui exemplares disponíveis. Vá direto ao balcão para retirar.",
    );
  }
  const expiraEm = new Date();
  expiraEm.setHours(expiraEm.getHours() + HORAS_RESERVA);
  return reservaRepository.criar({ userId, livroId, expiraEm });
}

export async function listarAtivas() {
  return reservaRepository.listarAtivas();
}

export async function listarPorUser(userId) {
  return reservaRepository.listarPorUser(userId);
}

export async function cancelar(id, userId) {
  const reserva = await reservaRepository.buscarPorId(id);
  if (!reserva) {
    throw new Error("Reserva não encontrada");
  }
  if (reserva.userId !== userId) {
    throw new Error("Você só pode cancelar suas próprias reservas");
  }
  if (reserva.status !== "ATIVA") {
    throw new Error("Reserva não está ativa");
  }
  return reservaRepository.atualizarStatus(id, "CANCELADA");
}

export async function concluir(id) {
  const reserva = await reservaRepository.buscarPorId(id);
  if (!reserva) {
    throw new Error("Reserva não encontrada");
  }
  if (reserva.status !== "ATIVA") {
    throw new Error("Reserva não está ativa");
  }
  return reservaRepository.atualizarStatus(id, "CONCLUIDA");
}
