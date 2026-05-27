/* ===== Boot Screen ===== */
(function () {
  const boot = document.getElementById('bootScreen');
  setTimeout(() => {
    boot.classList.add('hidden');
    setTimeout(() => openWindow('about'), 400);
  }, 2200);
})();

/* ===== Typewriter ===== */
const roles = [
  'Embedded Systems & IoT Developer',
  'Microcontroller Programmer',
  'Hardware-Software Integrator',
  'Automation Enthusiast'
];

const typewriterEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 80;

function typeWriter() {
  if (!typewriterEl) return;
  const current = roles[roleIndex];
  if (isDeleting) {
    typewriterEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 40;
  } else {
    typewriterEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 80;
  }
  if (!isDeleting && charIndex === current.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 500;
  }
  setTimeout(typeWriter, typeSpeed);
}
typeWriter();

/* ===== Clock ===== */
(function () {
  const clock = document.getElementById('menuClock');
  const welcome = document.getElementById('welcomeTime');
  if (!clock) return;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function update() {
    const now = new Date();
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    clock.textContent = `${days[now.getDay()].slice(0, 3)} ${months[now.getMonth()]} ${now.getDate()}  ${hour}:${m} ${ampm}`;
    if (welcome) welcome.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  }

  update();
  setInterval(update, 30000);
})();

/* ===== Window Manager ===== */
const windowsLayer = document.getElementById('windowsLayer');
const openApps = new Set();
let zIndex = 200;
let focusedApp = null;

function getWindow(app) {
  return document.getElementById(`win-${app}`);
}

function focusWindow(app) {
  const win = getWindow(app);
  if (!win || !win.classList.contains('open')) return;
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
  win.classList.add('focused');
  win.style.zIndex = ++zIndex;
  focusedApp = app;

  document.querySelectorAll('.dock-app[data-open]').forEach(d => {
    d.classList.toggle('active', d.dataset.open === app);
  });

  const menuApp = document.querySelector('.menu-active-app');
  const titles = { about: 'About Me', projects: 'Projects', skills: 'Skills', certificates: 'Certificates', contact: 'Contact', terminal: 'Terminal' };
  if (menuApp) menuApp.textContent = titles[app] || 'Finder';
}

function openWindow(app) {
  const win = getWindow(app);
  if (!win) return;

  win.classList.remove('minimized');
  win.classList.add('open');

  openApps.add(app);
  document.querySelectorAll(`.dock-app[data-open="${app}"]`).forEach(d => d.classList.add('running'));
  focusWindow(app);

  if (app === 'terminal') {
    setTimeout(() => document.getElementById('terminalInput')?.focus(), 100);
  }
}

function closeWindow(app) {
  const win = getWindow(app);
  if (!win) return;
  win.classList.remove('open', 'focused', 'maximized');
  openApps.delete(app);
  document.querySelectorAll(`.dock-app[data-open="${app}"]`).forEach(d => {
    d.classList.remove('running', 'active');
  });
}

function minimizeWindow(app) {
  const win = getWindow(app);
  if (!win) return;
  win.classList.add('minimized');
  win.classList.remove('focused');
}

function toggleMaximize(app) {
  const win = getWindow(app);
  if (!win) return;
  win.classList.toggle('maximized');
  focusWindow(app);
}

function toggleWindow(app) {
  const win = getWindow(app);
  if (!win) return;
  if (!win.classList.contains('open')) {
    openWindow(app);
  } else if (win.classList.contains('minimized')) {
    win.classList.remove('minimized');
    focusWindow(app);
  } else if (focusedApp === app) {
    minimizeWindow(app);
  } else {
    focusWindow(app);
  }
}

document.querySelectorAll('[data-open]').forEach(el => {
  el.addEventListener('click', e => {
    const app = el.dataset.open;
    if (!app) return;
    if (el.tagName === 'A' && el.href && !el.href.endsWith('#')) return;
    e.preventDefault();
    toggleWindow(app);
    closeDropdowns();
  });
});

document.querySelectorAll('.window').forEach(win => {
  const app = win.dataset.app;

  win.addEventListener('mousedown', () => focusWindow(app));

  win.querySelectorAll('.traffic-lights .tl').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const action = btn.dataset.action;
      if (action === 'close') closeWindow(app);
      else if (action === 'minimize') minimizeWindow(app);
      else if (action === 'maximize') toggleMaximize(app);
    });
  });
});

