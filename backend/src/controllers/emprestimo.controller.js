import * as emprestimoService from "../services/emprestimo.service.js";

export async function criar(req, res) {
  try {
    const { usuarioId, exemplarId, dias } = req.body;
    const emprestimo = await emprestimoService.criar({
      usuarioId,
      exemplarId,
      dias,
    });
    res.status(201).json(emprestimo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listar(req, res) {
  try {
    const emprestimos = await emprestimoService.listar();
    res.json(emprestimos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listarMeus(req, res) {
  try {
    const emprestimos = await emprestimoService.listarPorUsuario(req.user.sub);
    res.json(emprestimos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function devolver(req, res) {
  try {
    const { id } = req.params;
    const emprestimo = await emprestimoService.devolver(id);
    res.json(emprestimo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
