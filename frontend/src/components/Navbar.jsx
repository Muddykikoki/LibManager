import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiBookOpen,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiUsers,
  FiPackage,
  FiTag,
} from "react-icons/fi";

export default function Navbar({ collapsed, setCollapsed, isMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cadastrosAberto, setCadastrosAberto] = useState(false);

  const ehAdmin =
    user?.nivel_perfil === "BIBLIOTECARIO" || user?.nivel_perfil === "DEV";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const links = [
    { to: "/", icon: <FiHome size={20} />, label: "Home" },
    {
      to: "/emprestimos",
      icon: <FiBookOpen size={20} />,
      label: "Meus Empréstimos",
    },
    { to: "/perfil", icon: <FiUser size={20} />, label: "Perfil" },
  ];

  const cadastroLinks = [
    {
      to: "/cadastro/usuarios",
      icon: <FiUsers size={18} />,
      label: "Usuários",
    },
    { to: "/cadastro/livros", icon: <FiPackage size={18} />, label: "Livros" },
    {
      to: "/cadastro/categorias",
      icon: <FiTag size={18} />,
      label: "Categorias",
    },
  ];

  return (
    <nav
      className={`navbar ${collapsed ? "collapsed" : ""} ${isMobile ? "mobile" : ""}`}
    >
      <div className="navbar-header">
        {collapsed ? (
          <span className="logo-mini">LM</span>
        ) : (
          <span className="logo-full">LibManager</span>
        )}
      </div>

      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span className="nav-icon">{link.icon}</span>
              {!collapsed && <span className="nav-label">{link.label}</span>}
            </NavLink>
          </li>
        ))}

        {ehAdmin && (
          <li>
            <button
              className="nav-link submenu-toggle"
              onClick={() => setCadastrosAberto(!cadastrosAberto)}
            >
              <span className="nav-icon">
                <FiBookOpen size={20} />
              </span>
              {!collapsed && (
                <>
                  <span className="nav-label">Cadastros</span>
                  {cadastrosAberto && (
                    <span className="submenu-arrow open">
                      <FiChevronDown size={16} />
                    </span>
                  )}
                </>
              )}
              {collapsed && cadastrosAberto && (
                <span className="submenu-arrow-collapsed">
                  <FiChevronDown size={12} />
                </span>
              )}
            </button>

            {cadastrosAberto && !collapsed && (
              <ul className="submenu submenu-expanded">
                {cadastroLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        isActive
                          ? "nav-link submenu-link active"
                          : "nav-link submenu-link"
                      }
                    >
                      <span className="nav-icon">{link.icon}</span>
                      <span className="nav-label">{link.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}

            {cadastrosAberto && collapsed && (
              <ul className="submenu submenu-collapsed">
                {cadastroLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        isActive
                          ? "nav-link submenu-link-mini active"
                          : "nav-link submenu-link-mini"
                      }
                      title={link.label}
                    >
                      <span className="nav-icon">{link.icon}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}
      </ul>

      <div className="navbar-footer">
        <button className="nav-link logout-btn" onClick={handleLogout}>
          <span className="nav-icon">
            <FiLogOut size={20} />
          </span>
          {!collapsed && <span className="nav-label">Sair</span>}
        </button>
        <button
          className="nav-link toggle-btn"
          onClick={() => {
            setCollapsed(!collapsed);
            if (!collapsed) setCadastrosAberto(false);
          }}
        >
          <span className="nav-icon">
            {collapsed ? (
              <FiChevronRight size={20} />
            ) : (
              <FiChevronLeft size={20} />
            )}
          </span>
          {!collapsed && <span className="nav-label">Retrair</span>}
        </button>
      </div>
    </nav>
  );
}
