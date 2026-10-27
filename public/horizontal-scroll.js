/* KALTRUCK horizontal v2: wheel, keyboard, touch and hash navigation. */
(() => {
  const track = document.getElementById('horizontal-track');
  const nav = document.querySelector('.horizontal-progress');
  if (!(track instanceof HTMLElement) || !(nav instanceof HTMLElement)) return;
  const media = window.matchMedia('(min-width: 901px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const panels = Array.from(track.children).filter(el => el.classList.contains('hz-slide'));
  const countEl = nav.querySelector('[data-count]');
  const fillEl = nav.querySelector('[data-fill]');
  const prev = nav.querySelector('[data-prev]');
  const next = nav.querySelector('[data-next]');
  if (!panels.length || !countEl || !fillEl || !prev || !next) return;

  function clamp(n) { return Math.min(panels.length - 1, Math.max(0, n)); }
  function index() { return clamp(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1))); }
  function update() {
    const i = index();
    countEl.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(panels.length).padStart(2, '0');
    fillEl.style.width = ((i + 1) * 100 / panels.length) + '%';
    prev.disabled = i === 0;
    next.disabled = i === panels.length - 1;
    prev.setAttribute('aria-disabled', String(i === 0));
    next.setAttribute('aria-disabled', String(i === panels.length - 1));
    if (media.matches) {
      const homeLinks = document.querySelectorAll('[data-nav-home],[data-mobile-nav-home]');
      const serviceLinks = document.querySelectorAll('[data-nav-services],[data-mobile-nav-services]');
      homeLinks.forEach(a => i === 0 ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
      serviceLinks.forEach(a => i === 1 ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current'));
    }
  }
  function go(i, smooth = true) {
    if (!media.matches) return;
    const target = panels[clamp(i)];
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: smooth && !reduced.matches ? 'smooth' : 'instant' });
  }
  prev.addEventListener('click', () => go(index() - 1));
  next.addEventListener('click', () => go(index() + 1));
  track.addEventListener('scroll', update, { passive: true });

  function scrollableChild(target, dy) {
    for (let el = target instanceof Element ? target : null; el && el !== track; el = el.parentElement) {
      if (!(el instanceof HTMLElement)) continue;
      const style = getComputedStyle(el);
      if (!/auto|scroll/.test(style.overflowY) || el.scrollHeight <= el.clientHeight + 3) continue;
      if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 3) return true;
      if (dy < 0 && el.scrollTop > 3) return true;
    }
    return false;
  }
  window.addEventListener('wheel', e => {
    if (!media.matches || e.ctrlKey || !track.contains(e.target)) return;
    if (e.target instanceof Element && e.target.closest('input,textarea,select,[role="dialog"],.studio-hero-tool__panel')) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    if (scrollableChild(e.target, e.deltaY)) return;
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    if ((e.deltaY > 0 && track.scrollLeft >= max - 2) || (e.deltaY < 0 && track.scrollLeft <= 2)) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 24 : e.deltaMode === 2 ? track.clientWidth : 1;
    track.scrollLeft += e.deltaY * unit;
  }, { passive: false });

  document.addEventListener('click', e => {
    if (!media.matches || !(e.target instanceof Element)) return;
    const anchor = e.target.closest('a[href^="#"],a[href^="/#"]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    const id = decodeURIComponent(anchor.hash.slice(1));
    if (!id) return;
    const targetIndex = panels.findIndex(panel => panel.id === id);
    if (targetIndex < 0) return;
    e.preventDefault();
    go(targetIndex);
    history.replaceState(null, '', '#' + encodeURIComponent(id));
  });

  window.addEventListener('keydown', e => {
    if (!media.matches || e.altKey || e.ctrlKey || e.metaKey) return;
    const active = document.activeElement;
    if (active && /INPUT|TEXTAREA|SELECT/.test(active.tagName)) return;
    if ((e.key === 'ArrowRight' || e.key === 'PageDown') && index() < panels.length - 1) { e.preventDefault(); go(index() + 1); }
    if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && index() > 0) { e.preventDefault(); go(index() - 1); }
  });

  function fromHash() {
    if (!media.matches || !location.hash) return;
    let id = '';
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const targetIndex = panels.findIndex(panel => panel.id === id);
    if (targetIndex >= 0) go(targetIndex, false);
  }
  media.addEventListener('change', () => { update(); fromHash(); });
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('resize', update);
  fromHash();
  update();
})();
