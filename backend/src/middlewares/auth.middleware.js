import { verificarAccessToken } from "../utils/jwt.js";

export function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Token não fornecido" });
  const token = authHeader.split(" ")[1];
  try {
    req.user = verificarAccessToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
