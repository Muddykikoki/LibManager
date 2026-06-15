import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = {
  LEITOR: 60 * 60 * 24,
  BIBLIOTECARIO: 60 * 60 * 24 * 7,
  DEV: 60 * 60 * 24 * 365,
};
export function gerarAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}
export function gerarRefreshToken(payload, nivel_perfil) {
  const expiresInSeconds = REFRESH_EXPIRES[nivel_perfil] ?? REFRESH_EXPIRES.LEITOR;
  const token = jwt.sign(payload, REFRESH_SECRET, { expiresIn: expiresInSeconds });
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
  return { token, expiresAt };
}

export function verificarAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verificarRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}