import { site, services } from '../data/site';
export function GET() {
  const paths = ['/', '/realizacje/', '/o-nas/', '/kontakt/', ...services.map(s => '/uslugi/' + s.slug + '/')];
  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    (site.url ? paths.map(path => '<url><loc>' + site.url + path + '</loc></url>').join('') : '') +
    '</urlset>';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
