/* Apply custom domain URLs + Google Analytics */

(function () {
  const base = typeof getSiteUrl === 'function' ? getSiteUrl() : 'https://selvendran254.github.io/portfolio/';

  document.querySelectorAll('link[rel="canonical"]').forEach(el => { el.href = base; });

  ['og:url'].forEach(prop => {
    document.querySelectorAll(`meta[property="${prop}"]`).forEach(el => { el.content = base; });
  });

  document.querySelectorAll('script[type="application/ld+json"]').forEach(el => {
    try {
      const data = JSON.parse(el.textContent);
      if (data['@type'] === 'Person') data.url = base;
      el.textContent = JSON.stringify(data);
    } catch (_) {}
  });

  if (typeof GA_MEASUREMENT_ID !== 'undefined' && GA_MEASUREMENT_ID) {
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });

    window.trackPortfolioEvent = function (name, params) {
      window.gtag('event', name, params || {});
    };

    document.addEventListener('click', e => {
      const app = e.target.closest('[data-open]')?.dataset?.open;
      if (app) window.trackPortfolioEvent('open_app', { app_name: app });
    });
  } else {
    window.trackPortfolioEvent = function () {};
  }
})();
