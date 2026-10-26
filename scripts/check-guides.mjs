// Run against a production server: node scripts/check-guides.mjs http://localhost:3091
import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://localhost:3091';
const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://logout.nabin.cc';
const slugs = ['before-managing-a-deceased-account', 'download-delete-memorial-differences', 'how-to-read-official-account-guidance'];
const jsonLd = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1])['@graph'] ?? []);
const get = async path => {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, path);
  return response.text();
};
const titles = new Set();
const descriptions = new Set();
for (const path of ['/guides', ...slugs.map(slug => `/guides/${slug}`)]) {
  const html = await get(path);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${path}: single H1`);
  assert.ok(html.includes(`<link rel="canonical" href="${origin}${path}"`), `${path}: canonical`);
  assert.ok(html.includes(`property="og:url" content="${origin}${path}"`), `${path}: OG URL`);
  for (const name of ['og:title', 'og:description', 'og:image', 'twitter:title', 'twitter:description', 'twitter:image']) assert.ok(html.includes(`="${name}"`), `${path}: ${name}`);
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
  assert.ok(!html.includes(`${origin}/en/guides`), 'no nonexistent English alternate');
  assert.ok(!html.includes('name="robots" content="noindex'), 'indexable');
  assert.ok(html.includes('href="/#start"'), 'wizard CTA');
  titles.add(html.match(/<title>(.*?)<\/title>/)?.[1]);
  descriptions.add(html.match(/<meta name="description" content="([^"]*)"/)?.[1]);
  const graph = jsonLd(html);
  assert.equal(graph.filter(node => node['@type'] === 'Organization').length, 1, 'reuse root Organization');
  assert.equal(graph.filter(node => node['@type'] === 'WebSite').length, 1, 'reuse root WebSite');
  assert.ok(graph.some(node => node['@type'] === 'BreadcrumbList'));
  assert.ok(!html.includes('qa-draft'));
  if (path !== '/guides') {
    const page = graph.find(node => Array.isArray(node['@type']) && node['@type'].includes('FAQPage'));
    assert.ok(page, 'FAQPage emitted');
    assert.ok(page['@type'].includes('WebPage'));
    for (const item of page.mainEntity) {
      assert.ok(html.includes(`<h3>${item.name}</h3>`), 'FAQ question rendered in server HTML');
      assert.ok(html.includes(`<p>${item.acceptedAnswer.text}</p>`), 'FAQ answer matches schema');
    }
    const article = graph.find(node => node['@type'] === 'BlogPosting');
    assert.ok(html.includes(`>${article.abstract}</p>`), 'direct-answer summary in server HTML');
    assert.ok(html.includes('이 글에서 알아볼 내용'), 'TOC');
    assert.ok(html.includes('함께 읽으면 좋은 가이드'), 'related guides');
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `TOC target ${match[1]}`);
  }
  console.log(`PASS ${path}: SSR, metadata, JSON-LD, headings, FAQ/links`);
}
assert.equal(titles.size, 4, 'unique titles');
assert.equal(descriptions.size, 4, 'unique descriptions');
const sitemap = await get('/sitemap.xml');
const llms = await get('/llms.txt');
for (const path of ['/guides', ...slugs.map(slug => `/guides/${slug}`)]) {
  assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`), 'guide in sitemap');
  assert.ok(llms.includes(`${origin}${path}`), 'guide in llms.txt');
}
assert.match(sitemap, /<lastmod>2026-10-26(?:T00:00:00\.000Z)?<\/lastmod>/);
assert.ok(!sitemap.includes('qa-draft') && !llms.includes('qa-draft'));
const robots = await get('/robots.txt');
assert.ok(robots.includes('Allow: /'));
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
for (const path of ['/guides/qa-draft', '/guides/does-not-exist', '/en/guides']) assert.equal((await fetch(`${base}${path}`)).status, 404, path);
console.log('PASS sitemap, robots, llms.txt, draft and unknown route 404');
