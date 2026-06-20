import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>LibManager</h1>
      <p>Bem-vindo, {user.nome}</p>
      <p>Perfil: {user.nivel_perfil}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}