// Central site data. Copy here is final per spec §6 — do not paraphrase.

export const SITE = {
  name: 'Blue Mantis',
  company: 'Venakan Info Solutions',
  url: 'https://www.bluemantis.ai',
  linkedin: 'https://linkedin.com/company/venakan',
  email: 'hello@venakan.com',
  // Placeholder until a real scheduling URL is provided (spec §6.5).
  bookingUrl: '#', // TODO: replace with Cal.com / scheduling URL when available
};

export const NAV_LINKS = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Security', href: '/security' },
  { label: 'FAQ', href: '/faq' },
];

export const INTEGRATIONS = [
  'GitHub',
  'GitLab',
  'Bitbucket',
  'Jira',
  'Linear',
  'Slack',
] as const;

export const ACTIVITY_FEED: { time: string; text: string; final?: boolean }[] = [
  { time: '09:41', text: 'Ticket ENG-2417 ingested from Jira' },
  { time: '09:42', text: 'Orchestrator: scoped to 3 files, 2 tests' },
  { time: '09:44', text: 'Builder: patch drafted' },
  { time: '09:44', text: 'Security: no new dependencies, scan clean' },
  { time: '09:47', text: 'QA: 14/14 tests passing' },
  { time: '09:51', text: 'Reviewer: standards check passed' },
  { time: '09:52', text: 'PR #142 opened, awaiting your review', final: true },
];

export const STEPS = [
  {
    title: 'Reads the ticket.',
    body: 'The orchestrator pulls functional intent, acceptance criteria, and linked context from your PLM.',
  },
  {
    title: 'Builds concurrently.',
    body: 'Builder writes the change while Security and QA agents inspect in parallel, not after.',
  },
  {
    title: 'Reviews itself first.',
    body: 'The Reviewer agent gates the work against your repo’s standards before a human ever sees it.',
  },
  {
    title: 'Opens the PR.',
    body: 'Your engineer reviews and promotes it the same way they do today.',
  },
];

export const BENEFITS = [
  {
    title: 'Runs while you sleep.',
    body: 'Work dispatched at 6pm is a reviewed pull request by morning. No standups required to keep it moving.',
  },
  {
    title: 'Specialists, not a generalist.',
    body: 'Build, review, security, and QA are separate agents with separate jobs. Each gate is real.',
  },
  {
    title: 'Your code stays yours.',
    body: 'Blue Mantis works inside your repositories under your permissions. Nothing is trained on your code.',
  },
  {
    title: 'No adoption project.',
    body: 'There is no new dashboard to learn. Your team keeps its tickets, sprints, and review flow.',
  },
  {
    title: 'Off the critical path.',
    body: 'Routine changes stop competing with roadmap work for senior engineering attention.',
  },
];

export const SECURITY_ROWS = [
  {
    title: 'Scoped permissions.',
    body: 'Agents operate under repository roles you grant, and nothing wider. Revoke access and the work stops.',
  },
  {
    title: 'Full audit trail.',
    body: 'Every agent action is logged against the ticket and the PR: who did what, when, and why.',
  },
  {
    title: 'No training on your code.',
    body: 'Your repositories are context for your work, never anyone else’s model.',
  },
  {
    title: 'Human approval gate.',
    body: 'No agent can merge. The final promote action belongs to your engineer, every time.',
  },
];

export type FaqItem = { q: string; a: string };
export type FaqGroup = { group: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    group: 'What it does',
    items: [
      {
        q: 'Does Blue Mantis replace my engineers?',
        a: 'No. It takes routine, well-specified work off their plate. Scoping, architecture, and approval stay human.',
      },
      {
        q: 'What kinds of work does it handle well?',
        a: 'Well-defined tickets: features with clear acceptance criteria, bug fixes, refactors, test coverage, dependency and API updates.',
      },
      {
        q: 'What does it not do?',
        a: 'It does not merge its own work, invent requirements, or touch anything outside the permissions you grant.',
      },
    ],
  },
  {
    group: 'Getting started',
    items: [
      {
        q: 'What does onboarding involve?',
        a: 'Connecting your PLM and repositories and setting permission scopes. Most teams are running on a real ticket in the first week.',
      },
      {
        q: 'Do we need to change our workflow?',
        a: 'No. Tickets, branches, and reviews work exactly as they do today.',
      },
      {
        q: 'How is it priced?',
        a: 'Beta pricing is set per engagement during onboarding. Request access and we will walk you through it.',
      },
    ],
  },
  {
    group: 'Security and code ownership',
    items: [
      {
        q: 'Where does our code go?',
        a: 'Work happens against your repositories under scoped credentials. Code is not retained beyond the task and is never used for training.',
      },
      {
        q: 'Is there an audit trail?',
        a: 'Yes. Every agent action is logged and traceable to the originating ticket and resulting PR.',
      },
      {
        q: 'Can we self-host or use our own model keys?',
        a: 'Talk to us during onboarding; deployment options depend on your environment.',
      },
    ],
  },
];

// Top four for the home preview: first question of each group plus the pricing question.
export const HOME_FAQ: FaqItem[] = [
  FAQ_GROUPS[0].items[0],
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[2].items[0],
  FAQ_GROUPS[1].items[2], // pricing
];
