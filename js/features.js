/* ===== UI Sounds (Web Audio) ===== */
const UISound = {
  ctx: null,
  get enabled() { return localStorage.getItem('uiSound') !== '0'; },
  set enabled(v) { localStorage.setItem('uiSound', v ? '1' : '0'); },

  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },

  tone(freq, dur = 0.08, vol = 0.06, type = 'sine') {
    if (!this.enabled) return;
    try {
      this.init();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = vol;
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      o.connect(g).connect(this.ctx.destination);
      o.start();
      o.stop(this.ctx.currentTime + dur);
    } catch (_) {}
  },

  click() { this.tone(920, 0.05, 0.05); },
  open() { this.tone(660, 0.07, 0.05); setTimeout(() => this.tone(880, 0.06, 0.04), 60); },
  close() { this.tone(520, 0.06, 0.04); },
  boot() { this.tone(523, 0.12, 0.05); setTimeout(() => this.tone(784, 0.18, 0.05), 120); }
};

/* ===== Image Skeletons ===== */
function initImageSkeletons() {
  document.querySelectorAll('.img-wrap img, .about-avatar img').forEach(img => {
    const wrap = img.closest('.img-wrap') || img.parentElement;
    if (!wrap || wrap.querySelector('.img-skeleton')) return;
    wrap.classList.add('has-skeleton');
    const sk = document.createElement('div');
    sk.className = 'img-skeleton';
    wrap.insertBefore(sk, img);
    if (img.complete && img.naturalWidth) {
      wrap.classList.add('loaded');
    } else {
      img.classList.add('loading');
      img.addEventListener('load', () => wrap.classList.add('loaded'), { once: true });
      img.addEventListener('error', () => wrap.classList.add('loaded'), { once: true });
    }
  });
}

/* ===== Visitor Counter ===== */
(function () {
  const el = document.getElementById('visitorCount');
  if (!el) return;
  fetch('https://api.countapi.xyz/hit/selvendran254.portfolio/visits')
    .then(r => r.json())
    .then(d => { if (d.value != null) el.textContent = d.value.toLocaleString(); })
    .catch(() => { el.textContent = '—'; });
})();

/* ===== Blog ===== */
(function () {
  const listEl = document.getElementById('blogList');
  if (!listEl || typeof BLOG_POSTS === 'undefined') return;

  listEl.innerHTML = BLOG_POSTS.map(p => `
    <article class="blog-item" data-id="${p.id}">
      <div class="blog-meta"><span class="blog-tag">${p.tag}</span><time>${p.date}</time></div>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <button type="button" class="blog-read" data-id="${p.id}">Read more →</button>
    </article>
  `).join('');

  listEl.addEventListener('click', e => {
    const btn = e.target.closest('.blog-read');
    if (!btn) return;
    const post = BLOG_POSTS.find(p => p.id === btn.dataset.id);
    if (!post) return;
    const detail = document.getElementById('blogDetail');
    if (detail) {
      detail.hidden = false;
      detail.innerHTML = `<button type="button" class="blog-back" id="blogBack">← Back</button>
        <div class="blog-meta"><span class="blog-tag">${post.tag}</span><time>${post.date}</time></div>
        <h2>${post.title}</h2><p>${post.body}</p>`;
      listEl.hidden = true;
      document.getElementById('blogBack')?.addEventListener('click', () => {
        detail.hidden = true;
        listEl.hidden = false;
      }, { once: true });
    }
  });
})();

