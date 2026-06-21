import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from "react-icons/fi";
import { toast } from "../styles/alerts";

const ToastContext = createContext(null);

const icons = {
  success: <FiCheckCircle size={18} />,
  error: <FiXCircle size={18} />,
  warning: <FiAlertTriangle size={18} />,
  info: <FiInfo size={18} />,
};

function ToastItem({ toast: t, onRemove }) {
  const [progress, setProgress] = useState(100);
  const duracao = t.duracao || 4000;

  useEffect(() => {
    const interval = 50;
    const decremento = (interval / duracao) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onRemove(t.id);
          return 0;
        }
        return prev - decremento;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [t.id, duracao, onRemove]);

  return (
    <div className={`${toast.base} ${toast[t.tipo]}`}>
      <span className={toast.icon}>{icons[t.tipo]}</span>
      <div className="flex-1 min-w-0">
        <p className={toast.text}>{t.titulo}</p>
        {t.descricao && <p className={toast.subtext}>{t.descricao}</p>}
      </div>
      <button className={toast.close} onClick={() => onRemove(t.id)}>
        <FiX size={14} />
      </button>
      <div
        className={`${toast.progressBar} ${toast[`progress${t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}`]}`}
        style={{ width: `${progress}%`, transition: "width 0.05s linear" }}
      />
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remover = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const adicionar = useCallback((tipo, titulo, descricao, duracao) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tipo, titulo, descricao, duracao }]);
  }, []);

  const toastApi = {
    success: (titulo, descricao, duracao) =>
      adicionar("success", titulo, descricao, duracao),
    error: (titulo, descricao, duracao) =>
      adicionar("error", titulo, descricao, duracao),
    warning: (titulo, descricao, duracao) =>
      adicionar("warning", titulo, descricao, duracao),
    info: (titulo, descricao, duracao) =>
      adicionar("info", titulo, descricao, duracao),
  };

  return (
    <ToastContext.Provider value={toastApi}>
      {children}
      <div className={toast.container}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={remover} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error("useToast deve ser usado dentro de ToastProvider");
  return context;
}
