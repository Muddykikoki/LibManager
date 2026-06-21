import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { form, btn } from "../styles/components";
import { theme } from "../styles/theme";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await login(email, senha);
    } catch (err) {
      setErro(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erro ao fazer login",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={theme.loginPage}>
      <div className={theme.loginCard}>
        <h1 className={theme.loginTitle}>LibManager</h1>
        <p className={theme.loginSubtitle}>Acesse sua conta</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={form.group}>
            <label className={form.label}>E-mail</label>
            <input
              type="email"
              placeholder="Ex: bibliotecario@biblioteca.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={form.input}
            />
          </div>
          <div className={form.group}>
            <label className={form.label}>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className={form.input}
            />
          </div>
          <button
            type="submit"
            disabled={carregando}
            className={`${btn("primary")} w-full`}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
          {erro && <p className={form.error + " text-center"}>{erro}</p>}
        </form>
      </div>
    </div>
  );
}
