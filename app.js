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

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    nav.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click',   e => { if (!nav.contains(e.target)) closeMenu(); });
}

// --- Pre-captura de lead antes de saltar a Google Calendar ------
// Oportunidad #1 de la auditoría CRO: el CTA de reserva llevaba a una
// pestaña externa sin guardar ningún dato del visitante. Si abandonaba
// ahí, el negocio no tenía forma de contactarlo. Ahora se intercepta
// cualquier enlace a Calendar, se pide nombre + email en un modal propio
// (con opción de saltarlo para no bloquear a quien no quiere rellenar
// nada) y solo entonces se abre Calendar.
(function () {
  var CAL_MATCH = 'calendar.app.google';
  var modal = null;
  var pendingHref = null;

  function buildModal() {
    var el = document.createElement('div');
    el.className = 'precap';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'precap-title');
    el.innerHTML =
      '<div class="precap__backdrop" data-precap-close></div>' +
      '<div class="precap__box">' +
        '<button type="button" class="precap__close" aria-label="Cerrar" data-precap-close>' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>' +
        '</button>' +
        '<span class="precap__eyebrow">Antes de reservar</span>' +
        '<h2 class="precap__title" id="precap-title">¿Cómo te llamamos?</h2>' +
        '<p class="precap__sub">Así Rocío puede contactarte si algo falla al elegir horario en el calendario. No hace falta tarjeta ni ningún compromiso.</p>' +
        '<form class="precap__form" novalidate>' +
          '<div class="precap__field">' +
            '<label for="precap-nombre">Nombre</label>' +
            '<input type="text" id="precap-nombre" autocomplete="given-name" required />' +
          '</div>' +
          '<div class="precap__field">' +
            '<label for="precap-email">Email</label>' +
            '<input type="email" id="precap-email" autocomplete="email" required />' +
          '</div>' +
          '<div class="precap__actions">' +
            '<button type="submit" class="btn btn--primary btn--lg">Continuar a elegir horario</button>' +
            '<button type="button" class="precap__skip" data-precap-skip>Prefiero ir directo, sin dar mis datos</button>' +
          '</div>' +
        '</form>' +
      '</div>';
    document.body.appendChild(el);

    el.querySelectorAll('[data-precap-close]').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });
    el.querySelector('[data-precap-skip]').addEventListener('click', function () {
      gtag('event', 'lead_precapture_skip', { value: 1 });
      goToCalendar();
    });
    el.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = document.getElementById('precap-nombre').value.trim();
      var email  = document.getElementById('precap-email').value.trim();
      if (!nombre || !email) return;

      gtag('event', 'lead_precapture', { value: 1 });
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email, nombre: nombre, source: 'precapture' })
      }).catch(function () {});

      goToCalendar();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
    return el;
  }

  function goToCalendar() {
    if (pendingHref) window.open(pendingHref, '_blank', 'noopener');
    closeModal();
  }

  function openModal(href) {
    if (!modal) modal = buildModal();
    pendingHref = href;
    modal.classList.add('is-open');
    var firstField = document.getElementById('precap-nombre');
    if (firstField) firstField.focus();
  }

  function closeModal() {
    if (modal) modal.classList.remove('is-open');
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="' + CAL_MATCH + '"]');
    if (!a) return;
    e.preventDefault();
    openModal(a.href);
  });
})();

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

    if (!nombre) {
      alert('Cuéntanos al menos tu nombre antes de continuar.');
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
      + (email    ? 'Email: '     + email    + '\n' : '')
      + (nivel    ? 'Nivel: '     + nivel    + '\n' : '')
      + (objetivo ? 'Objetivo: '  + objetivo + '\n' : '')
      + '\n¡Nos vemos pronto!';

    var a = document.createElement('a');
    a.href = 'https://wa.me/34678703017?text=' + encodeURIComponent(msg);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
})();
