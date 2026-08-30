import React, { useEffect } from "react";
import "./Common.css";

const toastConfig = {
  success: {
    icon: "✓",
    className: "toast-success",
  },
  warning: {
    icon: "!",
    className: "toast-warning",
  },
  danger: {
    icon: "!",
    className: "toast-danger",
  },
  error: {
    icon: "!",
    className: "toast-danger",
  },
};

function Toast({
  show = true,
  type = "success",
  message,
  onClose,
  duration = 3000,
}) {
  const config = toastConfig[type] || toastConfig.success;

  useEffect(() => {
    if (!show || !message || !duration) {
      return;
    }

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, message, duration, onClose]);

  if (!show || !message) {
    return null;
  }

  return (
    <div className={`toast-container ${config.className}`}>
      <div className="toast-icon">
        {config.icon}
      </div>

      <div className="toast-message">
        {message}
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;