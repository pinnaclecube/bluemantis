import type { FaqItem } from '@/lib/site';

// Native <details>/<summary> FAQ. Summary is Space Grotesk 500 (not a heading).
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <div className="faq-answer">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