/* ===== Window Drag ===== */
(function () {
  let dragging = null;
  let offsetX = 0, offsetY = 0;

  function startDrag(clientX, clientY, header) {
    const win = header.closest('.window');
    if (!win || win.classList.contains('maximized')) return;
    dragging = win;
    const rect = win.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    win.style.transition = 'none';
  }

  function moveDrag(clientX, clientY) {
    if (!dragging) return;
    const layer = windowsLayer.getBoundingClientRect();
    let x = clientX - layer.left - offsetX + dragging.offsetWidth / 2;
    let y = clientY - layer.top - offsetY + dragging.offsetHeight / 2;
    x = Math.max(80, Math.min(layer.width - 80, x));
    y = Math.max(40, Math.min(layer.height - 40, y));
    dragging.style.left = x + 'px';
    dragging.style.top = y + 'px';
    dragging.style.transform = 'translate(-50%, -50%)';
  }

  function endDrag() {
    if (dragging) {
      dragging.style.transition = '';
      dragging = null;
    }
  }

  document.addEventListener('mousedown', e => {
    const header = e.target.closest('[data-drag]');
    if (!header) return;
    startDrag(e.clientX, e.clientY, header);
  });

  document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
  document.addEventListener('mouseup', endDrag);

  document.addEventListener('touchstart', e => {
    const header = e.target.closest('[data-drag]');
    if (!header || e.touches.length !== 1) return;
    startDrag(e.touches[0].clientX, e.touches[0].clientY, header);
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!dragging || e.touches.length !== 1) return;
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  document.addEventListener('touchend', endDrag);
})();

/* ===== Dropdowns ===== */
function closeDropdowns() {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
}

document.getElementById('appleMenuBtn')?.addEventListener('click', e => {
  e.stopPropagation();
  const dd = document.getElementById('appleDropdown');
  dd.classList.toggle('open');
  document.getElementById('wallpaperPicker')?.classList.remove('open');
  document.getElementById('mobileNav')?.classList.remove('open');
});

document.getElementById('mobileMenuBtn')?.addEventListener('click', e => {
  e.stopPropagation();
  const dd = document.getElementById('mobileNav');
  dd.classList.toggle('open');
  document.getElementById('appleDropdown')?.classList.remove('open');
  document.getElementById('wallpaperPicker')?.classList.remove('open');
});

document.getElementById('wallpaperBtn')?.addEventListener('click', e => {
  e.stopPropagation();
  const dd = document.getElementById('wallpaperPicker');
  dd.classList.toggle('open');
  document.getElementById('appleDropdown')?.classList.remove('open');
  document.getElementById('mobileNav')?.classList.remove('open');
});

document.addEventListener('click', closeDropdowns);

document.getElementById('restartBtn')?.addEventListener('click', () => {
  location.reload();
});

/* ===== Wallpaper ===== */
const WALLPAPERS = [
  { id: 'mountains', cat: 'nature', thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop&q=80' },
  { id: 'lake', cat: 'nature', thumb: 'https://images.unsplash.com/photo-1439066615861-d1bef0662937?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1439066615861-d1bef0662937?w=1920&h=1080&fit=crop&q=80' },
  { id: 'ocean', cat: 'nature', thumb: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop&q=80' },
  { id: 'forest', cat: 'nature', thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=80' },
  { id: 'aurora', cat: 'nature', thumb: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&h=1080&fit=crop&q=80' },
  { id: 'sunset', cat: 'nature', thumb: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&h=1080&fit=crop&q=80' },
  { id: 'waterfall', cat: 'nature', thumb: 'https://images.unsplash.com/photo-1432405268376-18c920346fee?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1432405268376-18c920346fee?w=1920&h=1080&fit=crop&q=80' },
  { id: 'tokyo', cat: 'city', thumb: 'https://images.unsplash.com/photo-1540959733336-eab4deabeeaf?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1540959733336-eab4deabeeaf?w=1920&h=1080&fit=crop&q=80' },
  { id: 'nightcity', cat: 'city', thumb: 'https://images.unsplash.com/photo-1514565131-fce0801dec1a?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1514565131-fce0801dec1a?w=1920&h=1080&fit=crop&q=80' },
  { id: 'bridge', cat: 'city', thumb: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&h=1080&fit=crop&q=80' },
  { id: 'gradient1', cat: 'abstract', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', thumb: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 'gradient2', cat: 'abstract', css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', thumb: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: 'gradient3', cat: 'abstract', css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', thumb: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { id: 'gradient4', cat: 'abstract', css: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', thumb: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { id: 'gradient5', cat: 'abstract', css: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', thumb: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { id: 'macos', cat: 'abstract', css: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)', thumb: 'linear-gradient(160deg, #1a1a2e, #533483)' },
  { id: 'space', cat: 'dark', thumb: 'https://images.unsplash.com/photo-1419242902214-272b3b66e7a7?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1419242902214-272b3b66e7a7?w=1920&h=1080&fit=crop&q=80' },
  { id: 'darkmount', cat: 'dark', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&h=1080&fit=crop&q=80' },
  { id: 'milkyway', cat: 'dark', thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&q=80' },
  { id: 'darkgradient', cat: 'dark', css: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', thumb: 'linear-gradient(135deg, #0f0c29, #24243e)' }
];

const CUSTOM_WP_KEY = 'wallpaperCustom';

function getCustomWallpaper() {
  try {
    const raw = localStorage.getItem(CUSTOM_WP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCustomWallpaper(data) {
  localStorage.setItem(CUSTOM_WP_KEY, JSON.stringify(data));
}

(function () {
  const wpEl = document.getElementById('wallpaper');
  const overlayEl = document.getElementById('wallpaperOverlay');
  const optionsEl = document.getElementById('wallpaperOptions');
  const blurEl = document.getElementById('wpBlur');
  const dimEl = document.getElementById('wpDim');
  const autoEl = document.getElementById('wpAuto');
  const uploadEl = document.getElementById('wpUpload');
  if (!wpEl || !optionsEl) return;

  let activeCat = 'all';
  let activeId = localStorage.getItem('wallpaper') || 'mountains';
  let autoTimer = null;
  let customWallpaper = getCustomWallpaper();

  function getAllWallpapers() {
    const list = [...WALLPAPERS];
    if (customWallpaper) {
      list.unshift({
        id: 'custom',
        cat: 'custom',
        url: customWallpaper.url,
        thumb: customWallpaper.thumb
      });
    }
    return list;
  }

  function applyWallpaper(wp) {
    if (wp.css) {
      wpEl.style.background = wp.css;
    } else {
      wpEl.style.background = `url('${wp.url}') center/cover no-repeat`;
    }
    applyBlur();
    activeId = wp.id;
    localStorage.setItem('wallpaper', wp.id);
    document.querySelectorAll('.wp-opt').forEach(b => b.classList.toggle('active', b.dataset.id === wp.id));
  }

  function applyBlur() {
    const blur = blurEl ? blurEl.value : 0;
    wpEl.style.filter = blur > 0 ? `blur(${blur}px)` : '';
    localStorage.setItem('wpBlur', blur);
  }

  function applyDim() {
    const dim = dimEl ? dimEl.value : 0;
    if (overlayEl) overlayEl.style.background = `rgba(0,0,0,${dim / 100})`;
    localStorage.setItem('wpDim', dim);
  }

  function renderOptions() {
    const all = getAllWallpapers();
    const filtered = activeCat === 'all'
      ? all
      : activeCat === 'custom'
        ? all.filter(w => w.cat === 'custom')
        : WALLPAPERS.filter(w => w.cat === activeCat);
    optionsEl.innerHTML = filtered.map(wp => {
      const bg = wp.url
        ? `background-image:url('${wp.thumb || wp.url}')`
        : `background:${wp.thumb}`;
      return `<button class="wp-opt${wp.id === activeId ? ' active' : ''}" data-id="${wp.id}" style="${bg}" aria-label="${wp.id}"></button>`;
    }).join('');

    optionsEl.querySelectorAll('.wp-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const wp = getAllWallpapers().find(w => w.id === btn.dataset.id);
        if (wp) applyWallpaper(wp);
      });
    });
  }

  function setRandom() {
    const pool = activeCat === 'all'
      ? getAllWallpapers()
      : activeCat === 'custom'
        ? getAllWallpapers().filter(w => w.cat === 'custom')
        : WALLPAPERS.filter(w => w.cat === activeCat);
    if (!pool.length) return;
    applyWallpaper(pool[Math.floor(Math.random() * pool.length)]);
  }

  function startAuto() {
    stopAuto();
    if (autoEl?.checked) {
      autoTimer = setInterval(setRandom, 30000);
      localStorage.setItem('wpAuto', '1');
    } else {
      localStorage.setItem('wpAuto', '0');
    }
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  document.querySelectorAll('.wp-cat').forEach(cat => {
    cat.addEventListener('click', () => {
      document.querySelectorAll('.wp-cat').forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      activeCat = cat.dataset.cat;
      renderOptions();
    });
  });

  uploadEl?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Please choose an image under 3 MB.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      customWallpaper = { url: dataUrl, thumb: dataUrl };
      saveCustomWallpaper(customWallpaper);
      applyWallpaper({ id: 'custom', cat: 'custom', url: dataUrl, thumb: dataUrl });
      renderOptions();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  blurEl?.addEventListener('input', applyBlur);
  dimEl?.addEventListener('input', applyDim);
  autoEl?.addEventListener('change', startAuto);
  document.getElementById('wpRandom')?.addEventListener('click', setRandom);

  const all = getAllWallpapers();
  const saved = all.find(w => w.id === activeId) || WALLPAPERS[0];
  applyWallpaper(saved);
  if (blurEl && localStorage.getItem('wpBlur')) blurEl.value = localStorage.getItem('wpBlur');
  if (dimEl && localStorage.getItem('wpDim')) dimEl.value = localStorage.getItem('wpDim');
  if (autoEl && localStorage.getItem('wpAuto') === '1') { autoEl.checked = true; startAuto(); }
  applyBlur();
  applyDim();
  renderOptions();
})();

/* ===== Dark Mode ===== */
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.dataset.theme = 'dark';
}

/* ===== Terminal ===== */
(function () {
  const output = document.getElementById('terminalOutput');
  const input = document.getElementById('terminalInput');
  if (!output || !input) return;

  const commands = {
    help() {
      return `<span class="info">Available commands:</span>
  help      — Show this message
  about     — About Selvendran
  skills    — List technical skills
  projects  — List projects
  contact   — Contact information
  whoami    — Current user
  ls        — List desktop apps
  clear     — Clear terminal
  sudo      — Try it 😉
  open      — Usage: open [about|projects|skills|certificates|contact]
  certificates — Show certificate summary`;
    },
    about() {
      return `Selvendran Palanisamy
Embedded Systems & IoT Developer
📍 Dindigul, Tamil Nadu, India
🎓 B.Tech IT — Christian College of Engineering and Technology (2026)
💼 Embedded Systems Intern @ CodTech IT Solutions (Aug 2025)
💼 Intern — Embedded Systems & IoT @ Skill Intern, Bangalore (Oct 2025)
💼 DevOps Security Trainee @ One27 Educational Services Pvt. Ltd., Dindigul (Mar 2026)`;
    },
    skills() {
      return `Embedded & IoT:
Python · C · Java · Arduino · ESP8266 · RFID · IoT · Bluetooth

DevOps & Security:
Linux · Docker · Git · Bash · CI/CD · DevOps · Cybersecurity · Cloud

Tools:
GitHub · VS Code · NumPy · Pandas · Hardware-Software Integration`;
    },
    projects() {
      return `1. Smart Home Automation Using IoT (ESP8266)
2. Cell Phone Controlled Robotic Vehicle (Arduino)
3. Library Automation Using RFID
4. Smart Home Web Dashboard (HTML/JS)`;
    },
    contact() {
      return `Email: selvendranapalanisamy@gmail.com
Phone: +91 9025773867
GitHub: github.com/selvendran254
LinkedIn: linkedin.com/in/selvendran-p`;
    },
    whoami() { return 'selvendran — Embedded Systems & IoT Developer'; },
    ls() { return 'About Me  Projects  Skills  Contact  Terminal  Resume'; },
    sudo() { return 'Nice try! 😄 You already have full access to this portfolio.'; }
  };

  function print(text, cls = 'out') {
    const line = document.createElement('div');
    line.className = 'line ' + cls;
    line.innerHTML = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  print('Welcome to Selvendran Portfolio Terminal v1.0', 'info');
  print('Type <span class="cmd">help</span> to see available commands.', 'out');

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim();
    input.value = '';
    if (!cmd) return;

    print(`<span class="cmd">selvendran@portfolio ~ % ${cmd}</span>`, 'cmd');

    const [command, arg] = cmd.toLowerCase().split(/\s+/);

    if (command === 'clear') {
      output.innerHTML = '';
      return;
    }

    if (command === 'open' && arg) {
      if (['about', 'projects', 'skills', 'certificates', 'contact', 'terminal'].includes(arg)) {
        openWindow(arg);
        print(`Opening ${arg}...`, 'info');
      } else {
        print(`App "${arg}" not found.`, 'err');
      }
      return;
    }

    if (command === 'certificates') {
      print(`Total: ${CERT_STATS.total} | Outer College: ${CERT_STATS.outer} | College: ${CERT_STATS.college}`, 'info');
      print('Type "open certificates" to view full list.', 'out');
      return;
    }

    if (commands[command]) {
      print(commands[command]().replace(/\n/g, '<br>'), 'out');
    } else {
      print(`Command not found: ${command}. Type "help" for commands.`, 'err');
    }
  });
})();

/* ===== Contact Form (email only) ===== */
document.getElementById('contactForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailTo = typeof CONTACT_EMAIL !== 'undefined' ? CONTACT_EMAIL : 'selvendranapalanisamy@gmail.com';

  if (form.botcheck?.checked) return;
  if (!name || !email || !message) {
    if (statusEl) {
      statusEl.textContent = 'Please fill in all fields.';
      statusEl.className = 'form-status error';
    }
    return;
  }

  if (!WEB3FORMS_ACCESS_KEY) {
    if (statusEl) {
      statusEl.textContent = 'Email service is being set up. Please try again soon or mail ' + emailTo;
      statusEl.className = 'form-status error';
    }
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  if (statusEl) {
    statusEl.textContent = 'Sending to your inbox...';
    statusEl.className = 'form-status sending';
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name,
        email,
        message,
        subject: `Portfolio Contact from ${name}`,
        from_name: 'Portfolio Contact Form',
        replyto: email
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Request failed');
    }

    if (statusEl) {
      statusEl.textContent = 'Message sent! Check your email inbox.';
      statusEl.className = 'form-status success';
    }
    form.reset();
  } catch {
    if (statusEl) {
      statusEl.textContent = `Could not send. Please email ${emailTo} directly.`;
      statusEl.className = 'form-status error';
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});

/* ===== Dock Magnify (macOS style) ===== */
(function () {
  const dock = document.getElementById('dock');
  if (!dock) return;

  const MAX_SCALE = 1.85;
  const RANGE = 140;

  function magnify(clientX) {
    const items = [...dock.querySelectorAll('.dock-app')];
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - center);
      const ratio = Math.max(0, 1 - dist / RANGE);
      const scale = 1 + (MAX_SCALE - 1) * Math.pow(ratio, 1.35);
      const lift = (scale - 1) * 36;
      item.style.transform = `translateY(-${lift}px) scale(${scale})`;
      item.style.zIndex = String(Math.round(scale * 100));
    });
  }

  function reset() {
    dock.querySelectorAll('.dock-app').forEach(item => {
      item.style.transform = '';
      item.style.zIndex = '';
    });
  }

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    dock.addEventListener('mousemove', e => magnify(e.clientX));
    dock.addEventListener('mouseleave', reset);
  }
})();

/* ===== Desktop Click — deselect ===== */
document.getElementById('desktop')?.addEventListener('click', e => {
  if (e.target.closest('.window, .dock, .menu-bar, .desktop-icon, .dropdown, .welcome-widget')) return;
  document.querySelectorAll('.dock-app[data-open]').forEach(d => d.classList.remove('active'));
  document.querySelector('.menu-active-app').textContent = 'Finder';
});

/* ===== Certificates ===== */
(function () {
  const listEl = document.getElementById('certList');
  const searchEl = document.getElementById('certSearch');
  if (!listEl || typeof CERT_STATS === 'undefined') return;

  document.getElementById('certTotalCount').textContent = CERT_STATS.total;
  document.getElementById('certOuterCount').textContent = CERT_STATS.outer;
  document.getElementById('certCollegeCount').textContent = CERT_STATS.college;

  let activeTab = 'all';

  function renderCertItem(cert, type) {
    return `<article class="cert-item">
      <span class="cert-badge ${cert.verified ? 'verified' : 'pending'}">${cert.verified ? '✓' : '·'}</span>
      <div class="cert-info">
        <h4>${cert.name}</h4>
        <p>${cert.org} · ${cert.year}</p>
      </div>
      <span class="cert-tag ${type}">${type === 'college' ? 'College' : 'Outer'}</span>
    </article>`;
  }

  function getFiltered() {
    const q = (searchEl?.value || '').toLowerCase();
    const college = COLLEGE_CERTIFICATES.map(c => ({ ...c, type: 'college' }));
    const outer = OUTER_COLLEGE_CERTIFICATES.map(c => ({ ...c, type: 'outer' }));
    let items = activeTab === 'college' ? college : activeTab === 'outer' ? outer : [...college, ...outer];
    if (q) items = items.filter(c => `${c.name} ${c.org}`.toLowerCase().includes(q));
    return items.sort((a, b) => (b.verified - a.verified) || b.year.localeCompare(a.year));
  }

  function render() {
    const items = getFiltered();
    listEl.innerHTML = items.length
      ? items.map(c => renderCertItem(c, c.type)).join('')
      : '<p style="text-align:center;color:var(--text-3);padding:24px">No certificates found.</p>';
  }

  document.querySelectorAll('.cert-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cert-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.dataset.tab;
      render();
    });
  });

  searchEl?.addEventListener('input', render);
  render();
})();
