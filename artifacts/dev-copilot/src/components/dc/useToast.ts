import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

let _uid = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((message: string) => {
    const id = `toast-${++_uid}`;
    setToasts((prev) => [...prev, { id, type: 'success', message }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const showError = useCallback((message: string) => {
    const id = `toast-${++_uid}`;
    setToasts((prev) => [...prev, { id, type: 'error', message }]);
  }, []);

  return { toasts, showSuccess, showError, dismiss };
}
