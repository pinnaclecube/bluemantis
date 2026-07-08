import type { Metadata } from 'next';
import Link from 'next/link';
import Schematic from '@/components/Schematic';
import { JsonLd, breadcrumbLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'Blue Mantis runs the middle of your delivery lifecycle: what happens between a ticket entering the queue and a pull request reaching your engineer.',
  alternates: { canonical: '/how-it-works' },
};

const STAGES = [
  {
    h: 'Intake',
    p: 'A ticket enters your queue the same way it always has. The orchestrator reads its functional intent, acceptance criteria, and any linked context from Jira, Linear, or Azure Boards. Nothing about how your team files work changes.',
  },
  {
    h: 'Orchestration',
    p: 'The orchestrator scopes the change and decides which specialists it needs. It dispatches Builder, Reviewer, Security, and QA agents and coordinates their work against the ticket. It holds the plan; the specialists do the work.',
  },
  {
    h: 'Concurrent build and inspection',
    p: 'Builder writes the change. At the same time, the Security agent checks dependencies and the QA agent runs and extends tests. Inspection happens alongside the build, not in a later pass, so problems surface while the work is still forming.',
  },
  {
    h: 'Self-review',
    p: 'The Reviewer agent gates the change against your repository’s standards before any human is involved. Work that does not meet the bar goes back to the specialists, not to your engineer.',
  },
  {
    h: 'Human approval',
    p: 'Nothing merges without your engineer’s approval. Blue Mantis opens a pull request and your engineer reviews and promotes it exactly as they do today. The final word on every line belongs to your team.',
  },
];

export default function HowItWorks() {
  return (
    <>
      <JsonLd data={breadcrumbLd({ name: 'How it works', path: '/how-it-works' })} />

      <section className="hero">
        <div className="container">
          <h1>From ticket to pull request, without a handoff meeting.</h1>
          <p className="lead">
            Blue Mantis runs the middle of your software delivery lifecycle. Here is exactly what
            happens between a ticket entering the queue and a pull request reaching your engineer.
          </p>
        </div>
      </section>

      <section className="blueprint tight">
        <div className="container">
          <Schematic
            captions={[
              'Tickets enter the same way they do today, from Jira, Linear, or Azure Boards.',
              'The orchestrator scopes the work and dispatches Builder, Reviewer, Security, and QA agents concurrently.',
              'A finished pull request waits for your engineer to review and promote, unchanged.',
            ]}
          />
        </div>
      </section>

      <section>
        <div className="container">
          <div className="stages">
            {STAGES.map((s) => (
              <div className="stage" key={s.h}>
                <h2>{s.h}</h2>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="scope-h">
        <div className="container">
          <div className="sec-head">
            <h2 id="scope-h">What it handles, and what it leaves to you.</h2>
          </div>
          <div className="cols2">
            <div>
              <h3>What it handles well</h3>
              <ul>
                <li>Features with clear acceptance criteria.</li>
                <li>Bug fixes.</li>
                <li>Refactors.</li>
                <li>Test coverage.</li>
                <li>Dependency and API updates.</li>
              </ul>
            </div>
            <div>
              <h3>What it does not do</h3>
              <ul>
                <li>It does not merge its own work.</li>
                <li>It does not invent requirements.</li>
                <li>It does not touch anything outside the permissions you grant.</li>
                <li>It does not replace scoping, architecture, or approval.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Next steps">
        <div className="container">
          <div className="btn-row">
            <Link href="/contact" className="btn btn-primary">Request early access</Link>
            <Link href="/security" className="btn btn-outline">Read the security model →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
