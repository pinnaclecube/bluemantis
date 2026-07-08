import { SITE } from './site';
import { FAQ_GROUPS } from './site';

// Renders a JSON-LD <script>. Content is trusted, static, build-time only.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.company,
  url: SITE.url,
  sameAs: [SITE.linkedin],
};

export const softwareApplicationLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE.name,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: SITE.url,
  publisher: { '@type': 'Organization', name: SITE.company },
};

export const faqPageLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_GROUPS.flatMap((g) =>
    g.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  ),
};

export function breadcrumbLd(page: { name: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.name,
        item: SITE.url + page.path,
      },
    ],
  };
}
