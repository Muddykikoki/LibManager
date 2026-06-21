import { useEffect } from "react";
import {
  FiAlertTriangle,
  FiTrash2,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";
import { confirm } from "../styles/alerts";
import { btn } from "../styles/components";

const variantConfig = {
  danger: {
    icon: <FiTrash2 size={20} className="text-red-400" />,
    iconClass: confirm.iconDanger,
    confirmBtn: "danger",
    confirmText: "Confirmar",
  },
  warning: {
    icon: <FiAlertTriangle size={20} className="text-amber-400" />,
    iconClass: confirm.iconWarning,
    confirmBtn: "primary",
    confirmText: "Confirmar",
  },
  info: {
    icon: <FiInfo size={20} className="text-glow-400" />,
    iconClass: confirm.iconInfo,
    confirmBtn: "primary",
    confirmText: "OK",
  },
  success: {
    icon: <FiCheckCircle size={20} className="text-emerald-400" />,
    iconClass: confirm.iconSuccess,
    confirmBtn: "primary",
    confirmText: "OK",
  },
};

export default function Confirm({
  aberto,
  fechar,
  confirmar,
  titulo,
  mensagem,
  variant = "warning",
  confirmText,
}) {
  const config = variantConfig[variant] || variantConfig.warning;

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") fechar();
    }
    if (aberto) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [aberto, fechar]);

  if (!aberto) return null;

  return (
    <div
      className={confirm.backdrop}
      onClick={fechar}
      style={{ animation: "fadeIn 0.15s ease" }}
    >
      <div
        className={confirm.container}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.2s ease" }}
      >
        <div className={confirm.header}>
          <div className={`${confirm.icon} ${config.iconClass}`}>
            {config.icon}
          </div>
          <h2 className={confirm.title}>{titulo}</h2>
        </div>
        <div className={confirm.body}>{mensagem}</div>
        <div className={confirm.footer}>
          <button className={btn("secondary")} onClick={fechar}>
            Cancelar
          </button>
          <button
            className={btn(config.confirmBtn)}
            onClick={() => {
              confirmar();
              fechar();
            }}
          >
            {confirmText || config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
