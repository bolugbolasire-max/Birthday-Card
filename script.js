/* ===== PASTE YOUR HOSTED VIDEO LINKS HERE (in order) ===== */
const VIDEO_URLS = [
  "https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/videos/moment-1.mp4",
  "https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/videos/moment-2.mp4",
  "https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/videos/moment-3.mp4",
  "https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/videos/moment-4.mp4"
];
document.body.classList.add('locked');
document.querySelectorAll('video').forEach((v, i) => { v.src = VIDEO_URLS[i]; v.load(); });
 
(() => {
  /* =====================================================
     EDIT HERE: the message that types out on page 2.
     Each line is one paragraph. The first one is the greeting.
     ===================================================== */
  const MESSAGE = [
    "Elozino,",
    "Happy birthday. Today the whole world gets to celebrate one of its finest, and I'm so glad I get to say it to you.",
    "May your health stay strong, your days stay light, and your heart stay at peace.",
    "May your account smile every time you check it, with more money than you can count and more on the way.",
    "And never forget how beautiful you are. Not only the face that makes people pause, but the way you carry yourself, the way you laugh, and the way you light up every room you walk into.",
    "Enjoy your day. You deserve every bit of it."
  ];
  const SIGN_OFF = "Bolu cares";
 
  const $ = (s) => document.querySelector(s);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  /* ---------------- MUSIC ----------------
     Plays music/birthday.mp3 if you add that file.
     Otherwise it plays a built-in music-box "Happy Birthday". */
  const music = (() => {
    let mode = null, audio = null, ctx = null, master = null, echo = null;
    let timer = null, nextAt = 0, paused = false;
    const B = 0.62;                                   // seconds per beat
    const N = { G4:392.00, A4:440.00, B4:493.88, C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99 };
    const TUNE = [
      ['G4',.75],['G4',.25],['A4',1],['G4',1],['C5',1],['B4',2],
      ['G4',.75],['G4',.25],['A4',1],['G4',1],['D5',1],['C5',2],
      ['G4',.75],['G4',.25],['G5',1],['E5',1],['C5',1],['B4',1],['A4',1],
      ['F5',.75],['F5',.25],['E5',1],['C5',1],['D5',1],['C5',2]
    ];
 
    function unlock() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!ctx && AC) ctx = new AC();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    }
 
    function note(freq, t, d) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.9, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0008, t + d * 1.7);
      const o1 = ctx.createOscillator(); o1.type = 'triangle'; o1.frequency.value = freq;
      const o2 = ctx.createOscillator(); o2.type = 'sine';     o2.frequency.value = freq * 2;
      const g2 = ctx.createGain(); g2.gain.value = 0.22;
      o1.connect(g); o2.connect(g2); g2.connect(g);
      g.connect(master); g.connect(echo);
      o1.start(t); o2.start(t);
      o1.stop(t + d * 1.7 + 0.1); o2.stop(t + d * 1.7 + 0.1);
    }
 
    function schedule() {
      let t = nextAt;
      for (const [n, beats] of TUNE) { note(N[n], t, beats * B); t += beats * B; }
      nextAt = t + 1.8;
    }
 
    function startSynth() {
      if (mode === 'synth' || !ctx) return;
      mode = 'synth';
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      echo = ctx.createDelay(1); echo.delayTime.value = 0.27;
      const fb = ctx.createGain(); fb.gain.value = 0.32;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      echo.connect(lp); lp.connect(fb); fb.connect(echo); lp.connect(master);
      nextAt = ctx.currentTime + 0.2;
      schedule();
      timer = setInterval(() => { if (ctx.currentTime > nextAt - 2) schedule(); }, 400);
      master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.3);
    }
 
    return {
      start() {
        unlock();
        audio = new Audio('music/birthday.mp3');
        audio.loop = true; audio.volume = 0.75;
        audio.addEventListener('error', startSynth);
        const p = audio.play();
        if (p && p.then) p.then(() => { if (mode !== 'synth') mode = 'file'; }).catch(startSynth);
      },
      pause() {
        paused = true;
        if (mode === 'file') audio.pause();
        else if (mode === 'synth') {
          master.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
          setTimeout(() => { if (paused) ctx.suspend(); }, 600);
        }
      },
      resume() {
        paused = false;
        if (mode === 'file') audio.play().catch(() => {});
        else if (mode === 'synth') {
          ctx.resume();
          master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.2);
        }
      }
    };
  })();
 
  /* ---------------- OPEN THE CARD (page 1 -> page 2) ---------------- */
  const page1 = $('#page1'), page2 = $('#page2');
  let opened = false;
 
  $('#openBtn').addEventListener('click', () => {
    if (opened) return;
    opened = true;
    music.start();                                    // must start inside the tap
    page1.classList.add('leaving');
    setTimeout(() => {
      page1.style.display = 'none';
      document.body.classList.remove('locked');
      document.body.classList.add('p2');
      page2.classList.add('show');
      window.scrollTo(0, 0);
      requestAnimationFrame(() => requestAnimationFrame(() => page2.classList.add('in')));
      makeCakes();
      setTimeout(typeLetter, 900);
    }, 800);
  });
 
  /* ---------------- TYPING ----------------
     The full text is laid out up front (hidden), so nothing jumps while it types. */
  const letter = $('#letter');
  let skip = false, letterDone = false;
 
  letter.addEventListener('click', () => { skip = true; });
 
  function typeDelay(ch) {
    if (skip) return 0;
    if (ch === '.') return 420;
    if (ch === ',') return 200;
    return 26 + Math.random() * 22;
  }
 
  async function typeLetter() {
    const rows = MESSAGE.map((txt, i) => {
      const p = document.createElement('p');
      if (i === 0) p.className = 'greet';
      const done = document.createTextNode('');
      const caret = document.createElement('span'); caret.className = 'caret'; caret.hidden = true;
      const todo = document.createElement('span'); todo.className = 'todo'; todo.textContent = txt;
      p.append(done, caret, todo);
      letter.appendChild(p);
      return { txt, done, caret, todo };
    });
    for (const r of rows) {
      r.caret.hidden = false;
      for (let i = 0; i < r.txt.length; i++) {
        r.done.data = r.txt.slice(0, i + 1);
        r.todo.textContent = r.txt.slice(i + 1);
        const d = typeDelay(r.txt[i]);
        if (d) await sleep(d);
      }
      r.caret.hidden = true;
      if (!skip) await sleep(380);
    }
    letter.classList.add('done');
    letterDone = true;
    maybeSign();
  }
 
  /* ---------------- SIGN-OFF: "Bolu cares" ---------------- */
  const sign = $('#sign'), signText = $('#signText');
  let signSeen = false, signStarted = false;
 
  new IntersectionObserver((es) => {
    if (es.some(e => e.isIntersecting)) { signSeen = true; maybeSign(); }
  }, { threshold: 0.8 }).observe(signText);
 
  async function maybeSign() {
    if (signStarted || !signSeen || !letterDone) return;
    signStarted = true;
    const done = document.createTextNode('');
    const caret = document.createElement('span'); caret.className = 'caret';
    const todo = document.createElement('span'); todo.className = 'todo'; todo.textContent = SIGN_OFF;
    signText.append(done, caret, todo);
    for (let i = 0; i < SIGN_OFF.length; i++) {
      done.data = SIGN_OFF.slice(0, i + 1);
      todo.textContent = SIGN_OFF.slice(i + 1);
      await sleep(130);
    }
    await sleep(900);
    sign.classList.add('done');
  }
 
  /* ---------------- VIDEOS: pause the song while one plays ---------------- */
  const vids = [...document.querySelectorAll('video')];
  let muted = false;
  vids.forEach(v => {
    v.addEventListener('play', () => {
      vids.forEach(o => { if (o !== v) o.pause(); });
      music.pause();
    });
    const back = () => {
      if (vids.some(x => !x.paused && !x.ended)) return;
      if (!muted) music.resume();
    };
    v.addEventListener('pause', back);
    v.addEventListener('ended', back);
  });
 
  /* ---------------- MUSIC TOGGLE ---------------- */
  const soundBtn = $('#sound');
  soundBtn.addEventListener('click', () => {
    muted = !muted;
    soundBtn.classList.toggle('off', muted);
    soundBtn.setAttribute('aria-label', muted ? 'Turn music on' : 'Turn music off');
    if (muted) music.pause();
    else if (!vids.some(x => !x.paused && !x.ended)) music.resume();
  });
 
  /* ---------------- FLOATING CAKES (a few, slow, soft) ---------------- */
  function makeCakes() {
    if (reduceMotion) return;
    const wrap = $('#cakes');
    const count = 8;
    for (let i = 0; i < count; i++) {
      const c = document.createElement('span');
      c.className = 'cake';
      c.textContent = '\uD83C\uDF82';
      const size = 20 + Math.random() * 14;
      const dur = 17 + Math.random() * 11;
      c.style.left = (4 + (i + Math.random() * 0.7) * (92 / count)) + '%';
      c.style.fontSize = size + 'px';
      c.style.animationDuration = dur + 's';
      c.style.animationDelay = (-Math.random() * dur) + 's';
      c.style.setProperty('--sway', (Math.random() * 50 - 25) + 'px');
      wrap.appendChild(c);
    }
  }
})();
 