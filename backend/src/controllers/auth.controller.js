import * as authService from "../services/auth.service.js";

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const dados = await authService.login(email, senha);
    res.json(dados);
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Erro interno" });
  }
}

export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    const dados = await authService.refresh(refreshToken);
    res.json(dados);
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Erro interno" });
  }
}

export async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    
    await authService.logout(refreshToken);
    res.json({ message: "Logout realizado com sucesso" });
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Erro interno" });
  }
}