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
  assert.match(gallery, /aria-label="Zamknij zdjęcie"/);
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

test('common header uses authentic logo, two phone numbers and arrow-free services', () => {
 const layout = read('src/layouts/BaseLayout.astro');
 assert.match(layout, /src="\/brand\/kaltruck-logo\.svg"/);
 assert.match(layout, /data-studio-services/);
 assert.match(layout, /class="studio-header-contacts"/);
 assert.match(layout, /site\.secondPhoneHref/);
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

test('footer has readable map and real contact details', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  const css = read('src/styles/footer-refresh.css');
  assert.match(layout, /studio-footer__contact/);
  assert.match(layout, /studio-footer__map-heading/);
  assert.match(layout, /studio-footer__legal/);
  assert.match(layout, /site\.secondPhoneHref/);
  assert.match(layout, /studio-footer__identity/);
  assert.match(css, /\.studio-footer-route \.google-route-heading h2\{color:#1b3224/);
  assert.match(css, /\.studio-footer-route \.google-route-map-shell iframe/);
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
 assert.match(css, /#uslugi\.ps-service-stories\s*\{scroll-margin-top:0;\}/);
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
 assert.match(css, /\.ps-story__copy h2 \.ps-story__highlight\s*\{[\s\S]*?font-family:'DM Sans'[\s\S]*?color:#4f7c38;[\s\S]*?background:none;/);
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
 assert.match(hero, /:global\(\.studio-hero-tool__pin\)\{display:block;width:24px;height:28px/);
 assert.match(pin, /data-google-maps-pin/);
 assert.match(pin, /data:image\/png;base64/);
});

test('Premium child Google Maps icon styling uses Astro global class scope', () => {
 const hero=read('src/components/studio/HeroTools.astro');
 assert.match(hero, /:global\(\.studio-hero-tool__pin\)\{display:block;width:24px;height:28px/);
 assert.match(hero, /:global\(\.studio-hero-tool__pin\)\{width:19px;height:23px\}/);
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
  assert.match(route, /\.google-route-heading-logo\{display:block;position:relative;top:2px;/);
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

test('Premium-style centered footer brand uses larger logo and one-line slogan', () => {
  const layout=read('src/layouts/BaseLayout.astro');
  const footer=read('src/styles/footer-refresh.css');
  assert.match(layout, /<p>CIĘŻKI ŁADUNEK\.\.\. PRECYZYJNA ROBOTA\.<\/p>/);
  assert.doesNotMatch(layout, /Transport HDS, załadunek i rozładunek\.<br \/>Płock i cała Polska\./);
  assert.match(footer, /\.studio-footer__identity\{[\s\S]*?align-items:center;[\s\S]*?text-align:center;/);
  assert.match(footer, /width:clamp\(280px,21vw,340px\)/);
  assert.match(footer, /\.studio-footer__identity p\{[\s\S]*?white-space:nowrap;/);
  assert.match(footer, /\.studio-footer__identity img\{width:clamp\(230px,62vw,290px\)/);
});
test('green individual service words use distinct DM Sans, no outline or shadow', () => {
  const css=read('src/styles/premium-layout.css');
  const start=css.indexOf('.ps-story__copy h2 .ps-story__highlight {');
  assert.ok(start>=0);
  const block=css.slice(start,css.indexOf('}',start)+1);
  assert.match(block,/font-family:'DM Sans'/);
  assert.match(block,/font-weight:700/);
  assert.match(block,/color:#4f7c38/);
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
 assert.equal((layout.match(/href="\/sprzet\/"/g)||[]).length,3);
 assert.match(sitemap, /'\/sprzet\/'/);
 assert.match(page, /do 12 ton|12 t/);
 assert.match(page, /14 m/);
 assert.match(page, /masy, zasięgu i warunków pracy/);
});
test('footer vertical alignment raises logo and centers other columns', () => {
 const css=read('src/styles/footer-refresh.css');
 assert.match(css, /\.studio-footer__lower\{[^\n]*align-items:center;/);
 assert.match(css, /\.studio-footer__identity\{[\s\S]*?align-self:center;[\s\S]*?top:-19px;/);
 assert.match(css, /\.studio-footer__nav\{[^\n]*justify-content:center;align-self:center;/);
 assert.match(css, /\.studio-footer__scope\{align-self:center;\}/);
 assert.match(css, /\.studio-footer__identity\{grid-column:1\/-1;top:0;/);
});
