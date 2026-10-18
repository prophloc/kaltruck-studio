import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const origin = process.env.PUBLIC_SITE_URL;
assert.ok(origin && origin.startsWith('https://'), 'Provide a test-only HTTPS PUBLIC_SITE_URL');
const src = (path) => readFileSync(join('dist', path), 'utf8');
const pages = [
  { path:'', url:'/', types:['LocalBusiness','WebSite','WebPage'] },
  { path:'o-nas/index.html', url:'/o-nas/', types:['LocalBusiness','WebSite','WebPage','BreadcrumbList'] },
  { path:'sprzet/index.html', url:'/sprzet/', types:['LocalBusiness','WebSite','WebPage','BreadcrumbList'] },
  { path:'realizacje/index.html', url:'/realizacje/', types:['LocalBusiness','WebSite','WebPage','BreadcrumbList'] },
  { path:'kontakt/index.html', url:'/kontakt/', types:['LocalBusiness','WebSite','WebPage','BreadcrumbList'] },
  ...['transport-hds','transport-kontenerow','transport-maszyn','transport-prefabrykatow','rozladunek-hds','wynajem-hds'].map((slug)=>({
    path:'uslugi/'+slug+'/index.html', url:'/uslugi/'+slug+'/',
    types:['LocalBusiness','WebSite','WebPage','BreadcrumbList','Service','FAQPage'],
  })),
];
pages[0].path='index.html';
const pageTitles=new Set();
const descs=new Set();
for (const item of pages) {
  assert.ok(existsSync(join('dist',item.path)), 'Missing HTML: '+item.path);
  const html=src(item.path);
  const absolute=origin+item.url;
  assert.ok(html.includes('rel="canonical" href="'+absolute+'"'), 'Wrong canonical: '+item.url);
  assert.ok(html.includes('property="og:url" content="'+absolute+'"'), 'Wrong Open Graph URL: '+item.url);
  assert.ok(!html.includes('name="robots" content="noindex'), 'Indexed page is noindex: '+item.url);
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title?.length>20,'Missing title: '+item.url);
  assert.ok(description?.length>85,'Missing descriptive text: '+item.url);
  assert.ok(!pageTitles.has(title),'Duplicated title: '+title);
  assert.ok(!descs.has(description),'Duplicated meta description: '+description);
  pageTitles.add(title);descs.add(description);

  const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m)=>{
    try{return JSON.parse(m[1]);}catch{throw new Error('Invalid JSON-LD at '+item.url);}
  });
  for(const type of item.types) assert.ok(schemas.some((s)=>s['@type']===type),'Missing '+type+' on '+item.url);
  const page=schemas.find(s=>s['@type']==='WebPage');
  assert.equal(page.url,absolute,'Bad WebPage URL for '+item.url);
  if(item.url.startsWith('/uslugi/')){
    const service=schemas.find(s=>s['@type']==='Service');
    assert.equal(service.url,absolute,'Bad service URL');
    assert.equal(service.provider['@id'],origin+'/#firma','Bad service provider');
    const faq=schemas.find(s=>s['@type']==='FAQPage');
    assert.equal(faq.mainEntity.length,3,'Expected three visible FAQ answers');
    assert.ok(html.includes('PYTANIA I ODPOWIEDZI'),'FAQ must be visible to users');
  }
  console.log('SEO OK:',item.url,item.types.join(','));
}
const sitemap=src('sitemap.xml');
for(const page of pages) assert.ok(sitemap.includes('<loc>'+origin+page.url+'</loc>'),'Missing sitemap URL '+page.url);
assert.ok(!sitemap.includes('localhost'),'Sitemap must not use localhost');
const robots=src('robots.txt');
assert.ok(robots.includes('Allow: /'),'Production robot indexing disallowed');
assert.ok(robots.includes('Sitemap: '+origin+'/sitemap.xml'),'Sitemap link mismatch');
console.log('SEO production-build checks passed for',pages.length,'unique pages');
