(function () {
  var form = document.getElementById('guia-form');
  if (!form) return;

  var ok         = document.getElementById('guia-ok');
  var errorBox   = document.getElementById('guia-error');
  var emailError = document.getElementById('guia-email-error');
  var emailInput = document.getElementById('guia-email');
  var nameInput  = document.getElementById('guia-nombre');
  var checkbox   = document.getElementById('guia-emails');
  var btn        = form.querySelector('button[type="submit"]');
  var download   = document.getElementById('guia-download');
  var reserva    = document.getElementById('guia-reserva');

  function track(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    errorBox.hidden = true;
    emailError.hidden = true;
    emailInput.removeAttribute('aria-invalid');

    var email = emailInput.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError.hidden = false;
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.focus();
      return;
    }

    var wantsEmails = checkbox.checked;
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:  email,
        nombre: nameInput.value.trim(),
        source: wantsEmails ? 'speaking_fce_emails' : 'speaking_fce'
      })
    })
    .then(function (res) { return res.json().then(function (data) { return { res: res, data: data }; }); })
    .then(function (r) {
      if (r.res.ok && r.data && r.data.ok) {
        form.hidden = true;
        ok.hidden = false;
        var first = ok.querySelector('p');
        if (first) first.focus();
        track('guia_lead', { emails_ok: wantsEmails });
      } else {
        errorBox.hidden = false;
      }
    })
    .catch(function () {
      errorBox.hidden = false;
    })
    .then(function () {
      btn.disabled = false;
      btn.textContent = label;
    });
  });

  if (download) download.addEventListener('click', function () { track('guia_download'); });
  if (reserva) reserva.addEventListener('click', function () { track('click_reserva', { origen: 'guia_speaking' }); });
})();
