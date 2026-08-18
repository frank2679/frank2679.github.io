import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ?? new URL('https://frank2679.github.io');
  const posts = (await getCollection('blog'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const items = posts.map((post) => {
    const url = new URL(`/blog/${post.id}`, baseUrl).href;
    return `\n    <item>\n      <title>${escapeXml(post.data.title)}</title>\n      <link>${url}</link>\n      <guid isPermaLink="true">${url}</guid>\n      <description>${escapeXml(post.data.description)}</description>\n      <pubDate>${post.data.date.toUTCString()}</pubDate>\n    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Frank Young — Blog</title>\n    <link>${baseUrl.href}</link>\n    <description>Technical writing on HPC, C++, AI acceleration, and engineering.</description>\n    <language>en</language>${items}\n  </channel>\n</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
