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

const navToggle = document.getElementById('nav-toggle');
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => { if (navToggle) navToggle.checked = false; });
});

/* ANIMATIONS */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
}, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.af,.al,.ar').forEach(el => obs.observe(el));

/* GALLERY SCROLL + DRAG */
const gWrap = document.getElementById('galleryWrap');
const gProg = document.getElementById('gProg');
if (gWrap) {
  function updateProg() {
    if (!gProg) return;
    const p = (gWrap.scrollLeft / (gWrap.scrollWidth - gWrap.clientWidth)) * 100;
    gProg.style.width = Math.max(10, p) + '%';
  }

  gWrap.addEventListener('wheel', (e) => {
    e.preventDefault();
    gWrap.scrollLeft += e.deltaY + e.deltaX;
    updateProg();
  }, { passive: false });

  let isDown = false, startX, scrollLeft;
  gWrap.addEventListener('mousedown', (e) => { isDown = true; gWrap.classList.add('grab'); startX = e.pageX - gWrap.offsetLeft; scrollLeft = gWrap.scrollLeft; });
  window.addEventListener('mouseup', () => { isDown = false; gWrap.classList.remove('grab'); });
  gWrap.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    gWrap.scrollLeft = scrollLeft - (e.pageX - gWrap.offsetLeft - startX) * 1.5;
    updateProg();
  });

  gWrap.addEventListener('scroll', updateProg, { passive: true });
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
  const mq = window.matchMedia('(max-width:767px)');

  function currentOpen() {
    return accordion.querySelector('.tm-item.open') || tmItems[0];
  }

  function setWidths(openItem, animate) {
    if (mq.matches) {
      // Mobile: CSS handles height animation, JS only manages open class
      tmItems.forEach(it => {
        const isOpen = it === openItem;
        it.style.width = '';
        it.style.transition = '';
        it.classList.toggle('open', isOpen);
        it.querySelector('.tm-tab').setAttribute('aria-expanded', String(isOpen));
      });
      return;
    }

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

  // Re-initialise when crossing the mobile breakpoint
  mq.addEventListener('change', () => setWidths(currentOpen(), false));

  // Recalculate widths on desktop resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (mq.matches) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => setWidths(currentOpen(), false), 150);
  }, { passive: true });
}

/* LIGHTBOX */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
if (lightbox) {
  function openLb(src, alt) {
    lbImg.src = src; lbImg.alt = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  document.querySelectorAll('.g-item img').forEach(img => {
    img.addEventListener('click', () => openLb(img.src, img.alt));
  });
  lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target === lbImg.parentElement) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLb(); });
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