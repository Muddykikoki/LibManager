import * as compraRepository from "../repository/compra.repository.js";
import * as exemplarRepository from "../repository/exemplar.repository.js";
import * as usuarioRepository from "../repository/usuario.repository.js";

const PRECO_ESTADO = {
  NOVO: 1.2,
  OTIMO: 1.0,
  BOM: 0.85,
  USADO: 0.5,
};

export async function solicitar(userId, exemplarId) {
  const exemplar = await exemplarRepository.buscarPorId(exemplarId);
  if (!exemplar) {
    throw new Error("Exemplar não encontrado");
  }
  if (exemplar.vendido) {
    throw new Error("Exemplar já foi vendido");
  }
  if (!exemplar.disponivel) {
    throw new Error("Exemplar não está disponível");
  }

  const usuario = await usuarioRepository.buscarPorId(userId);
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  const pendente = await compraRepository.buscarPendentePorExemplar(exemplarId);
  if (pendente) {
    throw new Error(
      "Este exemplar já possui uma solicitação de compra pendente",
    );
  }

  const precoFinal = exemplar.livro.preco * PRECO_ESTADO[exemplar.estado];

  await exemplarRepository.marcarIndisponivel(exemplarId);

  return compraRepository.criar({
    userId,
    exemplarId,
    precoPago: precoFinal,
    pagoMoedas: false,
  });
}

export async function solicitarComMoedas(userId, exemplarId) {
  const exemplar = await exemplarRepository.buscarPorId(exemplarId);
  if (!exemplar) {
    throw new Error("Exemplar não encontrado");
  }
  if (exemplar.vendido) {
    throw new Error("Exemplar já foi vendido");
  }
  if (!exemplar.disponivel) {
    throw new Error("Exemplar não está disponível");
  }
  if (exemplar.estado !== "NOVO") {
    throw new Error("Só é possível comprar exemplares NOVOS com moedas");
  }

  const usuario = await usuarioRepository.buscarPorId(userId);
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  const precoEmMoedas = Math.ceil(exemplar.livro.preco * 2.5);
  if (usuario.moedas < precoEmMoedas) {
    throw new Error(
      `Moedas insuficientes. Necessário: ${precoEmMoedas}, disponível: ${usuario.moedas}`,
    );
  }

  const pendente = await compraRepository.buscarPendentePorExemplar(exemplarId);
  if (pendente) {
    throw new Error(
      "Este exemplar já possui uma solicitação de compra pendente",
    );
  }

  await exemplarRepository.marcarIndisponivel(exemplarId);

  return compraRepository.criar({
    userId,
    exemplarId,
    precoPago: precoEmMoedas,
    pagoMoedas: true,
  });
}

export async function concluir(id) {
  const compra = await compraRepository.buscarPorId(id);
  if (!compra) {
    throw new Error("Compra não encontrada");
  }
  if (compra.status !== "PENDENTE") {
    throw new Error("Compra já foi processada");
  }

  const usuario = await usuarioRepository.buscarPorId(compra.userId);

  if (compra.pagoMoedas) {
    await usuarioRepository.atualizar(compra.userId, {
      moedas: usuario.moedas - compra.precoPago,
    });
  } else {
    const moedasBonus = Math.ceil(compra.precoPago * 0.15);
    await usuarioRepository.atualizar(compra.userId, {
      moedas: (usuario.moedas || 0) + moedasBonus,
    });
  }

  await exemplarRepository.marcarVendido(compra.exemplarId);

  return compraRepository.atualizarStatus(id, { status: "CONCLUIDA" });
}

export async function cancelar(id) {
  const compra = await compraRepository.buscarPorId(id);
  if (!compra) {
    throw new Error("Compra não encontrada");
  }
  if (compra.status !== "PENDENTE") {
    throw new Error("Compra já foi processada");
  }

  await exemplarRepository.marcarDisponivel(compra.exemplarId);

  return compraRepository.atualizarStatus(id, { status: "CANCELADA" });
}

export async function listar() {
  return compraRepository.listar();
}

export async function listarPendentes() {
  return compraRepository.listarPendentes();
}

export async function listarPorUser(userId) {
  return compraRepository.listarPorUser(userId);
}
