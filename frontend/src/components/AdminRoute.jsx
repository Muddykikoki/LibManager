import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const ehAdmin =
    user?.nivel_perfil === "BIBLIOTECARIO" || user?.nivel_perfil === "DEV";
  return ehAdmin ? children : <Navigate to="/" />;
}
