'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
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
