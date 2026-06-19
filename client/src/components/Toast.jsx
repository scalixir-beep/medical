import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastCtx = createContext(null);

const ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);

  function dismiss(id) {
    setToasts(t => t.filter(x => x.id !== id));
  }

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toast-wrap" aria-live="polite">
        {toasts.map(({ id, message, type }) => {
          const Icon = ICONS[type] || Info;
          return (
            <div key={id} className={`toast toast-${type}`}>
              <Icon size={17} strokeWidth={2} className="toast-icon"/>
              <span className="toast-msg">{message}</span>
              <button className="toast-close" onClick={() => dismiss(id)}>
                <X size={14} strokeWidth={2.5}/>
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}

/* Hook — usage : const toast = useToast(); toast("Succès !"); toast("Erreur", "error"); */
export function useToast() {
  return useContext(ToastCtx);
}
