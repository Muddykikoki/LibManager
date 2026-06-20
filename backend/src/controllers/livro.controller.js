import * as livroService from "../services/livro.service.js";

export async function cadastrar(req, res) {
  try {
    const livro = await livroService.cadastrar(req.body);
    res.status(201).json(livro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listar(req, res) {
  try {
    const livros = await livroService.listar();
    res.json(livros);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function encontrar(req, res) {
  try {
    const { q } = req.query;
    const livros = await livroService.encontrar(q);
    res.json(livros);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function editar(req, res) {
  try {
    const { id } = req.params;
    const livro = await livroService.atualizar(id, req.body);
    res.json(livro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deletar(req, res) {
  try {
    const { id } = req.params;
    await livroService.deletar(id);
    res.json({ message: "Livro deletafo com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
