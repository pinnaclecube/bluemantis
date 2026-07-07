import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Blue Mantis terms of service, a Venakan Info Solutions product.',
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Terms of Service</h1>
        <p className="mono">Last updated: pending</p>
        {/* TODO: replace all placeholder sections with counsel-provided text. */}
        <div className="stages" style={{ marginTop: 24 }}>
          <div className="stage">
            <h2>Agreement</h2>
            <p>Placeholder. Counsel-provided terms text goes here.</p>
          </div>
          <div className="stage">
            <h2>Use of the service</h2>
            <p>Placeholder. Counsel-provided text goes here.</p>
          </div>
          <div className="stage">
            <h2>Contact</h2>
            <p>Placeholder. Counsel-provided text goes here.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
