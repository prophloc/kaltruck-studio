/* KALTRUCK horizontal V3: all six menu tabs are scroll destinations. */
(() => {
  const track = document.getElementById('horizontal-track');
  const nav = document.querySelector('.horizontal-progress');
  if (!(track instanceof HTMLElement) || !(nav instanceof HTMLElement)) return;

  const desktop = window.matchMedia('(min-width: 901px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const panels = [...track.children].filter(el => el.classList.contains('hz-slide'));
  const menuLinks = [...document.querySelectorAll('[data-nav-section]')];
  const countEl = nav.querySelector('[data-count]');
  const fillEl = nav.querySelector('[data-fill]');
  const prev = nav.querySelector('[data-prev]');
  const next = nav.querySelector('[data-next]');
  if (!panels.length || !countEl || !fillEl || !prev || !next) return;

  function clamp(n) { return Math.max(0, Math.min(n, panels.length - 1)); }
  function horizontalIndex() {
    return clamp(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
  }
  function verticalIndex() {
    const threshold = window.innerHeight * 0.42;
    let result = 0;
    for (let i = 0; i < panels.length; i++) {
      if (panels[i].getBoundingClientRect().top <= threshold) result = i;
    }
    return result;
  }
  function index() { return desktop.matches ? horizontalIndex() : verticalIndex(); }
  function update() {
    const current = index();
    countEl.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(panels.length).padStart(2, '0');
    fillEl.style.width = (100 * (current + 1) / panels.length) + '%';
    prev.disabled = current === 0;
    next.disabled = current === panels.length - 1;
    menuLinks.forEach(link => {
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.dataset.navSection === panels[current].id) {
        link.setAttribute('aria-current', current === 0 ? 'page' : 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }
  function go(targetIndex, smooth = true) {
    const el = panels[clamp(targetIndex)];
    if (!el) return;
    if (!desktop.matches) {
      el.scrollIntoView({ behavior: smooth && !reduceMotion.matches ? 'smooth' : 'auto', block: 'start' });
    } else {
      track.scrollTo({
        left: el.offsetLeft - track.offsetLeft,
        behavior: smooth && !reduceMotion.matches ? 'smooth' : 'auto',
      });
    }
  }

  prev.addEventListener('click', () => go(index() - 1));
  next.addEventListener('click', () => go(index() + 1));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('scroll', update, { passive: true });

  function nestedVerticalCanScroll(target, delta) {
    for (let el = target instanceof Element ? target : null; el && el !== track; el = el.parentElement) {
      if (!(el instanceof HTMLElement)) continue;
      const css = window.getComputedStyle(el);
      if (!/(auto|scroll)/.test(css.overflowY) || el.scrollHeight <= el.clientHeight + 4) continue;
      if (delta > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 4) return true;
      if (delta < 0 && el.scrollTop > 3) return true;
    }
    return false;
  }

  window.addEventListener('wheel', e => {
    if (!desktop.matches || e.ctrlKey || !track.contains(e.target)) return;
    if (e.target instanceof Element && e.target.closest('input,textarea,select,[role="dialog"],.studio-hero-tool__panel')) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    if (nestedVerticalCanScroll(e.target, e.deltaY)) return;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    if ((e.deltaY < 0 && track.scrollLeft < 2) || (e.deltaY > 0 && track.scrollLeft >= maxScroll - 2)) return;
    e.preventDefault();
    const multiplier = e.deltaMode === 1 ? 24 : e.deltaMode === 2 ? track.clientWidth : 1;
    track.scrollLeft += e.deltaY * multiplier;
  }, { passive: false });

  // All menu links use homepage hashes. On desktop the inner track scrolls;
  // on mobile regular anchor navigation remains available without JS.
  document.addEventListener('click', e => {
    if (!desktop.matches || !(e.target instanceof Element)) return;
    const a = e.target.closest('a[href^="#"], a[href^="/#"]');
    if (!(a instanceof HTMLAnchorElement) || !a.hash) return;
    let id = '';
    try { id = decodeURIComponent(a.hash.slice(1)); } catch { return; }
    const nextIndex = panels.findIndex(panel => panel.id === id);
    if (nextIndex < 0) return;
    e.preventDefault();
    go(nextIndex);
    history.replaceState(null, '', '/#' + encodeURIComponent(id));
  });

  window.addEventListener('keydown', e => {
    if (!desktop.matches || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const el = document.activeElement;
    if (el && (el.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(el.tagName))) return;
    if ((e.key === 'ArrowRight' || e.key === 'PageDown') && index() < panels.length - 1) {
      e.preventDefault(); go(index() + 1);
    }
    if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && index() > 0) {
      e.preventDefault(); go(index() - 1);
    }
  });

  function fromHash() {
    if (!window.location.hash) return;
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const targetIndex = panels.findIndex(panel => panel.id === id);
    if (targetIndex >= 0) go(targetIndex, false);
  }
  desktop.addEventListener('change', () => { fromHash(); update(); });
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('resize', update);
  fromHash();
  update();
})();
