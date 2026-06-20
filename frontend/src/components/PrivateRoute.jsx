import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, perfilPermitido }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (perfilPermitido !== undefined) {
    const HIERARQUIA = { LEITOR: 0, BIBLIOTECARIO: 1, DEV: 2 };
    const nivel = HIERARQUIA[user.nivel_perfil];

    if (typeof perfilPermitido === "number") {
      if (nivel < perfilPermitido) {
        return <Navigate to="/" />;
      }
    } else if (Array.isArray(perfilPermitido)) {
      if (!perfilPermitido.includes(user.nivel_perfil)) {
        return <Navigate to="/" />;
      }
    }
  }

  return children;
}