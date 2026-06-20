import * as compraRepository from "../repository/compra.repository.js";
import * as exemplarRepository from "../repository/exemplar.repository.js";
import * as usuarioRepository from "../repository/usuario.repository.js";

const PRECO_ESTADO = {
  NOVO: 1.2,
  OTIMO: 1.0,
  BOM: 0.85,
  USADO: 0.5,
};

export async function comprar(userId, dados) {
  const exemplar = await exemplarRepository.buscarPorId(dados.exemplarId);
  if (!exemplar) {
    throw new Error("Exemplar não encontrado");
  }
  if (exemplar.vendido) {
    throw new Error("Exemplar já foi vendido");
  }
  if (!exemplar.disponivel) {
    throw new Error("Exemplar está emprestado no momento");
  }

  const usuario = await usuarioRepository.buscarPorId(userId);
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  const precoBase = exemplar.livro.preco;

  if (dados.pagoMoedas) {
    const precoEmMoedas = Math.ceil(precoBase * 2.5);

    if (exemplar.estado !== "NOVO") {
      throw new Error("Só é possível comprar exemplares NOVOS com moedas");
    }

    if (usuario.moedas < precoEmMoedas) {
      throw new Error(
        `Moedas insuficientes. Necessário: ${precoEmMoedas}, disponível: ${usuario.moedas}`,
      );
    }

    await usuarioRepository.atualizar(userId, {
      moedas: usuario.moedas - precoEmMoedas,
    });

    await exemplarRepository.marcarVendido(dados.exemplarId);

    return compraRepository.criar({
      userId,
      exemplarId: dados.exemplarId,
      precoPago: precoEmMoedas,
      pagoMoedas: true,
    });
  }

  const precoFinal = precoBase * PRECO_ESTADO[exemplar.estado];
  const moedasBonus = Math.ceil(precoFinal * 0.15);

  await usuarioRepository.atualizar(userId, {
    moedas: (usuario.moedas || 0) + moedasBonus,
  });

  await exemplarRepository.marcarVendido(dados.exemplarId);

  return compraRepository.criar({
    userId,
    exemplarId: dados.exemplarId,
    precoPago: precoFinal,
    pagoMoedas: false,
  });
}

export async function listar() {
  return compraRepository.listar();
}

export async function listarPorUsuario(userId) {
  return compraRepository.listarPorUsuario(userId);
}
