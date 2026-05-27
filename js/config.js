/* Site configuration — fill in when ready */

/* Contact form — https://web3forms.com */
const WEB3FORMS_ACCESS_KEY = '';

const CONTACT_EMAIL = 'selvendranapalanisamy@gmail.com';

/* Custom domain — e.g. 'selvendran.dev' or 'www.selvendran.dev' (no https://)
   Leave empty to use GitHub Pages URL. GitHub auto-provisions HTTPS/SSL when
   you add the domain under repo Settings → Pages → Custom domain. */
const CUSTOM_DOMAIN = '';

/* Google Analytics 4 — e.g. 'G-XXXXXXXXXX' from analytics.google.com */
const GA_MEASUREMENT_ID = 'G-N6360482DV';

const GITHUB_PAGES_URL = 'https://selvendran254.github.io/portfolio/';

function getSiteUrl() {
  if (CUSTOM_DOMAIN && CUSTOM_DOMAIN.trim()) {
    const host = CUSTOM_DOMAIN.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://${host}/`;
  }
  return GITHUB_PAGES_URL;
}
