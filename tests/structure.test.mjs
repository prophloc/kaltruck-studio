import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');

test('website contains all main routes', () => {
  for (const p of [
    'src/pages/index.astro',
    'src/pages/o-nas.astro',
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
 assert.match(map, /google-route-heading-caption/);
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
 assert.match(css, /color:#edf5ef/);
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
