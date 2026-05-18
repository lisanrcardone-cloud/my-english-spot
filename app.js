// ============================================================
// My English Spot — interaction layer
// ============================================================

// --- Language toggle (ES / EN) ----------------------------------
const langButtons = document.querySelectorAll('.lang__btn');
const STORAGE_KEY = 'mes-lang';

function applyLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-es]').forEach(el => {
    const next = el.getAttribute('data-' + lang);
    if (next != null) el.textContent = next;
  });
  langButtons.forEach(btn => {
    const on = btn.dataset.lang === lang;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
}

langButtons.forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// Restore previous choice
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'es') applyLang(saved);
} catch (e) {}

// --- Nav shadow on scroll --------------------------------------
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 8);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
