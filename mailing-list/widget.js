// Drop-in signup widget. Renders into every <div data-mailing-list> on the
// page. Reads its config from attributes on that same div, so one script
// tag serves every site regardless of where the backend actually lives:
//
//   <div data-mailing-list
//        data-heading="Join the mailing list"
//        data-endpoint="/api/list"
//        data-name-field="true"
//        data-turnstile-site-key="0x4AAA..."></div>
//   <script src="widget.js" defer></script>
//
// data-endpoint defaults to "/api/list" (same-origin) — override it with a
// full URL (e.g. a *.workers.dev origin) for a cross-origin deployment.

(function () {
  function renderWidget(container) {
    var endpoint = container.getAttribute('data-endpoint') || '/api/list';
    var heading = container.getAttribute('data-heading') || 'Join the mailing list';
    var showName = container.getAttribute('data-name-field') === 'true';
    var turnstileSiteKey = container.getAttribute('data-turnstile-site-key') || '';

    container.innerHTML =
      '<p class="ml-heading">' + escapeHtml(heading) + '</p>' +
      '<form class="ml-form" novalidate>' +
        '<div class="ml-row">' +
          (showName ? '<input type="text" name="name" placeholder="First name (optional)" autocomplete="given-name">' : '') +
          '<input type="email" name="email" placeholder="you@example.com" autocomplete="email" required>' +
          '<input type="text" name="company" class="ml-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<button type="submit">Subscribe</button>' +
        '</div>' +
        (turnstileSiteKey ? '<div class="cf-turnstile" data-sitekey="' + escapeHtml(turnstileSiteKey) + '"></div>' : '') +
        '<p class="ml-status" role="status" aria-live="polite"></p>' +
      '</form>';

    var form = container.querySelector('form');
    var statusEl = container.querySelector('.ml-status');
    var button = container.querySelector('button');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = form.email.value;
      var name = showName ? form.name.value : '';
      var company = form.company.value; // honeypot — real visitors never fill this in

      button.disabled = true;
      setStatus('Submitting…', null);

      fetch(endpoint.replace(/\/$/, '') + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          name: name,
          company: company,
          source: location.pathname,
          turnstileToken: turnstileSiteKey && window.turnstile
            ? window.turnstile.getResponse()
            : undefined,
        }),
      })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (result.ok) {
            setStatus('You’re on the list.', 'ok');
            form.reset();
          } else {
            setStatus(result.data && result.data.error ? result.data.error : 'Something went wrong.', 'error');
          }
        })
        .catch(function () {
          setStatus('Network error — please try again.', 'error');
        })
        .then(function () { button.disabled = false; });
    });

    function setStatus(message, state) {
      statusEl.textContent = message;
      if (state) statusEl.setAttribute('data-state', state);
      else statusEl.removeAttribute('data-state');
    }
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function init() {
    var containers = document.querySelectorAll('[data-mailing-list]');
    for (var i = 0; i < containers.length; i++) renderWidget(containers[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
