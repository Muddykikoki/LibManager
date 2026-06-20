import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import "../styles/modal.css";

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
    <div className="modal-backdrop" onClick={fechar}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titulo}</h2>
          <button className="modal-close" onClick={fechar}>
            <FiX size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}