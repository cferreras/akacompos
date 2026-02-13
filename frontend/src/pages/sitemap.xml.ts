import { getCompositions } from '../lib/strapi';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.href : 'https://akacompos.com/';

  const { data: compositions } = await getCompositions();

  const pages = [
    '',
    'compositions',
  ];

  const compositionUrls = compositions
    ? compositions.map((c: any) => `compositions/${c.slug}`)
    : [];

  const allPages = [...pages, ...compositionUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((url) => `  <url>
    <loc>${new URL(url, baseUrl).href}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
