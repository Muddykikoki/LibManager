import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { navbar } from "../styles/navbar";
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
  FiShoppingCart,
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
    { to: "/emprestimos", icon: <FiBookOpen size={20} />, label: "Operações" },
    { to: "/perfil", icon: <FiUser size={20} />, label: "Perfil" },
  ];
  if (ehAdmin) {
    links.push({
      to: "/compras",
      icon: <FiShoppingCart size={20} />,
      label: "Compras",
    });
  }

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
      className={`${navbar.sidebar} ${collapsed ? navbar.sidebarCollapsed : navbar.sidebarExpanded}`}
    >
      <div className={navbar.header}>
        {collapsed ? (
          <span className={navbar.logoMini}>LM</span>
        ) : (
          <span className={navbar.logoFull}>LibManager</span>
        )}
      </div>
      <ul className={navbar.linksList}>
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `${navbar.link} ${isActive ? navbar.linkActive : navbar.linkInactive}`
              }
            >
              <span className={navbar.linkIcon}>{link.icon}</span>
              {!collapsed && (
                <span className={navbar.linkLabel}>{link.label}</span>
              )}
            </NavLink>
          </li>
        ))}

        {ehAdmin && (
          <li>
            <button
              className={navbar.submenuBtn}
              onClick={() => setCadastrosAberto(!cadastrosAberto)}
            >
              <span className={navbar.linkIcon}>
                <FiBookOpen size={20} />
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1">Cadastros</span>
                  {cadastrosAberto && (
                    <FiChevronDown size={16} className={navbar.submenuArrow} />
                  )}
                </>
              )}
            </button>

            {cadastrosAberto && !collapsed && (
              <ul className={navbar.submenuList}>
                {cadastroLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `${navbar.submenuLink} ${isActive ? navbar.submenuLinkActive : navbar.submenuLinkInactive}`
                      }
                    >
                      <span className={navbar.linkIcon}>{link.icon}</span>
                      <span className={navbar.linkLabel}>{link.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}

            {cadastrosAberto && collapsed && (
              <ul className={navbar.submenuCollapsedList}>
                {cadastroLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      title={link.label}
                      className={({ isActive }) =>
                        `${navbar.submenuCollapsedLink} ${isActive ? navbar.submenuCollapsedLinkActive : navbar.submenuCollapsedLinkInactive}`
                      }
                    >
                      {link.icon}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}
      </ul>

      <div className={navbar.footer}>
        <button onClick={handleLogout} className={navbar.logoutBtn}>
          <span className={navbar.linkIcon}>
            <FiLogOut size={20} />
          </span>
          {!collapsed && <span>Sair</span>}
        </button>
        <button
          onClick={() => {
            setCollapsed(!collapsed);
            if (!collapsed) setCadastrosAberto(false);
          }}
          className={navbar.toggleBtn}
        >
          <span className={navbar.linkIcon}>
            {collapsed ? (
              <FiChevronRight size={20} />
            ) : (
              <FiChevronLeft size={20} />
            )}
          </span>
          {!collapsed && <span>Retrair</span>}
        </button>
      </div>
    </nav>
  );
}
