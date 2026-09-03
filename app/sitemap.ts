import type { MetadataRoute } from 'next';
import { CASE_STUDIES } from '@/lib/work';

const baseUrl = 'https://zeptaz.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/services',
    '/work',
    '/products/voice-agent',
    '/engine',
    '/process',
    '/pricing',
    '/blog',
    '/about',
    '/contact',
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: route === '/blog' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '' ? 1 : route === '/work' ? 0.9 : 0.7,
    })),
    ...CASE_STUDIES.map(({ slug }) => ({
      url: `${baseUrl}/work/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
