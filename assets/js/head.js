// Consent Mode v2 defaults + carga diferida de GA4 + stub de Clarity.
// Debe cargarse síncrono como PRIMER elemento del <head>, antes que cualquier
// otro script, para que el consent default se registre antes de que gtag.js
// pueda ejecutarse.

// Consent Mode v2 defaults: debe ejecutarse ANTES de que cargue gtag.js
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("consent", "default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  wait_for_update: 500
});

// GA4 — carga diferida a window.load (no recolecta nada hasta consentimiento, Consent Mode v2)
window.addEventListener('load', function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-Y1Y9YC09NL';
  document.head.appendChild(s);
  gtag("js", new Date());
  gtag("config", "G-Y1Y9YC09NL");
});

// Clarity queue stub — el script real solo carga si hay consentimiento
window.clarity = window.clarity || function () {
  (window.clarity.q = window.clarity.q || []).push(arguments);
};
