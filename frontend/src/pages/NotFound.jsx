import { useNavigate } from "react-router-dom";
import { theme } from "../styles/theme";
import { btn } from "../styles/components";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={theme.errorPage}>
      <div className={theme.errorContent}>
        <h1 className={theme.errorCode}>404</h1>
        <h2 className={theme.errorTitle}>Página não encontrada</h2>
        <p className={theme.errorMsg}>
          A página que você procura não existe ou foi movida.
        </p>
        <button className={btn("primary")} onClick={() => navigate("/")}>
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}
