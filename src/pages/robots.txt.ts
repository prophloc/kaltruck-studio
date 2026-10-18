import { site } from '../data/site';
export function GET() {
  const sitemap = site.url ? 'Sitemap: ' + site.url + '/sitemap.xml\n' : '';
  return new Response('User-agent: *\n' + (site.url ? 'Allow: /\n' : 'Disallow: /\n') + sitemap, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
