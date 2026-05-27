/* Easter eggs — terminal commands + hidden shortcuts */

const TERMINAL_EASTER = {
  neofetch() {
    return `<pre class="neo">selvendran@portfolio
──────────────────────────────
OS: macOS Portfolio Web
Host: selvendran254.github.io
Kernel: Embedded Systems & IoT
Uptime: since boot screen
Shell: portfolio-terminal
CPU: Arduino · ESP8266 · RFID
Memory: 4 projects · 9 certs
Theme: macOS dark/light</pre>`;
  },

  fortune() {
    const tips = [
      'The best code is no code — but IoT needs both hardware and software.',
      'Debug with printf before you debug with oscilloscope.',
      'An ESP8266 a day keeps manual switches away.',
      'Commit early, deploy often, test on real hardware.',
      'RFID: Radio Frequency I Dream... of automated libraries.',
      'Your portfolio is your runtime resume.'
    ];
    return '🥠 ' + tips[Math.floor(Math.random() * tips.length)];
  },

  cowsay(msg) {
    const text = (msg || 'Moo! I am a cloud-connected cow.').slice(0, 60);
    const pad = ' '.repeat(Math.max(0, text.length));
    return `<pre class="neo"> ${pad.replace(/ /g, '_')}
&lt; ${text} &gt;
 ${pad.replace(/ /g, '-')}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||</pre>`;
  },

  date() { return new Date().toString(); },

  echo(msg) { return msg || ''; },

  matrix() {
    window.startMatrixRain?.();
    return 'Wake up, Neo... Matrix mode activated for 8 seconds.';
  },

  hack() {
    return `<span class="info">[████████████████████] 100%</span><br>Access granted. Just kidding — ethical hacking only. 🔐`;
  },

  coffee() {
    return 'HTTP 418 ☕ — I\'m a teapot. Brew some coffee and check your ESP8266 serial monitor.';
  },

  repos() {
    return 'GitHub repos: github.com/selvendran254<br>Type <span class="cmd">open projects</span> to explore.';
  },

  quiz() {
    window.startTerminalQuiz?.();
    return 'Embedded Quiz started! Answer with a, b, or c.';
  },

  snake() {
    window.startTerminalSnake?.();
    return 'Snake started! WASD to move · Q to quit';
  },

  konami() {
    window.triggerKonamiEffect?.();
    return '🎮 Konami code accepted! ↑↑↓↓←→←→BA';
  }
};

(function initKonami() {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  document.addEventListener('keydown', e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === seq[pos] || (seq[pos] === 'b' && key === 'B') || (seq[pos] === 'a' && key === 'A')) {
      pos++;
      if (pos === seq.length) {
        pos = 0;
        window.triggerKonamiEffect?.();
        if (typeof openWindow === 'function') openWindow('terminal');
        window.terminalPrint?.('<span class="info">🎮 Secret Konami code unlocked!</span>', 'info');
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
      window.terminalPrint?.('<span class="info">🍎 "Think different." — Apple Easter egg</span>', 'info');
      if (typeof UISound !== 'undefined') UISound.boot();
    }
  });
})();

window.triggerKonamiEffect = function () {
  document.body.classList.add('konami-fx');
  setTimeout(() => document.body.classList.remove('konami-fx'), 6000);
  if (typeof UISound !== 'undefined') UISound.open();
};

window.startMatrixRain = function () {
  const layer = document.getElementById('matrixRain');
  if (!layer) return;
  layer.classList.add('active');
  layer.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    layer.classList.remove('active');
    layer.setAttribute('aria-hidden', 'true');
  }, 8000);
};

window.startTerminalQuiz = function () {
  const questions = [
    { q: 'Which chip is common for WiFi IoT?', a: ['Arduino UNO', 'ESP8266', '8051'], c: 1 },
    { q: 'RFID stands for?', a: ['Radio Frequency ID', 'Random File IO', 'Remote Firmware'], c: 0 },
    { q: 'Best language for quick IoT prototyping?', a: ['Python/C', 'COBOL', 'Fortran'], c: 0 }
  ];
  let i = 0;
  const ask = () => {
    if (i >= questions.length) {
      window.terminalPrint?.('Quiz complete! Score: ' + window._quizScore + '/' + questions.length, 'info');
      window.terminalGameHandler = null;
      return;
    }
    const q = questions[i];
    window.terminalPrint?.(`Q${i + 1}: ${q.q}<br>a) ${q.a[0]}  b) ${q.a[1]}  c) ${q.a[2]}`, 'out');
  };
  window._quizScore = 0;
  window.terminalGameHandler = key => {
    const k = key.toLowerCase();
    if (!['a', 'b', 'c'].includes(k)) return true;
    const pick = k.charCodeAt(0) - 97;
    if (pick === questions[i].c) {
      window._quizScore++;
      window.terminalPrint?.('Correct! ✓', 'info');
    } else {
      window.terminalPrint?.('Wrong. Answer: ' + String.fromCharCode(97 + questions[i].c) + ') ' + questions[i].a[questions[i].c], 'err');
    }
    i++;
    ask();
    return true;
  };
  ask();
};

window.startTerminalSnake = function () {
  const W = 14, H = 8;
  let snake = [{ x: 3, y: 4 }, { x: 2, y: 4 }, { x: 1, y: 4 }];
  let dir = { x: 1, y: 0 };
  let food = { x: 8, y: 4 };
  let alive = true;

  const randFood = () => {
    do {
      food = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  };

  const render = () => {
    const grid = Array.from({ length: H }, () => Array(W).fill('·'));
    grid[food.y][food.x] = '◆';
    snake.forEach((s, i) => { grid[s.y][s.x] = i === 0 ? '●' : '○'; });
    const body = grid.map(r => r.join(' ')).join('\n');
    window.terminalPrint?.('<pre class="neo snake-grid">' + body + '</pre>', 'out');
  };

  const step = () => {
    if (!alive) return;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.y < 0 || head.x >= W || head.y >= H || snake.some(s => s.x === head.x && s.y === head.y)) {
      alive = false;
      window.terminalPrint?.('Game over! Score: ' + (snake.length - 3), 'err');
      window.terminalGameHandler = null;
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      randFood();
      window.terminalPrint?.('Yum! Score: ' + (snake.length - 3), 'info');
    } else {
      snake.pop();
    }
    render();
  };

  window.terminalGameHandler = key => {
    const k = key.toLowerCase();
    if (k === 'q') {
      alive = false;
      window.terminalPrint?.('Snake quit.', 'info');
      window.terminalGameHandler = null;
      return true;
    }
    const map = { w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 } };
    if (map[k]) {
      const nd = map[k];
      if (snake.length > 1 && nd.x === -dir.x && nd.y === -dir.y) return true;
      dir = nd;
      step();
    }
    return true;
  };
  render();
};

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
