/* GHouse – warstwa efektów (podgląd) */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }

  /* ---------- wejście hero po intro ---------- */
  function wejscie() { root.classList.add('gh-wejscie'); }
  if (document.getElementById('gh-intro')) document.addEventListener('gh-intro-koniec', wejscie, { once: true });
  else wejscie();

  var btn = document.getElementById('znowu');
  if (btn) btn.addEventListener('click', function () {
    try { sessionStorage.removeItem('ghIntro'); } catch (e) {}
    window.scrollTo(0, 0); setTimeout(function () { location.reload(); }, 60);
  });

  /* ---------- znak 3D w hero (wyciągnięty, reaguje na kursor) ---------- */
  var hero = document.querySelector('.hero');
  var stary = document.querySelector('.znak-duzy');
  var obr = null;
  if (hero && stary) {
    var box = document.createElement('div'); box.className = 'znak3d'; box.setAttribute('aria-hidden', 'true');
    obr = document.createElement('div'); obr.className = 'obr'; box.appendChild(obr);
    var svg = el('svg', { viewBox: '118 64 318 318' }, obr);
    var defs = el('defs', {}, svg);
    defs.innerHTML = '<linearGradient id="z-mos" gradientUnits="userSpaceOnUse" x1="150" y1="360" x2="410" y2="86"><stop offset="0" stop-color="#6f5431"/><stop offset=".18" stop-color="#a88655"/><stop offset=".38" stop-color="#ecdcb6"/><stop offset=".47" stop-color="#c9a970"/><stop offset=".66" stop-color="#9b7b4a"/><stop offset=".82" stop-color="#d7bf8f"/><stop offset="1" stop-color="#7a5e36"/></linearGradient>' +
      '<linearGradient id="z-gra" gradientUnits="userSpaceOnUse" x1="140" y1="360" x2="370" y2="180"><stop offset="0" stop-color="#2a2d31"/><stop offset=".45" stop-color="#5b6167"/><stop offset=".6" stop-color="#7a8086"/><stop offset="1" stop-color="#33373b"/></linearGradient>' +
      '<linearGradient id="z-bl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<clipPath id="z-clip"><polygon points="145,272 162,272 353,88 336,88"/><polygon points="222,354 239,354 412,182 395,182"/></clipPath>';
    var SH = [
      { c: 'g', p: [[143, 185], [143, 202], [326, 358], [326, 341]] },
      { c: 'g', p: [[268, 213], [364, 213], [364, 224], [268, 224]] },
      { c: 'g', p: [[353, 213], [364, 213], [364, 357], [353, 357]] },
      { c: 'm', p: [[145, 272], [162, 272], [353, 88], [336, 88]] },
      { c: 'm', p: [[222, 354], [239, 354], [412, 182], [395, 182]] }
    ];
    var dg = el('g', {}, svg), DEP = 8;
    for (var k = DEP; k >= 1; k--) SH.forEach(function (s) {
      var off = k * 0.75, sh = k / DEP;
      var c = s.c === 'm' ? 'rgb(' + Math.round(122 - 76 * sh) + ',' + Math.round(94 - 59 * sh) + ',' + Math.round(52 - 33 * sh) + ')' : 'rgb(' + Math.round(34 - 20 * sh) + ',' + Math.round(37 - 22 * sh) + ',' + Math.round(40 - 23 * sh) + ')';
      el('polygon', { points: s.p.map(function (q) { return (q[0] + off) + ',' + (q[1] + off); }).join(' '), fill: c }, dg);
    });
    SH.forEach(function (s) { el('polygon', { points: s.p.map(function (q) { return q.join(','); }).join(' '), fill: s.c === 'm' ? 'url(#z-mos)' : 'url(#z-gra)' }, svg); });
    var gc = el('g', { 'clip-path': 'url(#z-clip)' }, svg);
    var blysk = el('rect', { x: 40, y: 64, width: 60, height: 318, fill: 'url(#z-bl)' }, gc);
    stary.parentNode.replaceChild(box, stary);
    if (!reduce && blysk.animate) {
      blysk.animate([{ transform: 'translateX(0)', offset: 0, easing: 'ease-in-out' }, { transform: 'translateX(440px)', offset: 0.16 }, { transform: 'translateX(440px)', offset: 1 }],
        { duration: 9000, iterations: Infinity, delay: 1800 });
    }
  }

  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hero && !reduce) {
    var tx = 0, ty = 0, cx = 0.7, cy = 0.35, raf = null;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      cx = (e.clientX - r.left) / r.width; cy = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    hero.addEventListener('pointerleave', function () { cx = 0.7; cy = 0.35; if (!raf) raf = requestAnimationFrame(apply); });
    function apply() {
      raf = null;
      hero.style.setProperty('--mx', (cx * 100).toFixed(1) + '%');
      hero.style.setProperty('--my', (cy * 100).toFixed(1) + '%');
      if (obr && fine) obr.style.transform = 'rotateY(' + ((cx - 0.5) * 18).toFixed(2) + 'deg) rotateX(' + (-(cy - 0.5) * 12).toFixed(2) + 'deg)';
    }
    // telefon: delikatne kołysanie znaku
    if (obr && !fine) obr.style.transform = 'rotateY(-10deg) rotateX(4deg)';
  }

  /* ---------- działy: światło za kursorem ---------- */
  document.querySelectorAll('.dzial').forEach(function (d) {
    d.addEventListener('pointermove', function (e) {
      var r = d.getBoundingClientRect();
      d.style.setProperty('--cx', (e.clientX - r.left) + 'px'); d.style.setProperty('--cy', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- proces: rysunek rysowany przewijaniem ---------- */
  var proc = document.getElementById('proces');
  var stages = [], lis = [], cmdEl, pctEl, odkr, skan;
  if (proc) {
    lis = Array.prototype.slice.call(proc.querySelectorAll('.proces-kroki li'));
    cmdEl = proc.querySelector('.cmd'); pctEl = proc.querySelector('.pct');
    odkr = proc.querySelector('.odkr-r'); skan = proc.querySelector('.skan');
    for (var i = 1; i <= 4; i++) {
      var g = proc.querySelector('.et' + i);
      var ps = Array.prototype.slice.call(g.querySelectorAll('.l'));
      ps.forEach(function (p) { p.setAttribute('pathLength', 1); p.style.strokeDasharray = p.classList.contains('przer') ? '' : '1'; p.style.strokeDashoffset = '1'; });
      stages.push({ g: g, ps: ps });
    }
  }
  var CMD = ['_PLINE  granica działki', '_PLINE  budynek i hala', '_ELEV  elewacja wsch.', '_RENDER  wizualizacja'];
  var TB = [['ANALIZA DZIAŁKI', '1:1000'], ['KONCEPCJA', '1:1000'], ['ELEWACJA WSCH.', '1:250'], ['WIZUALIZACJA', '—']];
  var planG = proc ? proc.querySelector('.plan') : null, tb2 = proc ? proc.querySelector('.tb2') : null, tb3 = proc ? proc.querySelector('.tb3') : null;
  function ease(q) { return q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2; }
  function proces() {
    if (!proc) return;
    var r = proc.getBoundingClientRect(), vh = window.innerHeight;
    var p = reduce ? 0.6 : clamp(-r.top / (r.height - vh), 0, 1);
    var si = Math.min(3, Math.floor(p * 4));
    stages.forEach(function (s, i) {
      var t = clamp((p - i * 0.25) / 0.2, 0, 1), n = s.ps.length;
      s.ps.forEach(function (path, j) {
        var tj = clamp(t * 1.6 - (j / Math.max(1, n)) * 0.6, 0, 1);
        if (path.classList.contains('przer')) path.style.opacity = (tj * 0.8).toFixed(3);
        else { path.style.strokeDasharray = tj >= 1 ? 'none' : '1'; path.style.strokeDashoffset = (1 - tj).toFixed(4); }
      });
      s.g.classList.toggle('widac', t > 0.9);
    });
    var out2 = clamp((p - 0.5) / 0.08, 0, 1), out3 = clamp((p - 0.75) / 0.14, 0, 1);
    stages[0].g.style.opacity = stages[1].g.style.opacity = (1 - out2).toFixed(3);
    stages[2].g.style.opacity = (clamp((p - 0.47) / 0.04, 0, 1) * (1 - out3)).toFixed(3);
    var q = ease(clamp((p - 0.25) / 0.16, 0, 1)), hx = 269, hy = 189;
    if (planG) planG.setAttribute('transform', 'translate(' + (hx + (320 - hx) * q).toFixed(2) + ' ' + (hy + (205 - hy) * q).toFixed(2) + ') scale(' + (1 + 0.3 * q).toFixed(4) + ') translate(' + (-hx) + ' ' + (-hy) + ')');
    var t4 = clamp((p - 0.75) / 0.2, 0, 1);
    if (odkr) { odkr.setAttribute('width', (t4 * 640).toFixed(1)); skan.setAttribute('x1', t4 * 640); skan.setAttribute('x2', t4 * 640); skan.style.opacity = t4 > 0 && t4 < 1 ? 1 : 0; }
    lis.forEach(function (li, i) { li.classList.toggle('on', i === si); });
    if (cmdEl) cmdEl.textContent = 'Polecenie: ' + CMD[si];
    if (pctEl) pctEl.textContent = Math.round(p * 100) + '%';
    if (tb2 && (tb2.textContent !== TB[si][0] || tb3.textContent !== TB[si][1])) { tb2.textContent = TB[si][0]; tb3.textContent = TB[si][1]; }
  }

  /* ---------- linia wymiarowa przewijania ---------- */
  var SEK = [['.hero', 'Start'], ['#dzialy', 'Oferta'], ['#o-nas', 'O nas'], ['#proces', 'Jak pracujemy'], ['.realizacje-ba', 'Realizacje'], ['.pasek-cta', 'Kontakt']];
  var wym = document.createElement('div'); wym.className = 'wymiar'; wym.setAttribute('aria-hidden', 'true');
  wym.innerHTML = '<div class="os"></div><div class="post"></div><div class="etk"></div>';
  document.body.appendChild(wym);
  var post = wym.querySelector('.post'), etk = wym.querySelector('.etk'), ticks = [];
  function ukladTicks() {
    ticks.forEach(function (t) { t.remove(); }); ticks = [];
    var H = document.documentElement.scrollHeight - innerHeight, L = wym.clientHeight;
    SEK.forEach(function (s) {
      var e = document.querySelector(s[0]); if (!e) return;
      var t = document.createElement('i'); t.className = 't';
      t.style.top = (clamp((e.getBoundingClientRect().top + scrollY) / H, 0, 1) * L) + 'px';
      wym.appendChild(t); ticks.push(t);
    });
  }
  function wymiar() {
    var H = document.documentElement.scrollHeight - innerHeight, L = wym.clientHeight;
    var p = H > 0 ? clamp(scrollY / H, 0, 1) : 0;
    post.style.height = (p * L) + 'px';
    var nazwa = SEK[0][1];
    SEK.forEach(function (s) { var e = document.querySelector(s[0]); if (e && e.getBoundingClientRect().top < innerHeight * 0.45) nazwa = s[1]; });
    etk.style.top = (p * L) + 'px';
    etk.innerHTML = nazwa + '<em>' + (scrollY / 100).toFixed(2).replace('.', ',') + ' m</em>';
  }

  var tick = false;
  function onScroll() { if (tick) return; tick = true; requestAnimationFrame(function () { tick = false; proces(); wymiar(); }); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { ukladTicks(); onScroll(); });
  addEventListener('load', function () { ukladTicks(); onScroll(); });
  ukladTicks(); proces(); wymiar();

  /* ---------- przed/po: model ↔ wizualizacja ---------- */
  var f = document.querySelector('.ba');
  if (f) {
    var u = f.querySelector('.uchwyt'), wiz = f.querySelector('.wiz'), szk = f.querySelector('.szk'), drag = false, x = 50;
    var set = function (v) { x = clamp(v, 0, 100); f.style.setProperty('--x', x + '%'); };
    var fromEvent = function (e) { var r = f.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
    f.addEventListener('pointerdown', function (e) { drag = true; f.setPointerCapture(e.pointerId); fromEvent(e); });
    f.addEventListener('pointermove', function (e) { if (drag) fromEvent(e); });
    f.addEventListener('pointerup', function () { drag = false; });
    f.addEventListener('pointercancel', function () { drag = false; });
    u.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { set(x - 5); e.preventDefault(); } if (e.key === 'ArrowRight') { set(x + 5); e.preventDefault(); } });
    document.querySelectorAll('.ba-tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('on')) return;
        document.querySelectorAll('.ba-tabs button').forEach(function (o) { o.classList.toggle('on', o === b); });
        f.classList.add('zmiana');
        var n = b.getAttribute('data-img'), pre = new Image(); pre.src = '/img/realizacje/' + n + '.jpg';
        setTimeout(function () {
          wiz.src = '/img/realizacje/' + n + '.jpg'; wiz.alt = b.getAttribute('data-alt'); szk.src = '/img/model/' + n + '.jpg';
          var go = function () { f.classList.remove('zmiana'); };
          if (wiz.complete) go(); else wiz.onload = go;
        }, 320);
      });
    });
    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return; io.disconnect();
        var keys = [[0, 50], [800, 34], [1700, 50]], t0 = null;
        requestAnimationFrame(function anim(ts) {
          if (drag) return; if (!t0) t0 = ts; var t = ts - t0;
          for (var i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
            var a = keys[i - 1], c = keys[i]; set(a[1] + (c[1] - a[1]) * ease((t - a[0]) / (c[0] - a[0]))); return requestAnimationFrame(anim);
          }
          set(50);
        });
      }, { threshold: 0.6 });
      io.observe(f);
    }
  }
})();
