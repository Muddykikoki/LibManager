import * as userService from "../services/usuario.service.js";

export async function criarUsuario(req, res) {
  try {
    console.log("ENTROU NO CONTROLLER");
    const { nome, email, senha, nivel_perfil } = req.body;
    const usuario = await userService.criarUsuario({ nome, email, senha, nivel_perfil });
    console.log("Usuário criado:", usuario);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, senha, nivel_perfil } = req.body;
    const usuarioAtualizado = await userService.atualizarUsuario(id, { nome, email, senha, nivel_perfil });
    console.log("Usuário atualizado:", usuarioAtualizado);
    res.json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function buscarEmprestimos(req, res) {
  try {
    const { id } = req.params;
    const emprestimos = await userService.buscarEmprestimos(id);
    res.json(emprestimos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}