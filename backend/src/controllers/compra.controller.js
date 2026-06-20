import * as compraService from "../services/compra.service.js";

export async function comprar(req, res) {
  try {
    const compra = await compraService.comprar(req.user.sub, req.body);
    res.status(201).json(compra);
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

export async function listarMinhas(req, res) {
  try {
    const compras = await compraService.listarPorUsuario(req.user.sub);
    res.json(compras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
