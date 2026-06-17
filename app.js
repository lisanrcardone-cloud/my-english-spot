// ============================================================
// My English Spot — interaction layer
// ============================================================

// --- Clarity: detener en entornos que no son producción --------
(function () {
  var host = window.location.hostname;
  var isProd = host === 'www.myenglishspotclasses.com' || host === 'myenglishspotclasses.com';
  if (!isProd && typeof clarity !== 'undefined') {
    clarity('stop');
  }
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

// --- /gracias — conversión + WhatsApp form handler -------------
(function () {
  var form = document.getElementById('gracias-form');
  if (!form) return;

  // Disparar reserva_confirmada al cargar /gracias.
  // gtag() está definido en el <head>; los eventos se encolan en dataLayer
  // y se envían cuando GA4 termina de cargarse.
  gtag('event', 'reserva_confirmada', { value: 1 });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre   = document.getElementById('nombre').value.trim();
    var email    = document.getElementById('email').value.trim();
    var nivel    = document.getElementById('nivel').value;
    var objetivo = document.getElementById('objetivo').value;

    if (!nombre || !email || !nivel || !objetivo) {
      alert('Por favor rellena todos los campos antes de continuar.');
      return;
    }

    // Conversión secundaria: el alumno envió su presentación a Rocío
    gtag('event', 'lead_whatsapp', { value: 1 });

    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: email, nombre: nombre, nivel: nivel, objetivo: objetivo })
    }).catch(function () {});

    var msg = '¡Hola Rocío! Acabo de reservar mi clase de prueba. Te cuento un poco sobre mí:\n\n'
      + 'Nombre: ' + nombre + '\n'
      + 'Email: ' + email + '\n'
      + 'Nivel: ' + nivel + '\n'
      + 'Objetivo: ' + objetivo + '\n\n'
      + '¡Nos vemos pronto!';

    var a = document.createElement('a');
    a.href = 'https://wa.me/34678703017?text=' + encodeURIComponent(msg);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
})();
