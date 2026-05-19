// ============================================================
// My English Spot — interaction layer
// ============================================================

// --- Google Fonts async injection (CSP-safe, no inline handlers) --
(function () {
  var l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap';
  document.head.appendChild(l);
}());

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

// --- Hamburger menu toggle ------------------------------------
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.getElementById('nav-menu');

function openMenu() {
  nav.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Cerrar menú');
}
function closeMenu() {
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menú');
}

navToggle.addEventListener('click', () => {
  nav.classList.contains('is-open') ? closeMenu() : openMenu();
});

navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click',   e => { if (!nav.contains(e.target)) closeMenu(); });
