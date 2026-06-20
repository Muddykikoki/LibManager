import bcrypt from "bcryptjs";
import {
  gerarAccessToken,
  gerarRefreshToken,
  verificarRefreshToken,
} from "../utils/jwt.js";
import {
  buscarUserPorEmail,
  salvarRefreshToken,
  buscarRefreshToken,
  deletarRefreshToken,
  deletarTodosRefreshTokensDoUser,
} from "../repository/auth.repository.js";

export async function login(email, senha) {
  const user = await buscarUserPorEmail(email);
  if (!user) throw { status: 401, message: "Credenciais inválidas" };

  const senhaValida = await bcrypt.compare(senha, user.senha);
  if (!senhaValida) throw { status: 401, message: "Credenciais inválidas" };

  const payload = { sub: user.id, nivel_perfil: user.nivel_perfil };
  const accessToken = gerarAccessToken(payload);
  const { token: refreshToken, expiresAt } = gerarRefreshToken(
    payload,
    user.nivel_perfil,
  );

  await salvarRefreshToken({ token: refreshToken, userId: user.id, expiresAt });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      nivel_perfil: user.nivel_perfil,
    },
  };
}

export async function refresh(refreshToken) {
  let payload;

  try {
    payload = verificarRefreshToken(refreshToken);
  } catch {
    throw { status: 401, message: "Refresh token inválido ou expirado" };
  }

  const tokenSalvo = await buscarRefreshToken(refreshToken);
  if (!tokenSalvo)
    throw { status: 401, message: "Refresh token não encontrado" };
  if (new Date() > tokenSalvo.expiresAt) {
    await deletarRefreshToken(refreshToken);
    throw { status: 401, message: "Refresh token expirado" };
  }

  const user = tokenSalvo.user;
  const novoPayload = { sub: user.id, nivel_perfil: user.nivel_perfil };

  await deletarRefreshToken(refreshToken);

  const accessToken = gerarAccessToken(novoPayload);
  const { token: novoRefreshToken, expiresAt } = gerarRefreshToken(
    novoPayload,
    user.nivel_perfil,
  );

  await salvarRefreshToken({
    token: novoRefreshToken,
    userId: user.id,
    expiresAt,
  });

  return { accessToken, refreshToken: novoRefreshToken };
}

export async function logout(refreshToken) {
  const tokenSalvo = await buscarRefreshToken(refreshToken);
  if (!tokenSalvo) throw { status: 401, message: "Token não encontrado" };
  await deletarRefreshToken(refreshToken);
}

export async function logoutTodos(userId) {
  await deletarTodosRefreshTokensDoUser(userId);
}
