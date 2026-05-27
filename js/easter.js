/* Konami code + matrix rain visuals only — terminal commands live in main.js */

(function initKonami() {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  document.addEventListener('keydown', e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === seq[pos] || (seq[pos] === 'b' && key === 'B') || (seq[pos] === 'a' && key === 'A')) {
      pos++;
      if (pos === seq.length) {
        pos = 0;
        document.body.classList.add('konami-fx');
        setTimeout(() => document.body.classList.remove('konami-fx'), 6000);
        if (typeof openWindow === 'function') openWindow('terminal');
        window.terminalPrint?.('<span class="info">🎮 Konami code unlocked!</span>', 'info');
        if (typeof UISound !== 'undefined') UISound.open();
      }
    } else {
      pos = key === seq[0] ? 1 : 0;
    }
  });
})();

(function initAppleEaster() {
  let clicks = 0;
  let timer;
  document.getElementById('appleMenuBtn')?.addEventListener('click', () => {
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 1200);
    if (clicks >= 5) {
      clicks = 0;
      window.terminalPrint?.('<span class="info">🍎 "Think different."</span>', 'info');
      if (typeof UISound !== 'undefined') UISound.boot();
    }
  });
})();

(function initMatrixRain() {
  const layer = document.getElementById('matrixRain');
  if (!layer) return;
  const chars = '01アイウエオカキクケコサシスセソタチツテト';
  for (let i = 0; i < 28; i++) {
    const col = document.createElement('span');
    col.className = 'matrix-col';
    col.style.left = (i / 28 * 100) + '%';
    col.style.animationDuration = (4 + Math.random() * 6) + 's';
    col.style.animationDelay = (-Math.random() * 8) + 's';
    col.textContent = Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join('\n');
    layer.appendChild(col);
  }
})();
