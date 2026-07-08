'use client';

import type { ReactNode } from 'react';
import { useModals } from './ModalProvider';

export function RequestAccessButton({
  className = 'btn btn-primary',
  children = 'Request access',
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { openRequestAccess } = useModals();
  return (
    <button type="button" className={className} onClick={openRequestAccess}>
      {children}
    </button>
  );
}

export function WalkthroughButton({
  className = 'btn btn-outline',
  children = 'Book a walkthrough',
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { openWalkthrough } = useModals();
  return (
    <button type="button" className={className} onClick={openWalkthrough}>
      {children}
    </button>
  );
}
