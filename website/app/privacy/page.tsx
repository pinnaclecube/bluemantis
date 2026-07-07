import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Blue Mantis privacy policy, a Venakan Info Solutions product.',
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Privacy Policy</h1>
        <p className="mono">Last updated: pending</p>
        {/* TODO: replace all placeholder sections with counsel-provided text. */}
        <div className="stages" style={{ marginTop: 24 }}>
          <div className="stage">
            <h2>Overview</h2>
            <p>Placeholder. Counsel-provided privacy text goes here.</p>
          </div>
          <div className="stage">
            <h2>Data we process</h2>
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
