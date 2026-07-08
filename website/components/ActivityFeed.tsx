import { ACTIVITY_FEED } from '@/lib/site';

/**
 * Mock activity feed (spec §6.1). Lines fade in staggered on load; fully
 * rendered in the DOM so it reads statically with JS disabled and under
 * reduced motion (CSS gates the animation). No cloned DOM.
 */
export default function ActivityFeed() {
  return (
    <div className="feed" role="img" aria-label="Example Blue Mantis activity feed: a Jira ticket is ingested, scoped, built, security-scanned, tested, reviewed, and opened as pull request 142 awaiting review.">
      <div className="feed-head" aria-hidden="true">
        <span className="feed-dot" />
        <span className="mono-label">Activity</span>
      </div>
      <div aria-hidden="true">
        {ACTIVITY_FEED.map((line, i) => (
          <div
            key={line.time + line.text}
            className={`feed-line${line.final ? ' final' : ''}`}
            style={{ animationDelay: `${0.25 + i * 0.5}s` }}
          >
            <span className="t">{line.time}</span>
            <span>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
