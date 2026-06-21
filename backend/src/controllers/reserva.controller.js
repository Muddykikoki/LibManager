import * as reservaService from "../services/reserva.service.js";

export async function criar(req, res) {
  try {
    const { livroId, estado } = req.body;
    const reserva = await reservaService.criar(req.user.sub, livroId, estado);
    res.status(201).json(reserva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listarAtivas(req, res) {
  try {
    const reservas = await reservaService.listarAtivas();
    res.json(reservas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listarMinhas(req, res) {
  try {
    const reservas = await reservaService.listarPorUser(req.user.sub);
    res.json(reservas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function cancelar(req, res) {
  try {
    const { id } = req.params;
    const reserva = await reservaService.cancelar(id, req.user.sub);
    res.json(reserva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function concluir(req, res) {
  try {
    const { id } = req.params;
    const { dias } = req.body;
    const reserva = await reservaService.concluir(id, dias || 14);
    res.json(reserva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
