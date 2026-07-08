import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${base}${path}`,
    changeFrequency: 'monthly',
    priority,
  });

  return [
    page('/', 1.0),
    page('/how-it-works', 0.8),
    page('/security', 0.8),
    page('/faq', 0.7),
    page('/contact', 0.7),
    page('/privacy', 0.3),
    page('/terms', 0.3),
  ];
}
