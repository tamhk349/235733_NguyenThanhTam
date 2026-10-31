import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-notification ${isSuccess ? 'toast-success' : 'toast-error'}`}>
      <div className="toast-icon">
        {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      </div>
      <div className="toast-message">
        <strong>{isSuccess ? 'Thành công' : 'Thông báo'}</strong>
        <span>{toast.message}</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Đóng thông báo">
        <X size={16} />
      </button>
    </div>
  );
}
