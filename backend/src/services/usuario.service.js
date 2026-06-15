import bcrypt from "bcryptjs";
import * as usuarioRepository from "../repository/usuario.repository.js";

export async function criarUsuario(dados) {
  console.log("Criando usuário com dados:", dados);
  const senhaHash = await bcrypt.hash(dados.senha,10);
  return usuarioRepository.criar({...dados,senha: senhaHash,});

}

export async function atualizarUsuario(id, dados) {
  const valida = await usuarioRepository.buscarPorId(id);

  if (!valida) {
    throw new Error("Usuário não encontrado");
  }
  if (dados.email) {
    const emailExistente = await usuarioRepository.buscarPorEmail(dados.email);

    if (emailExistente && emailExistente.id !== Number(id)) 
    {
      throw new Error("Email já cadastrado");
    }
  }

  return usuarioRepository.atualizar(id, dados);
}

export async function buscarEmprestimos(id) {
  const valida = await usuarioRepository.buscarPorId(id);

  if (!valida) {
    throw new Error("Usuário não encontrado");
  }
  const emprestimos = await usuarioRepository.buscarEmprestimos(id);
  return emprestimos;
  }