import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { modal } from "../styles/components";

export default function Modal({ aberto, fechar, titulo, children }) {
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
      className={modal.backdrop}
      onClick={fechar}
      style={{ animation: "fadeIn 0.15s ease" }}
    >
      <div
        className={modal.container}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.2s ease" }}
      >
        <div className={modal.header}>
          <h2 className={modal.title}>{titulo}</h2>
          <button className={modal.close} onClick={fechar}>
            <FiX size={20} />
          </button>
        </div>
        <div className={modal.body}>{children}</div>
      </div>
    </div>
  );
}
