import * as categoriaService from "../services/categoria.service.js";

export async function cadastrar(req, res) {
  try {
    const { nome } = req.body;
    const categoria = await categoriaService.cadastrar({
      nome,
    });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function criarSubcategoria(req, res) {
  try {
    const { id, categoriasBaseIds } = req.body;
    const categoria = await categoriaService.vincularSubcategorias(id, categoriasBaseIds);
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function listar(req, res) {
  try {
    const categorias = await categoriaService.listar();
    res.json(categorias);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function editar(req, res) {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    const categoria = await categoriaService.atualizar(id, { nome });
    res.json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deletar(req, res) {
  try {
    const { id } = req.params;
    await categoriaService.deletar(id);
    res.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
