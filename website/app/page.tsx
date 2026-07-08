import Link from 'next/link';
import Schematic from '@/components/Schematic';
import ActivityFeed from '@/components/ActivityFeed';
import IntegrationLogos from '@/components/IntegrationLogos';
import Faq from '@/components/Faq';
import Reveal from '@/components/Reveal';
import ContactForm from '@/components/ContactForm';
import { RequestAccessButton } from '@/components/AccessButtons';
import { STEPS, BENEFITS, HOME_FAQ } from '@/lib/site';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero blueprint">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>Your teams work exactly as they do today. The engineering just gets done faster.</h1>
            <p className="lead">
              Blue Mantis connects to your ticketing system and code repositories, builds and tests the
              change with a team of specialist agents, and returns a finished pull request for your
              engineers to approve.
            </p>
            <p className="mono" style={{ marginTop: 22 }}>No new tools. Same tickets, same reviews, same repo.</p>
            <p style={{ marginTop: 20 }}>
              <Link href="/how-it-works" className="textlink">See how it works →</Link>
            </p>
          </div>
          <div className="hero-form">
            <ContactForm variant="request-access" heading="Request access" />
          </div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="proof tight">
        <div className="container proof-inner">
          <span className="mono-label">Runs inside the tools you already use</span>
          <IntegrationLogos />
        </div>
      </section>

      {/* Orchestration schematic */}
      <section className="blueprint wide" aria-labelledby="orch-h">
        <div className="container">
          <div className="sec-head">
            <h2 id="orch-h">One orchestrator. A team of specialists. Your process, untouched.</h2>
            <p className="lead schematic-support">
              The orchestrator reads intent from your tickets, dispatches Builder, Reviewer, Security,
              and QA agents to work the change concurrently, and hands your team a pull request that is
              already built, reviewed, and tested.
            </p>
          </div>
          <Reveal className="schematic-figure">
            <Schematic />
          </Reveal>
        </div>
      </section>

      {/* Consolidation pitch */}
      <section className="band" aria-labelledby="cons-h">
        <div className="container">
          <div className="sec-head">
            <h2 id="cons-h">Stop stitching together contractors, backlogs, and heroics.</h2>
          </div>
          <p className="lead mt-lead">
            Routine engineering work today gets handled by whoever has slack: a contractor, an agency,
            or a senior engineer pulled off the roadmap. Blue Mantis takes that work off the critical
            path so your team&rsquo;s time goes to the decisions only they can make.
          </p>
        </div>
      </section>

      {/* How it works + activity feed */}
      <section aria-labelledby="how-h">
        <div className="container duo">
          <div>
            <h2 id="how-h">From ticket to pull request, on its own.</h2>
            <ol className="steps">
              {STEPS.map((s) => (
                <li key={s.title}>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="steps-link">
              <Link href="/how-it-works" className="textlink">See the full lifecycle →</Link>
            </p>
          </div>
          <Reveal>
            <ActivityFeed />
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="band" aria-label="Benefits">
        <div className="container">
          <div className="rows">
            {BENEFITS.map((b) => (
              <div className="row" key={b.title}>
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Human in the loop */}
      <section aria-labelledby="hitl-h">
        <div className="container">
          <div className="sec-head">
            <h2 id="hitl-h">Autonomous where it&rsquo;s safe. Human where it matters.</h2>
          </div>
          <p className="lead mt-lead">
            Nothing merges without your engineer&rsquo;s approval. Blue Mantis does the hours of
            building, checking, and re-checking; your team keeps the judgment calls, the architecture,
            and the final word on every line that ships.
          </p>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="band" aria-labelledby="faq-h">
        <div className="container">
          <div className="sec-head">
            <h2 id="faq-h">Questions engineering leaders ask.</h2>
          </div>
          <Faq items={HOME_FAQ} />
          <p className="steps-link">
            <Link href="/faq" className="textlink">All questions →</Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="cta-h">
        <div className="container">
          <div className="sec-head">
            <h2 id="cta-h">Put your backlog to work tonight.</h2>
            <p className="lead mt-lead">
              Join the private beta and watch a real ticket become a reviewed pull request.
            </p>
          </div>
          <div className="btn-row" style={{ marginTop: 28 }}>
            <RequestAccessButton className="btn btn-primary">Request early access</RequestAccessButton>
          </div>
        </div>
      </section>
    </>
  );
}
