import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MeusEmprestimos from "./pages/MeusEmprestimos";
import Perfil from "./pages/Perfil";
import CadastroUsuarios from "./pages/CadastroUsuarios";
import CadastroLivros from "./pages/CadastroLivros";
import CadastroCategorias from "./pages/CadastroCategorias";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/emprestimos" element={<MeusEmprestimos />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/cadastro/usuarios" element={<AdminRoute><CadastroUsuarios /></AdminRoute>} />
                <Route path="/cadastro/livros" element={<AdminRoute><CadastroLivros /></AdminRoute>} />
                <Route path="/cadastro/categorias" element={<AdminRoute><CadastroCategorias /></AdminRoute>} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}