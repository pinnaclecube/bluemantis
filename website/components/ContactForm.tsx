'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';

type Variant = 'request-access' | 'walkthrough';
type Status = 'idle' | 'submitting' | 'success' | 'error';

function Field({
  name,
  label,
  type = 'text',
  error,
  textarea,
  placeholder,
  required,
  autoComplete,
  inputMode,
}: {
  name: string;
  label: string;
  type?: string;
  error?: string;
  textarea?: boolean;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'numeric';
}) {
  const id = `f-${name}`;
  const describedBy = error ? `${id}-err` : undefined;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          className={`input${error ? ' err' : ''}`}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          inputMode={inputMode}
          className={`input${error ? ' err' : ''}`}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      )}
      {error && (
        <span id={`${id}-err`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default function ContactForm({
  variant,
  heading,
  onDone,
}: {
  variant: Variant;
  heading?: ReactNode;
  onDone?: () => void;
}) {
  const isWalk = variant === 'walkthrough';
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const val = (k: string) => String(fd.get(k) ?? '').trim();
    const name = val('name');
    const email = val('email');
    const company = val('company');

    const next: Record<string, string> = {};
    if (!name) next.name = 'Please enter your name.';
    if (!email) next.email = 'Please enter your work email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Please enter a valid email.';
    if (!company) next.company = 'Please enter your company.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus('submitting');
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: variant,
          name,
          email,
          company,
          teamSize: val('teamSize') || undefined,
          preferredTime: val('preferredTime') || undefined,
          message: val('message') || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-card form-done" role="status" aria-live="polite">
        <p className="form-done-title">Thank you. Your request is in.</p>
        <p className="dim">
          We reply within one business day. Watch for an email from the Blue Mantis team.
        </p>
        {onDone && (
          <button type="button" className="btn btn-outline" style={{ marginTop: 18 }} onClick={onDone}>
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form ref={formRef} className="form-card form" onSubmit={onSubmit} noValidate>
      {heading && <p className="form-heading">{heading}</p>}
      <Field name="name" label="Name" autoComplete="name" required error={errors.name} />
      <Field name="email" label="Work email" type="email" inputMode="email" autoComplete="email" required error={errors.email} />
      <Field name="company" label="Company" autoComplete="organization" required error={errors.company} />
      {isWalk ? (
        <Field name="preferredTime" label="Preferred time and time zone" placeholder="e.g. weekday mornings, PT" />
      ) : (
        <Field name="teamSize" label="Engineering team size" inputMode="numeric" placeholder="e.g. 25" />
      )}
      <Field
        name="message"
        label={isWalk ? 'Anything specific to cover?' : 'What would you like Blue Mantis to handle?'}
        textarea
      />
      {serverError && (
        <p className="form-server-error" role="alert">
          {serverError}
        </p>
      )}
      <button type="submit" className="btn btn-primary form-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : isWalk ? 'Request a walkthrough' : 'Request access'}
      </button>
      <p className="form-fine mono">We reply within one business day.</p>
    </form>
  );
}
