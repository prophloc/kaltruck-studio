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

test('editorial process, proof strip and FAQ exist', () => {
  const homepage = read('src/pages/index.astro');
  assert.match(homepage, /id="method-title"/);
  assert.match(homepage, /proof-grid/);
  assert.match(homepage, /id="faq-title"/);
  assert.match(homepage, /<details>/);
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
