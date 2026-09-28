(function () {
  var form = document.getElementById('subscribe-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn     = form.querySelector('.subscribe-form__btn');
    var success = document.getElementById('sub-success');
    var error   = document.getElementById('sub-error');
    var email   = form.querySelector('[name="email"]').value.trim();

    if (!email) {
      form.querySelector('[name="email"]').focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.hidden = false;
      form.querySelector('[name="email"]').focus();
      return;
    }

    btn.disabled = true;
    success.hidden = true;
    error.hidden   = true;

    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:   email,
        nombre:  (form.querySelector('[name="nombre"]')  || {}).value || '',
        nivel:   (form.querySelector('[name="nivel"]')   || {}).value || '',
        objetivo:(form.querySelector('[name="objetivo"]') || {}).value || ''
      })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.ok) {
        success.hidden = false;
        form.reset();
        gtag('event', 'subscribe_success');
      } else {
        error.hidden = false;
      }
    })
    .catch(function () {
      error.hidden = false;
    })
    .finally(function () {
      btn.disabled = false;
    });
  });
})();
