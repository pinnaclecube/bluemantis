import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sections = [
  {
    title: 'How credentials are stored',
    body: `Your JIRA, Azure DevOps, and Git credentials are stored as environment secrets in your own deployment — not on Blue Mantis servers. They never leave your infrastructure.`,
  },
  {
    title: 'What code is sent to AI providers',
    body: `Only the file context for the active task is sent — not your whole codebase. We send: the task title, description, and acceptance criteria, plus the top 5 most relevant files for that task (limited to 8,000 characters of context).`,
  },
  {
    title: 'What we store',
    body: `We store: task metadata, AI suggestions generated (for your analytics dashboard), and which suggestion was accepted. We never store: your actual codebase, your credentials, your PR content, or your JIRA/Azure DevOps data beyond what is needed to display the task.`,
  },
  {
    title: 'AI provider data policies',
    body: `Claude (Anthropic): Data is not used to train models without explicit consent. GPT-4o (OpenAI): API data is not used for training by default. Microsoft Copilot: Subject to your existing Microsoft enterprise agreement.`,
  },
  {
    title: 'SOC 2 Type II',
    body: `SOC 2 Type II certification is on our 12-month roadmap. We are happy to complete security questionnaires and provide current documentation to enterprise prospects. Email security@bluemantis.io.`,
  },
  {
    title: 'Private cloud deployment',
    body: `Enterprise customers can deploy Blue Mantis in their own AWS or Azure environment. In this configuration, no data leaves your cloud boundary. Contact sales@bluemantis.io to discuss.`,
  },
  {
    title: 'Contact',
    body: `Security questions: security@bluemantis.io\nResponsible disclosure: Please email security@bluemantis.io before publishing any vulnerability findings.`,
  },
];

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 96px' }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: 44,
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          Security at Blue Mantis
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 18,
          color: 'var(--text-secondary)',
          marginTop: 16,
        }}>
          How we handle your code, credentials, and data.
        </p>

        {sections.map((s) => (
          <div key={s.title}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontSize: 22,
              color: 'var(--accent-blue)',
              marginTop: 48,
              marginBottom: 12,
            }}>
              {s.title}
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              whiteSpace: 'pre-line',
              margin: 0,
            }}>
              {s.body}
            </p>
            <div style={{ height: 1, background: 'var(--border)', marginTop: 32 }} />
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
