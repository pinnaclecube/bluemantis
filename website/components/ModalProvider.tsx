'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import Modal from './Modal';
import ContactForm from './ContactForm';

type Ctx = {
  openRequestAccess: () => void;
  openWalkthrough: () => void;
  close: () => void;
};

const ModalCtx = createContext<Ctx | null>(null);

export function useModals(): Ctx {
  const c = useContext(ModalCtx);
  if (!c) throw new Error('useModals must be used within ModalProvider');
  return c;
}

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [which, setWhich] = useState<'request-access' | 'walkthrough' | null>(null);
  const close = useCallback(() => setWhich(null), []);
  const openRequestAccess = useCallback(() => setWhich('request-access'), []);
  const openWalkthrough = useCallback(() => setWhich('walkthrough'), []);

  // Deep link: /?request-access or /?walkthrough (e.g. from the app's sign-in
  // page) opens the matching modal, then strips the param so a refresh is clean.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.has('request-access')
      ? 'request-access'
      : params.has('walkthrough')
        ? 'walkthrough'
        : null;
    if (!target) return;
    setWhich(target);
    params.delete('request-access');
    params.delete('walkthrough');
    const qs = params.toString();
    window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''));
  }, []);

  return (
    <ModalCtx.Provider value={{ openRequestAccess, openWalkthrough, close }}>
      {children}
      <Modal open={which === 'request-access'} onClose={close} title="Request access">
        <ContactForm variant="request-access" onDone={close} />
      </Modal>
      <Modal open={which === 'walkthrough'} onClose={close} title="Book a walkthrough">
        <ContactForm variant="walkthrough" onDone={close} />
      </Modal>
    </ModalCtx.Provider>
  );
}
