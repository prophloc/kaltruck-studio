import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');

test('website contains all main routes', () => {
  for (const p of [
    'src/pages/index.astro',
    'src/pages/o-nas.astro',
    'src/pages/sprzet.astro',
    'src/pages/kontakt.astro',
    'src/pages/realizacje.astro',
    'src/pages/uslugi/[slug].astro'
  ]) assert.ok(existsSync(p), p + ' must exist');
});

test('six separate services have unique slugs', () => {
  const data = read('src/data/site.ts');
  const slugs = [...data.matchAll(/slug:\s*'([^']+)'/g)].map(match => match[1]);
  assert.equal(slugs.length, 6);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('SEO has canonical rules, index protection and structured data', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  assert.match(layout, /rel="canonical"/);
  assert.match(layout, /noindex,nofollow/);
  assert.match(layout, /application\/ld\+json/);
  assert.ok(existsSync('src/pages/sitemap.xml.ts'));
  assert.ok(existsSync('src/pages/robots.txt.ts'));
});

test('gallery supports filtering, fullscreen and keyboard navigation', () => {
  const gallery = read('src/pages/realizacje.astro');
  assert.match(gallery, /data-filter/);
  assert.match(gallery, /showModal/);
  assert.match(gallery, /ArrowRight/);
  assert.match(gallery, /ArrowLeft/);
  assert.match(gallery, /aria-label="Zamknij galerię"/);
});

test('contact uses mailto and never pretends to send to a server', () => {
  const contact = read('src/pages/kontakt.astro');
  assert.match(contact, /mailto:/);
  assert.match(contact, /encodeURIComponent/);
  assert.match(contact, /reportValidity/);
  assert.doesNotMatch(contact, /fetch\(/);
});

test('Studio homepage follows Premium section order without changing menu or hero', () => {
  const homepage = read('src/pages/index.astro');
  const header = read('src/layouts/BaseLayout.astro');
  const order = [
    '<CapabilityStrip />',
    'id="o-nas"',
    'class="ps-service-stories"',
    '<EquipmentSection />',
    '<ProcessSteps />',
    '<FAQSection />',
    '<CTASection />'
  ];
  let previous = -1;
  for (const step of order) {
    const pos = homepage.indexOf(step);
    assert.ok(pos > previous, step + ' must follow prior sections');
    previous = pos;
  }
  assert.equal((homepage.match(/<ServiceStory\b/g) || []).length, 5);
  assert.equal((homepage.match(/\n        reverse\n/g) || []).length, 2);
  assert.match(homepage, /src="https:\/\/raw\.githubusercontent\.com\/prophloc\/kaltruck-premium\/main\/public\/images\/home\/hero-hds-original\.png"/);
  assert.match(homepage, /CIĘŻKIE ZADANIA\./);
  assert.match(homepage, /PEWNE <strong class="home-hero__accent">ROZWIĄZANIA\.<\/strong>/);
  assert.match(homepage, /home-hero__photo/);
  assert.match(homepage, /home-hero__actions/);
  assert.match(header, /class="site-header home-header"/);
  assert.match(header, /href="\/#uslugi"/);
  assert.doesNotMatch(homepage, /class="service-grid"/);
  assert.doesNotMatch(homepage, /class="proof-grid"/);
  assert.match(read('src/styles/premium-layout.css'), /ps-story--reverse/);
  assert.match(read('src/styles/premium-layout.css'), /var\(--green/);
});

test('homepage uses original-quality full-width photograph and integrated navigation', () => {
  const homepage = read('src/pages/index.astro');
  const layout = read('src/layouts/BaseLayout.astro');
  const styles = read('src/styles/hero.css');
  assert.match(homepage, /home-hero__photo/);
  assert.match(homepage, /hero-hds-original\.png/);
  assert.doesNotMatch(homepage, /hero-hds-kaltruck\.webp/);
  assert.match(layout, /home-header/);
  assert.match(styles, /object-fit:\s*cover/);
  assert.match(styles, /linear-gradient/);
  assert.match(styles, /prefers-reduced-motion/);
});

test('Premium-inspired service stories link only to available service routes', () => {
  const homepage = read('src/pages/index.astro');
  for (const slug of ["transport-kontenerow","transport-prefabrykatow","transport-maszyn","rozladunek-hds","transport-hds"]) {
    assert.match(homepage, new RegExp('href="/uslugi/' + slug + '/"'));
    assert.match(read('src/data/site.ts'), new RegExp("slug: '" + slug + "'"));
  }
});

test('common header uses authentic logo, current phone and arrow-free services', () => {
 const layout = read('src/layouts/BaseLayout.astro');
 assert.match(layout, /src="\/brand\/kaltruck-logo\.svg"/);
 assert.match(layout, /data-studio-services/);
 assert.match(layout, /class="studio-header-contacts"/);
 assert.match(layout, /site\.phoneHref/);
 assert.match(layout, />Usługi<\/a>/);
 assert.doesNotMatch(layout, /Usługi ⌄/);
 assert.match(read('src/styles/header-unified.css'), /site-header\.home-header/);
});

test('hero Google tools show real lazy panels and a fallback without API credentials', () => {
  const home = read('src/pages/index.astro');
  const panel = read('src/components/studio/HeroTools.astro');
  const route = read('src/components/studio/DistanceEstimator.astro');
  const reviews = read('src/components/studio/GoogleReviews.astro');
  const layout = read('src/layouts/BaseLayout.astro');
  assert.match(home, /<HeroTools\s*\/>/);
  assert.match(panel, /data-studio-tool="route"/);
  assert.match(panel, /data-studio-tool="reviews"/);
  assert.match(panel, /kaltruck:route-activate/);
  assert.match(panel, /kaltruck:reviews-activate/);
  assert.match(route, /google\.com\/maps\/dir/);
  assert.match(route, /if \(!apiKey\)/);
  assert.match(reviews, /fetchFields/);
  assert.match(reviews, /!apiKey \|\| !placeId/);
  assert.match(reviews, /Zobacz opinie w Google Maps/);
  assert.match(layout, /studio-footer-route/);
});

test('process cards use readable titles and meaningful steps', () => {
  const steps = read('src/components/studio/ProcessSteps.astro');
  const css = read('src/styles/premium-layout.css');
  assert.match(steps, /Wyślij szczegóły/);
  assert.match(steps, /Sprawdzimy warunki/);
  assert.match(steps, /Ustalimy plan/);
  assert.match(steps, /Zrealizujemy zlecenie/);
  assert.match(css, /letter-spacing:-\.025em/);
  assert.match(css, /line-height:1\.30/);
});

test('scrolled header stays dark and accessible across subpages', () => {
 const css = read('src/styles/header-unified.css');
 assert.match(css, /\.site-header\.home-header\.scrolled\s*\{/);
 assert.match(css, /background:rgba\(10,25,27,\.74\)/);
 assert.match(css, /\.site-header\.home-header \.desktop-nav > a/);
 assert.match(css, /color:#fff;/);
 assert.match(css, /\.site-header\.home-header \.studio-brand-logo\s*\{/);
 assert.match(css, /filter:invert\(1\)/);
});
test('map has no unbounded SVG ornament and uses contrasting panel labels', () => {
 const map = read('src/components/studio/DistanceEstimator.astro');
 assert.doesNotMatch(map, /<GoogleMapsPin/);
 assert.match(map, /google-route-heading-logo/);
 const css = read('src/styles/footer-refresh.css');
 assert.match(css, /\.studio-footer-route \.google-route-heading h2\{color:#1b3224/);
 assert.match(css, /\.studio-footer-route \.google-route-form input\{background:#fff;color:#183020/);
});

test('map OD/DO labels use theme lime and headings stay dark on cream', () => {
 const map=read('src/components/studio/DistanceEstimator.astro');
 const footer=read('src/styles/footer-refresh.css');
 assert.match(map, /\.google-route\.google-route--drawer \.google-route-point/);
 assert.match(map, /background:var\(--green\);color:var\(--forest\)/);
 assert.doesNotMatch(map, /#d9ba68|#ede2c9|#6d5117/);
 assert.match(footer, /\.studio-footer-route \.google-route-point\{background:var\(--green\)/);
});
test('homepage header overlays hero and ROZWIĄZANIA uses brand lime', () => {
 const home=read('src/pages/index.astro');
 const hero=read('src/styles/hero.css');
 const header=read('src/styles/header-unified.css');
 const layout=read('src/layouts/BaseLayout.astro');
 assert.match(home, /<strong class="home-hero__accent">ROZWIĄZANIA\.<\/strong>/);
 assert.match(hero, /\.home-hero__title \.home-hero__accent \{ color:var\(--green\)/);
 assert.match(layout, /data-home=\{isHome \? "true" : "false"\}/);
 assert.match(header, /\.site-header\.home-header\[data-home="true"\]:not\(\.scrolled\)/);
});

test('process card text is visually centered in both axes', () => {
 const css=read('src/styles/premium-layout.css');
 assert.match(css, /\.ps-process__step\s*\{\s*position:relative;\s*display:grid;\s*place-items:center;/);
 assert.match(css, /\.ps-process__step > div\s*\{[\s\S]*?align-items:center;[\s\S]*?justify-content:center;/);
 assert.match(css, /\.ps-process__step h3\s*\{[\s\S]*?text-align:center;/);
 assert.match(css, /\.ps-process__step p\s*\{[\s\S]*?text-align:center;/);
});
test('menu glass background and readable animated dropdown on all pages', () => {
 const css=read('src/styles/header-unified.css');
 assert.match(css, /background:linear-gradient\(180deg,rgba\(8,16,18,\.38\),rgba\(8,16,18,\.10\)\)/);
 assert.match(css, /background:rgba\(10,25,27,\.74\)/);
 assert.match(css, /\.desktop-nav \.dropdown:is\(:hover,:focus-within\) \.dropdown-list/);
 assert.match(css, /\.dropdown-list > a,\s*\.site-header\.home-header\.scrolled \.desktop-nav \.dropdown-list > a/);
 assert.match(css, /background:#faf9f3;/);
 assert.match(css, /color:#183020;/);
 assert.match(css, /background:var\(--green\);/);
 assert.match(css, /pointer-events:none/);
 assert.match(css, /visibility:hidden/);
 assert.match(css, /opacity:0/);
});

test('services anchor uses a single sticky-header offset without blank strip', () => {
 const css=read('src/styles/premium-layout.css');
 const global=read('src/styles/global.css');
 assert.match(global, /scroll-padding-top:88px/);
 assert.match(css, /#uslugi\.ps-service-stories\s*\{scroll-margin-top:20px;\}/);
});
test('process badge numbers and lines use the actual theme lime', () => {
 const css=read('src/styles/premium-layout.css');
 assert.match(css, /\.ps-process__step \.ps-process__step-top > span\s*\{[\s\S]*?background:var\(--green\);/);
 assert.match(css, /\.ps-process__step \.ps-process__step-top > i\s*\{[\s\S]*?linear-gradient\(90deg,var\(--green\)/);
});

test('exactly one lime highlighted key word appears in each of five photo stories', () => {
 const home=read('src/pages/index.astro');
 const story=read('src/components/studio/ServiceStory.astro');
 const css=read('src/styles/premium-layout.css');
 const expected=['Kontenery','Prefabrykaty','Maszyny','Ustawiamy','Nietypowy'];
 const found=[...home.matchAll(/highlight="([^"]+)"/g)].map(x=>x[1]);
 assert.deepEqual(found,expected);
 assert.match(story, /hasHighlight && <span class="ps-story__highlight">\{highlight\}<\/span>/);
 assert.match(story, /title\.indexOf\(highlight\)/);
 for (const word of expected) assert.match(home,new RegExp('highlight="' + word + '"'));
 assert.match(css, /\.ps-story__copy h2 \.ps-story__highlight\s*\{[\s\S]*?font-family:'DM Sans'[\s\S]*?color:#86ab46;[\s\S]*?background:none;/);
});

test('services dropdown uses exactly the same cream surface as Google Maps drawer', () => {
 const css=read('src/styles/header-unified.css');
 const map=read('src/components/studio/DistanceEstimator.astro');
 const menu=css.match(/\.site-header\.home-header \.desktop-nav \.dropdown-list\s*\{([\s\S]*?)\n\}/);
 assert.ok(menu,'menu dropdown CSS block must exist');
 assert.match(menu[1], /background:#faf9f3;/);
 assert.match(map, /\.google-route--drawer\{[^\n]*background:#faf9f3;/);
 assert.match(css, /\.desktop-nav \.dropdown-list > a,[\s\S]*?color:#183020;/);
 assert.match(css, /\.dropdown-list > a:hover,[\s\S]*?background:var\(--green\);/);
});

test('no bright bar below scrolled menu and no extra services anchor gap', () => {
 const menu=read('src/styles/header-unified.css');
 const global=read('src/styles/global.css');
 assert.match(menu, /\.site-header\.home-header\.scrolled\{\s*background:rgba\(10,25,27,\.90\);/);
 assert.match(menu, /backdrop-filter:none;/);
 assert.match(global, /html:has\(#uslugi\.ps-service-stories:target\)\{scroll-padding-top:0;\}/);
});
test('photo-story words have no dark backing, both closing taglines use Manrope', () => {
 const story=read('src/styles/premium-layout.css');
 const footer=read('src/styles/footer-refresh.css');
 const cta=read('src/components/studio/CTASection.astro');
 assert.match(story, /\.ps-story__copy h2 \.ps-story__highlight\s*\{[\s\S]*?background:none;/);
 assert.match(cta, /<span class="ps-cta__closing-line">My zajmiemy się resztą\.<\/span>/);
 assert.match(story, /\.ps-cta__copy h2 \.ps-cta__closing-line\s*\{[\s\S]*?font-family:'Manrope'/);
 assert.match(footer, /\.studio-footer__contact-copy h2 em\s*\{[\s\S]*?font-family:'Manrope'/);
});

test('review drawer has authentic brand logo and keeps live Google Places API fetch', () => {
 const reviews=read('src/components/studio/GoogleReviews.astro');
 assert.match(reviews, /class="google-reviews-brand" src="\/brand\/kaltruck-logo\.svg"/);
 assert.doesNotMatch(reviews, /Co mówią o KALTRUCK/);
 assert.match(reviews, /place\.fetchFields\(\{ fields: \['displayName', 'rating', 'userRatingCount', 'reviews', 'googleMapsURI'\]/);
 assert.match(reviews, /PUBLIC_GOOGLE_MAPS_API_KEY/);
 assert.match(reviews, /kaltruck:reviews-activate/);
});
test('route handle uses same Google Maps pin as Premium, scaled down', () => {
 const hero=read('src/components/studio/HeroTools.astro');
 const pin=read('src/components/studio/GoogleMapsPin.astro');
 assert.match(hero, /<GoogleMapsPin class="studio-hero-tool__pin" \/>/);
 assert.match(hero, /:global\(\.studio-hero-tool__pin\)\{display:block;width:20px;height:24px/);
 assert.match(pin, /data-google-maps-pin/);
 assert.match(pin, /data:image\/png;base64/);
});

test('Premium child Google Maps icon styling uses Astro global class scope', () => {
 const hero=read('src/components/studio/HeroTools.astro');
 assert.match(hero, /:global\(\.studio-hero-tool__pin\)\{display:block;width:20px;height:24px/);
 assert.match(hero, /\.studio-hero-tool__toggle\{display:none;\}/);
});

test('reviews header aligns kicker left, larger centered logo, attribution right', () => {
  const src=read('src/components/studio/GoogleReviews.astro');
  assert.match(src, /<div class="google-reviews-head">\s*<p class="google-reviews-kicker">OPINIE KLIENTÓW<\/p>\s*<img class="google-reviews-brand"/);
  assert.match(src, /grid-template-columns:minmax\(0,1fr\) minmax\(0,220px\) minmax\(0,1fr\)/);
  assert.match(src, /\.google-reviews-brand\{display:block;justify-self:center;width:215px/);
  assert.match(src, /\.google-reviews-attribution\{display:inline-flex;justify-self:end/);
  assert.match(src, /@media\(max-width:620px\)/);
  assert.match(src, /place\.fetchFields/);
});

test('Google Maps wordmark replaces route caption on both route panels', () => {
  const route=read('src/components/studio/DistanceEstimator.astro');
  assert.match(route, /src="\/brand\/google-maps-wordmark\.svg"/);
  assert.match(route, /class="google-route-heading-logo"/);
  assert.doesNotMatch(route, /google-route-heading-caption/);
  assert.ok(existsSync('public/brand/google-maps-wordmark.svg'));
  assert.match(read('public/brand/google-maps-wordmark.svg'), /viewBox="0 0 1000 185\.335"/);
});
test('Google reviews logo has five stars and the drawer star goes gold on open', () => {
  const reviews=read('src/components/studio/GoogleReviews.astro');
  const tools=read('src/components/studio/HeroTools.astro');
  assert.match(reviews, /src="\/brand\/google-reviews-stars\.svg"/);
  assert.match(reviews, /aria-label="Otwórz opinie KALTRUCK w Google Maps"/);
  assert.ok(existsSync('public/brand/google-reviews-stars.svg'));
  assert.match(tools, /class="studio-hero-tool__star"/);
  assert.match(tools, /\.studio-hero-tool--reviews\.is-open \.studio-hero-tool__star\{color:#e1aa2f/);
  assert.match(tools, /\[aria-expanded="true"\] \.studio-hero-tool__star\{color:#e1aa2f/);
  assert.match(reviews, /place\.fetchFields/);
});

test('Google Maps wordmark is baseline aligned in hero drawer and footer', () => {
  const route=read('src/components/studio/DistanceEstimator.astro');
  const footer=read('src/styles/footer-refresh.css');
  assert.match(route, /\.google-route-heading\{display:flex;align-items:baseline;/);
  assert.match(route, /\.google-route-heading-logo\{display:block;position:relative;top:4px;/);
  assert.match(route, /align-self:baseline;/);
  assert.match(footer, /\.studio-footer-route \.google-route-heading\{[^\n]*align-items:baseline/);
});
test('review logo has real transparent letter counters, not solid fills', () => {
  const asset=read('public/brand/google-reviews-stars.svg');
  assert.match(asset, /fill-rule="evenodd"/);
  assert.match(asset, /aria-label="Google i pięć gwiazdek"/);
  assert.equal((asset.match(/fill-rule="evenodd"/g)||[]).length,4);
  assert.equal((asset.match(/M\d+,\d+/g)||[]).length,15);
});

test('green individual service words use distinct DM Sans, no outline or shadow', () => {
  const css=read('src/styles/premium-layout.css');
  const start=css.indexOf('.ps-story__copy h2 .ps-story__highlight {');
  assert.ok(start>=0);
  const block=css.slice(start,css.indexOf('}',start)+1);
  assert.match(block,/font-family:'DM Sans'/);
  assert.match(block,/font-weight:800/);
  assert.match(block,/color:#86ab46/);
  assert.match(block,/-webkit-text-stroke:0/);
  assert.match(block,/text-shadow:none/);
  assert.doesNotMatch(block,/font:inherit/);
});

test('O nas hero uses two deliberate lines and lime second line', () => {
 const page=read('src/pages/o-nas.astro');
 assert.match(page, /<h1 class="about-hero-title"><span>Transport<\/span><span class="about-hero-title__accent">z charakterem\.<\/span><\/h1>/);
 assert.match(page, /\.about-hero-title__accent\{color:var\(--green\)/);
 assert.match(page, /\.about-hero-title>span\{display:block;max-width:100%;white-space:nowrap/);
});
test('Sprzęt route exists in desktop, mobile, footer and sitemap', () => {
 const layout=read('src/layouts/BaseLayout.astro');
 const sitemap=read('src/pages/sitemap.xml.ts');
 const page=read('src/pages/sprzet.astro');
 assert.match(layout, /href="\/sprzet\/" aria-current=\{path === '\/sprzet\/'/);
 assert.equal(layout.split('href="/sprzet/"').length-1, 2);
 assert.ok(read('src/components/studio/PremiumFooter.astro').includes('href="/sprzet/"'));
 assert.match(sitemap, /'\/sprzet\/'/);
 assert.match(page, /do 12 ton|12 t/);
 assert.match(page, /14 m/);
 assert.match(page, /masy, zasięgu i warunków pracy/);
});


test('browser favicon uses cropped genuine KALTRUCK vector emblem',()=>{
 const layout=read('src/layouts/BaseLayout.astro');
 const favicon=read('public/favicon.svg');
 const manifest=JSON.parse(read('public/site.webmanifest'));
 assert.match(layout,/rel="icon" type="image\/svg\+xml" href="\/favicon\.svg"/);
 assert.match(layout,/rel="manifest" href="\/site\.webmanifest"/);
 assert.match(favicon,/viewBox="205 305 835 835"/);
 assert.match(favicon,/fill="#11251d"/);
 assert.ok((favicon.match(/<path /g)||[]).length>=4);
 assert.equal(manifest.icons[0].src,'/favicon.svg');
});
test('Open Graph uses full-quality original truck photograph from hdsplock material',()=>{
 const layout=read('src/layouts/BaseLayout.astro');
 assert.match(read('src/lib/seo.ts'),/export const defaultOgImage = 'https:\/\/raw\.githubusercontent\.com\/prophloc\/kaltruck-premium\/main\/public\/images\/home\/hero-hds-original\.png'/);
 assert.match(layout,/name="twitter:card" content="summary_large_image"/);
 assert.match(layout,/property="og:image:width" content="1672"/);
 assert.match(layout,/property="og:image:height" content="941"/);
 assert.match(layout,/name="twitter:image" content=\{ogImage\}/);
});

test('favicon SVG is namespace-safe and contains no unbound Serif prefixes',()=>{
 const icon=read('public/favicon.svg');
 assert.doesNotMatch(icon,/serif:id/);
 assert.match(icon,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
 assert.match(icon,/<g id="Layer-1">/);
});

test('single highlighted words use softer green than global lime with no background',()=>{
 const css=read('src/styles/premium-layout.css');
 const globals=read('src/styles/global.css');
 const start=css.indexOf('.ps-story__copy h2 .ps-story__highlight {');
 assert.ok(start>=0);
 const block=css.slice(start,css.indexOf('}',start)+1);
 assert.match(globals,/--green:#c8ef72/);
 assert.match(block,/color:#86ab46/);
 assert.match(block,/background:none/);
 assert.match(block,/text-shadow:none/);
 assert.match(block,/-webkit-text-stroke:0/);
});
test('route wordmark shifts two pixels and service accents use softer Studio green',()=>{
 const route=read('src/components/studio/DistanceEstimator.astro');
 const css=read('src/styles/premium-layout.css');
 const start=css.indexOf('.ps-story__copy h2 .ps-story__highlight {');
 assert.ok(start>=0);
 const block=css.slice(start,css.indexOf('}',start)+1);
 assert.match(route,/\.google-route-heading-logo\{display:block;position:relative;top:4px;/);
 assert.match(block,/color:#86ab46;/);
 assert.match(block,/background:none;/);
 assert.doesNotMatch(block,/color:var\(--green\)/);
});


test('advanced reusable SEO module emits verifiable business, page, service and breadcrumbs',()=>{
 const seo=read('src/lib/seo.ts');
 const layout=read('src/layouts/BaseLayout.astro');
 const service=read('src/pages/uslugi/[slug].astro');
 assert.match(seo,/export function localBusinessSchema\(\)/);
 assert.match(seo,/streetAddress: 'Tokarska 40'/);
 assert.match(seo,/postalCode: '09-401'/);
 assert.match(seo,/hasMap: mapsLocation/);
 assert.match(seo,/hasOfferCatalog:/);
 assert.match(seo,/export function websiteSchema\(\)/);
 assert.match(seo,/export function webpageSchema\(/);
 assert.match(seo,/export function breadcrumbSchema\(/);
 assert.match(seo,/export function serviceSchema\(/);
 assert.match(layout,/buildPageSchemas\(path, title, description, ogImage/);
 assert.match(layout,/schemas\.map\(\(schema\) => <script type="application\/ld\+json"/);
 assert.match(service,/jsonLd=\{serviceJsonLd\}/);
 assert.match(service,/seo\.title/);
 assert.match(service,/seo\.description/);
 assert.match(seo,/if \(!site\.url\) return \[\]/);
});
test('each of six individual services has distinct SEO title and description',()=>{
 const seo=read('src/lib/seo.ts');
 const serviceMeta=seo.slice(seo.indexOf('export const serviceSeo:'),seo.indexOf('export function breadcrumbsFor'));
 const title=[...serviceMeta.matchAll(/title: '([^']+)'.*$/gm)].map(x=>x[1]);
 const descriptions=[...serviceMeta.matchAll(/description: '([^']+)'/g)].map(x=>x[1]);
 assert.equal(title.length,6);
 assert.equal(new Set(title).size,6);
 assert.equal(descriptions.length,6);
 assert.equal(new Set(descriptions).size,6);
});
test('service photographs declare correct Open Graph MIME type',()=>{
 const layout=read('src/layouts/BaseLayout.astro');
 assert.match(layout,/image\/webp/);
 assert.match(layout,/image\/jpeg/);
 assert.match(layout,/image\/png/);
 assert.match(layout,/defaultImage && <meta property="og:image:width" content="1672"/);
});

test('every service has its own useful guide with preparation and visible FAQs',()=>{
 const guides=read('src/data/service-guides.ts');
 const page=read('src/pages/uslugi/[slug].astro');
 const slugs=[...read('src/data/site.ts').matchAll(/slug: '([^']+)'/g)].map(x=>x[1]);
 for (const slug of slugs) assert.match(guides, new RegExp("'"+slug+"': \\{"));
 assert.match(page,/guide\.preparation\.map/);
 assert.match(page,/guide\.faq\.map/);
 assert.match(page,/<details>/);
 assert.match(page,/faqSchema\(guide\.faq\)/);
 assert.match(page,/href="\/realizacje\/"/);
});

test('CI verifies actual generated SEO pages, schema and indexable canonical URLs',()=>{
 const ci=read('.github/workflows/ci.yml');
 const script=read('scripts/verify-seo-build.mjs');
 const packageInfo=JSON.parse(read('package.json'));
 assert.match(ci,/PUBLIC_SITE_URL: https:\/\/studio-seo-ci\.example\.invalid/);
 assert.match(ci,/npm run test:seo:build/);
 assert.equal(packageInfo.scripts['test:seo:build'],'node scripts/verify-seo-build.mjs');
 assert.match(script,/LocalBusiness/);
 assert.match(script,/BreadcrumbList/);
 assert.match(script,/FAQPage/);
 assert.match(script,/sitemap\.xml/);
 assert.match(script,/robots\.txt/);
 assert.match(script,/Duplicated title/);
});


test('Premium footer uses original twelve-column composition without removing Studio map or CTA', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  const premium = read('src/components/studio/PremiumFooter.astro');
  const studioCss = read('src/styles/footer-refresh.css');
  assert.ok(layout.includes("import PremiumFooter from '../components/studio/PremiumFooter.astro'"));
  assert.ok(layout.includes('<section class="footer studio-footer"'));
  assert.ok(layout.includes('class="studio-footer-route"'));
  assert.ok(layout.includes('class="studio-footer__contact"'));
  assert.ok(layout.includes('<PremiumFooter />'));
  assert.ok(!layout.includes('studio-footer__lower'));
  assert.ok(!studioCss.includes('.studio-footer__lower{'));
  assert.ok(premium.includes('<footer class="site-footer"'));
  assert.ok(premium.includes('background:#060708'));
  assert.ok(premium.includes('grid-template-columns:repeat(12,minmax(0,1fr))'));
  assert.ok(premium.includes('.footer-brand{grid-column:1/span 5;'));
  assert.ok(premium.includes('.footer-links-wrap{grid-column:6/span 2;'));
  assert.ok(premium.includes('.footer-contact{grid-column:9/-1;'));
  assert.ok(premium.includes('width:clamp(280px,19vw,320px)'));
  assert.ok(premium.includes('CIĘŻKI ŁADUNEK... PRECYZYJNA ROBOTA.'));
  assert.ok(premium.includes('class="container footer-bottom"'));
});

test('Premium footer has valid real contacts, navigation and social profiles across breakpoints', () => {
  const premium = read('src/components/studio/PremiumFooter.astro');
  assert.ok(premium.includes('site.phoneHref'));
  assert.ok(premium.includes('site.nip'));
  assert.ok(premium.includes('site.email'));
  assert.ok(premium.includes('Tokarska 40, 09-401 Płock'));
  assert.ok(premium.includes('class="footer-links"'));
  assert.ok(premium.includes('href="/sprzet/"'));
  assert.ok(premium.includes('facebook.com/profile.php?id=61561070733012'));
  assert.ok(premium.includes('instagram.com/transporthdsplock/'));
  assert.ok(premium.includes('src="/brand/facebook-icon.svg"'));
  assert.ok(premium.includes('src="/brand/instagram-icon.svg"'));
  assert.ok(premium.includes('@media(max-width:760px)'));
  assert.ok(premium.includes('grid-template-columns:1fr 1fr'));
});

test('Premium footer headings align on one horizontal line with normal phone typography',()=>{
 const footer=read('src/components/studio/PremiumFooter.astro');
 assert.ok(footer.includes('.footer-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:var(--grid-gap);align-items:start;'));
 assert.ok(footer.includes('.footer-links-wrap{grid-column:6/span 2;align-self:start;}'));
 assert.ok(footer.includes('.footer-contact{grid-column:9/-1;align-self:start;}'));
 assert.ok(footer.includes('.footer-phone{color:#e7e4de!important;font-size:.94rem;font-weight:700;letter-spacing:normal;}'));
 assert.ok(footer.includes('NIP: {site.nip}'));
});
test('mobile Maps and reviews move into compact navigation instead of side tabs',()=>{
 const nav=read('src/layouts/BaseLayout.astro');
 const header=read('src/styles/header-unified.css');
 const panels=read('src/components/studio/HeroTools.astro');
 assert.ok(nav.includes('data-studio-mobile-panel="route"'));
 assert.ok(nav.includes('data-studio-mobile-panel="reviews"'));
 assert.ok(header.includes('.mobile-nav__tools'));
 assert.ok(panels.includes('document.querySelectorAll(\'[data-studio-mobile-panel]\')'));
 assert.ok(panels.includes('new URLSearchParams(window.location.search)'));
 assert.ok(panels.includes('if (panel && openTool(panel)) event.preventDefault()'));
 assert.ok(panels.includes('.studio-hero-tool__toggle{display:none;}'));
 assert.ok(panels.includes('data-studio-panel-close'));
 assert.ok(panels.includes('position:fixed;left:0;right:0;top:auto;bottom:0;'));
});
test('gallery headline has one-line To nasza praca and bright-green praca',()=>{
 const gallery=read('src/pages/realizacje.astro');
 assert.ok(gallery.includes('class="gallery-hero-title__first">To nasza <strong>praca.</strong>'));
 assert.ok(gallery.includes('class="gallery-hero-title__second">Na zdjęciach.</span>'));
 assert.ok(gallery.includes('.gallery-hero-title__first{display:block;white-space:nowrap;'));
 assert.ok(gallery.includes('.gallery-hero-title__first strong{color:var(--green)'));
});

test('mobile tools escape hero overflow and gallery headline uses valid typography rules',()=>{
 const tools=read('src/components/studio/HeroTools.astro');
 const gallery=read('src/pages/realizacje.astro');
 assert.ok(tools.includes("window.matchMedia('(max-width:800px)')"));
 assert.ok(tools.includes('mobileLayout.matches ? document.body : homeHero'));
 assert.ok(tools.includes("mobileLayout.addEventListener('change', syncToolContainers)"));
 assert.ok(gallery.includes('font-family:inherit;font-weight:800;letter-spacing:-.067em;'));
 assert.ok(!gallery.includes('font:800 inherit'));
});

test('20px service anchor correction, active menu sections and individual service links',()=>{
 const layout=read('src/layouts/BaseLayout.astro');
 const style=read('src/styles/premium-layout.css');
 const header=read('src/styles/header-unified.css');
 assert.match(style, /#uslugi\.ps-service-stories\s*\{scroll-margin-top:20px;\}/);
 assert.ok(layout.includes('data-nav-services'));
 assert.ok(layout.includes("link.setAttribute('aria-current', 'location')"));
 assert.ok(layout.includes("window.addEventListener('scroll', updateActiveSection"));
 assert.ok(layout.includes("aria-current={path === '/uslugi/' + s.slug + '/' ? 'page' : undefined}"));
 assert.ok(header.includes('.dropdown-list > a[aria-current="page"]'));
});
test('contact begins at real details without removed introductory hero',()=>{
 const contact=read('src/pages/kontakt.astro');
 const global=read('src/styles/global.css');
 assert.doesNotMatch(contact,/Porozmawiajmy/);
 assert.doesNotMatch(contact,/KONTAKT \/ WYCENA/);
 assert.match(contact,/contact-section--standalone/);
 assert.match(global,/main > \.contact-section--standalone\{padding-top:/);
});
test('only supplied 784 phone is published, with NIP in footer and business schema',()=>{
 const site=read('src/data/site.ts');
 const footer=read('src/components/studio/PremiumFooter.astro');
 const seo=read('src/lib/seo.ts');
 assert.match(site,/phone: '\+48 784 430 022'/);
 assert.match(site,/phoneHref: '\+48784430022'/);
 assert.match(site,/nip: '7742982717'/);
 assert.doesNotMatch(site,/514 948 373|secondPhone/);
 assert.match(footer,/NIP: \{site.nip\}/);
 assert.match(seo,/vatID: site.nip/);
});
test('mobile navigation contains actual Maps and Google review artwork',()=>{
 const layout=read('src/layouts/BaseLayout.astro');
 const css=read('src/styles/header-unified.css');
 assert.match(layout,/src="\/brand\/google-maps-wordmark\.svg"/);
 assert.match(layout,/src="\/brand\/google-reviews-stars\.svg"/);
 assert.match(css,/\.mobile-nav__tool-image--map/);
 assert.match(css,/\.mobile-nav__tool-image--reviews/);
});
test('side tab icon and vertical title have equal edge insets',()=>{
 const tools=read('src/components/studio/HeroTools.astro');
 assert.match(tools,/justify-content:space-between; gap:0; padding:14px 6px;/);
 assert.match(tools,/strong \{writing-mode:vertical-rl;[^\n]*line-height:1;/);
});

test('Studio realization photos mirror every checked-in external photo from 10 Premium projects',()=>{
 const data=read('src/data/realizations.ts');
 const page=read('src/pages/realizacje.astro');
 const entries=[...data.matchAll(/"id": "([0-9]{2})"/g)].map(x=>x[1]);
 const photos=[...data.matchAll(/"https:\/\/hdsplock\.pl\/zdj\/realizacje\/[^"]+\.jpg"/g)].map(x=>x[0]);
 // Each project's primary photograph is also listed in its larger image set.
 assert.equal(entries.length,10);
 assert.ok(photos.length>=76);
 assert.equal(new Set(photos).size,76);
 assert.match(data,/export const galleryByGroup/);
 assert.match(data,/export const realizationGroups/);
 assert.match(page,/realizations\.map/);
 assert.match(page,/project\.images\.length/);
 assert.match(page,/data-start-src/);
});
test('Premium-style category thumbnails navigate into matching gallery and full-photo thumbnail strip',()=>{
 const page=read('src/pages/realizacje.astro');
 assert.match(page,/class="gallery-preview__grid"/);
 assert.match(page,/data-preview-category=\{category\}/);
 assert.match(page,/href="#realization-gallery"/);
 assert.match(page,/selectCategory\(preview\.dataset\.previewCategory/);
 assert.match(page,/data-gallery-thumbs/);
 assert.match(page,/data-gallery-thumb/);
 assert.match(page,/thumbRow\.append\(button\)/);
 assert.match(page,/data-gallery-counter/);
 assert.match(page,/dlg\.showModal\(\)/);
 assert.match(page,/@media\(max-width:980px\)/);
});
