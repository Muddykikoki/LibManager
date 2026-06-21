import * as compraService from "../services/compra.service.js";

export async function solicitar(req, res) {
  try {
    const { exemplarId } = req.body;
    const compra = await compraService.solicitar(req.user.sub, exemplarId);
    res.status(201).json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function solicitarComMoedas(req, res) {
  try {
    const { exemplarId } = req.body;
    const compra = await compraService.solicitarComMoedas(
      req.user.sub,
      exemplarId,
    );
    res.status(201).json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function concluir(req, res) {
  try {
    const { id } = req.params;
    const compra = await compraService.concluir(id);
    res.json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function cancelar(req, res) {
  try {
    const { id } = req.params;
    const compra = await compraService.cancelar(id);
    res.json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listar(req, res) {
  try {
    const compras = await compraService.listar();
    res.json(compras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listarPendentes(req, res) {
  try {
    const compras = await compraService.listarPendentes();
    res.json(compras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listarMinhas(req, res) {
  try {
    const compras = await compraService.listarPorUser(req.user.sub);
    res.json(compras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
