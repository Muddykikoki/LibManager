import * as exemplarService from "../services/exemplar.service.js";

export async function criar(req, res) {
  try {
    const exemplar = await exemplarService.criar(req.body);
    res.status(201).json(exemplar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listarPorLivro(req, res) {
  try {
    const { livroId } = req.params;
    const exemplares = await exemplarService.listarPorLivro(livroId);
    res.json(exemplares);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listarDisponiveis(req, res) {
  try {
    const { livroId } = req.params;
    const exemplares = await exemplarService.listarDisponiveis(livroId);
    res.json(exemplares);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function atualizarEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const exemplar = await exemplarService.atualizarEstado(
      id,
      estado,
      req.user.nivel_perfil,
    );
    res.json(exemplar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
