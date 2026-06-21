import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";

export default function TopBar() {
  const { user } = useAuth();

  const roleClass =
    user?.nivel_perfil === "DEV"
      ? theme.topbarRoleDEV
      : user?.nivel_perfil === "BIBLIOTECARIO"
        ? theme.topbarRoleBIBLIOTECARIO
        : theme.topbarRoleLEITOR;

  return (
    <div className={theme.topbar}>
      <div className={theme.topbarLeft}>LibManager</div>
      <div className={theme.topbarRight}>
        <span className={theme.topbarName}>{user?.nome}</span>
        <span className={`${theme.topbarRole} ${roleClass}`}>
          {user?.nivel_perfil}
        </span>
      </div>
    </div>
  );
}