/* ===== Spotlight Search (macOS window) ===== */
(function () {
  const win = document.getElementById('win-spotlight');
  const input = document.getElementById('spotlightInput');
  const results = document.getElementById('spotlightResults');
  if (!win || !input || !results) return;

  const APPS = [
    { type: 'app', id: 'about', label: 'About Me', icon: '👤' },
    { type: 'app', id: 'projects', label: 'Projects', icon: '📁' },
    { type: 'app', id: 'skills', label: 'Skills', icon: '⚙️' },
    { type: 'app', id: 'certificates', label: 'Certificates', icon: '🏅' },
    { type: 'app', id: 'contact', label: 'Contact', icon: '✉️' },
    { type: 'app', id: 'terminal', label: 'Terminal', icon: '⌨️' },
    { type: 'app', id: 'blog', label: 'Blog', icon: '📝' },
    { type: 'cmd', id: 'theme', label: 'Toggle Dark Mode', icon: '🌙' },
    { type: 'cmd', id: 'restart', label: 'Restart Desktop', icon: '🔄' },
    { type: 'cmd', id: 'lang', label: 'Switch Language (EN/TA)', icon: '🌐' },
    { type: 'cmd', id: 'sound', label: 'Toggle UI Sounds', icon: '🔊' }
  ];

  let activeIndex = 0;
  let filtered = [...APPS];

  function renderList() {
    results.innerHTML = filtered.map((item, i) =>
      `<button type="button" class="spotlight-item${i === activeIndex ? ' active' : ''}" data-type="${item.type}" data-id="${item.id}">
        <span class="spotlight-icon">${item.icon}</span>
        <span>${item.label}</span>
      </button>`
    ).join('') || '<p class="spotlight-empty">No results</p>';
  }

  function filter(q) {
    const query = q.toLowerCase().trim();
    filtered = query
      ? APPS.filter(a => a.label.toLowerCase().includes(query) || a.id.includes(query))
      : [...APPS];
    activeIndex = 0;
    renderList();
  }

  function close() {
    if (typeof closeWindow === 'function') closeWindow('spotlight');
  }

  function run(item) {
    close();
    if (item.type === 'app') {
      if (typeof openWindow === 'function') openWindow(item.id);
      else if (typeof toggleWindow === 'function') toggleWindow(item.id);
    } else if (item.id === 'theme') {
      document.getElementById('themeToggle')?.click();
    } else if (item.id === 'restart') {
      document.getElementById('restartBtn')?.click();
    } else if (item.id === 'lang') {
      document.getElementById('langToggle')?.click();
    } else if (item.id === 'sound') {
      document.getElementById('soundToggle')?.click();
    }
  }

  function open() {
    input.value = '';
    filter('');
    if (typeof openWindow === 'function') openWindow('spotlight');
    else if (typeof toggleWindow === 'function') toggleWindow('spotlight');
    setTimeout(() => input.focus(), 120);
  }

  window.openSpotlight = open;
  window.closeSpotlight = close;

  renderList();

  input.addEventListener('input', () => filter(input.value));

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); renderList(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); renderList(); }
    else if (e.key === 'Enter' && filtered[activeIndex]) { e.preventDefault(); run(filtered[activeIndex]); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  });

  results.addEventListener('click', e => {
    const btn = e.target.closest('.spotlight-item');
    if (!btn) return;
    const item = filtered.find((_, i) => results.querySelectorAll('.spotlight-item')[i] === btn);
    if (item) run(item);
  });
})();

/* ===== Keyboard Shortcuts ===== */
(function () {
  const APPS = ['about', 'projects', 'skills', 'certificates', 'contact', 'terminal', 'blog'];

  document.addEventListener('keydown', e => {
    const mod = e.metaKey || e.ctrlKey;
    const tag = document.activeElement?.tagName;

    if (mod && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      window.openSpotlight?.();
      return;
    }

    if (e.key === 'Escape') {
      if (document.getElementById('win-spotlight')?.classList.contains('open')) {
        closeWindow('spotlight');
      } else if (focusedApp) {
        closeWindow(focusedApp);
      }
      return;
    }

    if (mod && e.key >= '1' && e.key <= '7' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault();
      const app = APPS[parseInt(e.key, 10) - 1];
      if (app) toggleWindow(app);
      return;
    }

    if (mod && e.key.toLowerCase() === 'd' && tag !== 'INPUT') {
      e.preventDefault();
      document.getElementById('themeToggle')?.click();
    }
  });
})();

/* ===== Sound + Language toggles ===== */
(function () {
  const soundBtn = document.getElementById('soundToggle');
  if (soundBtn) {
    const sync = () => {
      soundBtn.setAttribute('aria-pressed', UISound.enabled ? 'true' : 'false');
      soundBtn.title = UISound.enabled ? t('soundOn') : t('soundOff');
    };
    sync();
    soundBtn.addEventListener('click', () => {
      UISound.enabled = !UISound.enabled;
      sync();
      if (UISound.enabled) UISound.click();
    });
  }

  document.getElementById('langToggle')?.addEventListener('click', () => {
    applyLanguage(currentLang === 'en' ? 'ta' : 'en');
    UISound.click();
  });

  applyLanguage(currentLang);
})();

/* ===== Hook sounds into window actions ===== */
(function () {
  document.getElementById('spotlightBtn')?.addEventListener('click', () => window.openSpotlight?.());

  if (typeof openWindow === 'function') {
    const origOpen = openWindow;
    window.openWindow = function (app) {
      const win = document.getElementById(`win-${app}`);
      const wasOpen = win?.classList.contains('open') && !win?.classList.contains('minimized');
      const result = origOpen(app);
      if (!wasOpen) UISound.open();
      return result;
    };
  }

  if (typeof closeWindow === 'function') {
    const origClose = closeWindow;
    window.closeWindow = function (app) {
      UISound.close();
      return origClose(app);
    };
  }

  document.querySelectorAll('.traffic-lights .tl').forEach(btn => {
    btn.addEventListener('click', () => UISound.click());
  });

  setTimeout(() => UISound.boot(), 1800);
})();

/* ===== PWA ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

initImageSkeletons();
