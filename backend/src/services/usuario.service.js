import bcrypt from "bcryptjs";
import * as usuarioRepository from "../repository/usuario.repository.js";

export async function criarUsuario(dados, perfilRequisitante) {
  if (
    perfilRequisitante === "BIBLIOTECARIO" &&
    dados.nivel_perfil !== "LEITOR"
  ) {
    throw new Error("Bibliotecários só podem criar usuários do tipo LEITOR");
  }
  const existente = await usuarioRepository.buscarPorEmail(dados.email);
  if (existente) {
    throw new Error("Email já cadastrado");
  }
  const senhaHash = await bcrypt.hash(dados.senha, 10);
  return usuarioRepository.criar({ ...dados, senha: senhaHash });
}

export async function atualizarUsuario(id, dados, perfilRequisitante) {
  const valida = await usuarioRepository.buscarPorId(id);
  if (!valida) throw new Error("Usuário não encontrado");

  if (perfilRequisitante === "BIBLIOTECARIO") {
    if (dados.nivel_perfil && dados.nivel_perfil !== "LEITOR") {
      throw new Error("Bibliotecários só podem atribuir perfil LEITOR");
    }
    if (valida.nivel_perfil !== "LEITOR") {
      throw new Error("Bibliotecários só podem editar usuários LEITOR");
    }
  }
  if (dados.email) {
    const emailExistente = await usuarioRepository.buscarPorEmail(dados.email);
    if (emailExistente && emailExistente.id !== id) {
      throw new Error("Email já cadastrado");
    }
  }
  if (dados.senha) {
    dados.senha = await bcrypt.hash(dados.senha, 10);
  }
  return usuarioRepository.atualizar(id, dados);
}

export async function deletar(id, perfilRequisitante) {
  const valida = await usuarioRepository.buscarPorId(id);

  if (!valida) {
    throw new Error("Usuario não encontrado");
  }
  if (
    perfilRequisitante === "BIBLIOTECARIO" &&
    valida.nivel_perfil !== "LEITOR"
  ) {
    throw new Error("Bibliotecários só podem deletar usuários LEITOR");
  }
  const temEmprestimosAtivos = await usuarioRepository.temEmprestimosAtivos(id);
  if (temEmprestimosAtivos) {
    throw new Error("Usuario não pode ser deletado emprestimo em andamento");
  }
  const deletar = await usuarioRepository.deletar(id);
  return !!deletar;
}

export async function buscarEmprestimos(id) {
  const valida = await usuarioRepository.buscarPorId(id);

  if (!valida) {
    throw new Error("Usuário não encontrado");
  }
  const emprestimos = await usuarioRepository.buscarEmprestimos(id);
  return emprestimos;
}

export async function listar() {
  const usuarios = await usuarioRepository.listar();
  return usuarios;
}

export async function encontrar(termo) {
  if (!termo || termo.trim() === "") {
    throw new Error("Termo de busca é obrigatório");
  }
  return usuarioRepository.encontrar(termo);
}
