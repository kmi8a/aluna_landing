/* URLS */
const URLS = { vaki:'#', crowdfundr:'#', stripe:'#', merch:'#', primary:'#support-channels' };
document.querySelectorAll('[data-sup]').forEach(el => {
  const k = el.dataset.sup; if (URLS[k] && el.tagName === 'A') el.href = URLS[k];
});

/* NAV */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

/* ANIMATIONS */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
}, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.af,.al,.ar').forEach(el => obs.observe(el));

/* GALLERY DRAG */
const gWrap = document.getElementById('galleryWrap');
const gProg = document.getElementById('gProg');
if (gWrap) {
  let isDown = false, startX, scrollLeft;
  gWrap.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - gWrap.offsetLeft; scrollLeft = gWrap.scrollLeft; });
  gWrap.addEventListener('mouseup', () => isDown = false);
  gWrap.addEventListener('mousemove', (e) => {
    if (!isDown) return; e.preventDefault(); const walk = (e.pageX - gWrap.offsetLeft - startX) * 1.5;
    gWrap.scrollLeft = scrollLeft - walk;
    const p = (gWrap.scrollLeft / (gWrap.scrollWidth - gWrap.clientWidth)) * 100;
    if (gProg) gProg.style.width = Math.max(10, p) + '%';
  });
}

/* CURSOR */
const cursor = document.getElementById('cursor');
let mx = 0, my = 0, cx = 0, cy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function tick() {
  cx += (mx - cx) * 0.8; cy += (my - cy) * 0.8;
  if (cursor) cursor.style.transform = `translate(${cx}px,${cy}px)`;
  requestAnimationFrame(tick);
})();

/* TEAM ACCORDION */
const accordion = document.querySelector('.team-accordion');
if (accordion) {
  const tmItems = accordion.querySelectorAll('.tm-item');
  const TAB_W = 48;

  function setWidths(openItem, animate) {
    const totalW = accordion.clientWidth;
    const openW  = Math.round(totalW - (tmItems.length - 1) * TAB_W);

    if (!animate) {
      tmItems.forEach(it => it.style.transition = 'none, none');
      tmItems.forEach(it => {
        const isOpen = it === openItem;
        it.style.width = (isOpen ? openW : TAB_W) + 'px';
        it.classList.toggle('open', isOpen);
        it.querySelector('.tm-tab').setAttribute('aria-expanded', String(isOpen));
      });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        tmItems.forEach(it => it.style.transition = '');
      }));
      return;
    }

    tmItems.forEach(it => {
      const isOpen  = it === openItem;
      const wasOpen = it.classList.contains('open');

      if (wasOpen && !isOpen) {
        // Closing: instantly hide content and snap width — no fade, no flash
        const panel = it.querySelector('.tm-panel');
        panel.style.transition = 'none';
        panel.style.opacity = '0';
        it.style.transition = 'background 0.4s ease';
        it.style.width = TAB_W + 'px';
        it.classList.remove('open');
        it.querySelector('.tm-tab').setAttribute('aria-expanded', 'false');
        requestAnimationFrame(() => requestAnimationFrame(() => {
          it.style.transition = '';
          panel.style.transition = '';
          panel.style.opacity = '';
        }));
      } else if (isOpen && !wasOpen) {
        // Opening: animate width expansion only
        it.style.width = openW + 'px';
        it.classList.add('open');
        it.querySelector('.tm-tab').setAttribute('aria-expanded', 'true');
      }
    });
  }

  setWidths(tmItems[0], false);

  tmItems.forEach(item => {
    item.addEventListener('click', () => {
      if (!item.classList.contains('open')) setWidths(item, true);
    });
  });
}

/* SHARE */
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    const data = { title:'ALUNA', text:'Where sound becomes visible.', url: window.location.href };
    try { if (navigator.share) { await navigator.share(data); return; } } catch(e) {}
    navigator.clipboard.writeText(window.location.href).then(() => {
      const cta = document.getElementById('shareCta');
      if (cta) { cta.textContent = 'Link Copied ✓'; setTimeout(() => cta.textContent = 'Share →', 2200); }
    });
  });
}