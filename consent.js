// ============================================================
// My English Spot — Cookie Consent (Consent Mode v2)
// ============================================================
(function () {
  var CONSENT_KEY = 'mes-consent'; // 'granted' | 'denied'
  var GA4_ID      = 'G-Y1Y9YC09NL';
  var CLARITY_ID  = 'x5g3qs2fbb';

  function isProd() {
    var h = window.location.hostname;
    return h === 'www.myenglishspotclasses.com' || h === 'myenglishspotclasses.com';
  }

  // --- Activar GA4 (Consent Mode update) -------------------------
  function enableGA4() {
    if (typeof gtag !== 'function') return;
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  // --- Cargar e inicializar Clarity ------------------------------
  function enableClarity() {
    if (!isProd()) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
    // Señal de consentimiento una vez el script haya arrancado
    setTimeout(function () {
      if (typeof clarity === 'function') clarity('consent');
    }, 600);
  }

  // --- Aplicar decisión de consentimiento -----------------------
  function applyConsent(value, persist) {
    if (persist) {
      try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
      hideBanner();
    }
    if (value === 'granted') {
      enableGA4();
      enableClarity();
    }
  }

  // --- Mostrar / ocultar banner ----------------------------------
  function showBanner() {
    var b = document.getElementById('cookie-banner');
    if (!b) return;
    b.removeAttribute('hidden');
    // Un frame de retardo para que la transición CSS arranque
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { b.classList.add('is-visible'); });
    });
  }

  function hideBanner() {
    var b = document.getElementById('cookie-banner');
    if (!b) return;
    b.classList.remove('is-visible');
    b.addEventListener('transitionend', function () { b.remove(); }, { once: true });
  }

  // --- Leer decisión previa -------------------------------------
  var stored;
  try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) {}

  if (stored === 'granted' || stored === 'denied') {
    applyConsent(stored, false);
  } else {
    // Primera visita: mostrar banner tras el primer pintado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { setTimeout(showBanner, 600); });
    } else {
      setTimeout(showBanner, 600);
    }
  }

  // --- Botones del banner ---------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    var btnAccept = document.getElementById('cookie-accept');
    var btnReject = document.getElementById('cookie-reject');
    if (btnAccept) btnAccept.addEventListener('click', function () { applyConsent('granted', true); });
    if (btnReject) btnReject.addEventListener('click', function () { applyConsent('denied',  true); });
  });
})();
