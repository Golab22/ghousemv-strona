/* GHouse Modern Vision — wspólne skrypty */
(function () {
  'use strict';

  /* ---------- menu mobilne ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('nav.menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.classList.toggle('open', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        burger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
        document.documentElement.style.overflow = '';
      }
    });
  }

  /* ---------- kopiowanie danych kontaktowych ---------- */
  document.querySelectorAll('.kopiuj').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.dataset.cel);
      var t = el.textContent.trim();
      var done = function () { b.textContent = 'Skopiowano'; setTimeout(function () { b.textContent = 'Kopiuj'; }, 1600); };
      var zaznacz = function () { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      try { navigator.clipboard.writeText(t).then(done, zaznacz); } catch (e) { zaznacz(); }
    });
  });

  /* ---------- temat formularza z adresu (?temat=...) ---------- */
  var sel = document.getElementById('f-temat');
  if (sel) {
    var m = location.search.match(/[?&]temat=([^&]+)/);
    if (m) { var v = decodeURIComponent(m[1].replace(/\+/g, ' ')); for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === v) sel.selectedIndex = i; }
    var prod = location.search.match(/[?&]produkt=([^&]+)/);
    var ta = document.getElementById('f-wiad');
    if (prod && ta && !ta.value) ta.value = 'Dzień dobry, proszę o informacje i wycenę produktu ' + decodeURIComponent(prod[1]) + '. ';
  }

  /* ---------- pojawianie się sekcji ---------- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove('nisko'); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('nisko'); io.observe(el); }
    });
  }

  /* ---------- galeria kolekcji ---------- */
  var gal = document.querySelector('.galeria');
  if (gal) {
    var tabs = document.querySelectorAll('.tab');
    var cards = gal.querySelectorAll('.karta');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
        var c = t.dataset.cat;
        cards.forEach(function (k) { k.classList.toggle('ukryta', c !== 'all' && k.dataset.cat !== c); });
      });
    });
    var lb = document.getElementById('lb');
    var close = function () { lb.classList.remove('open'); document.documentElement.style.overflow = ''; };
    cards.forEach(function (k) {
      k.addEventListener('click', function () {
        var img = lb.querySelector('img');
        img.src = k.querySelector('img').src; img.alt = k.dataset.name;
        lb.querySelector('.kod').textContent = k.dataset.code;
        lb.querySelector('strong').textContent = k.dataset.name;
        lb.querySelector('p').textContent = k.dataset.desc;
        var ul = lb.querySelector('ul'); ul.innerHTML = '';
        k.dataset.specs.split('|').forEach(function (s) { var li = document.createElement('li'); li.textContent = s; ul.appendChild(li); });
        lb.querySelector('.btn').href = '/kontakt?temat=' + encodeURIComponent('Wykończenia ścian') + '&produkt=' + encodeURIComponent(k.dataset.code + ' ' + k.dataset.name);
        lb.classList.add('open'); document.documentElement.style.overflow = 'hidden';
        lb.querySelector('.x').focus();
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('x')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
  }


  /* ---------- przeglądarka wizualizacji na pełny ekran ---------- */
  var fotos = [].slice.call(document.querySelectorAll('.wiz.foto'));
  if (fotos.length) {
    var items = [];
    fotos.forEach(function (w) {
      var title = (w.closest('.real') && w.closest('.real').querySelector('h3')) ? w.closest('.real').querySelector('h3').textContent : '';
      var start = items.length;
      w.querySelectorAll('img').forEach(function (im) { items.push({ src: im.currentSrc || im.src, alt: im.alt, title: title }); });
      var b = document.createElement('button'); b.type = 'button'; b.className = 'powieksz'; b.textContent = 'POWIĘKSZ ⤢'; b.setAttribute('aria-label', 'Powiększ wizualizację: ' + title); w.appendChild(b);
      w.addEventListener('click', function () { openV(start); });
    });
    var v = document.createElement('div'); v.id = 'viewer'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Wizualizacja');
    v.innerHTML = '<img alt=""><div class="cap"></div><button class="prev" type="button" aria-label="Poprzednie">‹</button><button class="next" type="button" aria-label="Następne">›</button><button class="x" type="button" aria-label="Zamknij">×</button>';
    document.body.appendChild(v);
    var cur = 0, vi = v.querySelector('img'), cap = v.querySelector('.cap');
    function show(i) { cur = (i + items.length) % items.length; var it = items[cur]; vi.src = it.src; vi.alt = it.alt; cap.innerHTML = '<b>' + (cur + 1) + ' / ' + items.length + '</b>' + it.alt; }
    function openV(i) { show(i); v.classList.add('open'); document.documentElement.style.overflow = 'hidden'; v.querySelector('.x').focus(); }
    function closeV() { v.classList.remove('open'); document.documentElement.style.overflow = ''; }
    v.querySelector('.prev').addEventListener('click', function (e) { e.stopPropagation(); show(cur - 1); });
    v.querySelector('.next').addEventListener('click', function (e) { e.stopPropagation(); show(cur + 1); });
    v.querySelector('.x').addEventListener('click', closeV);
    v.addEventListener('click', function (e) { if (e.target === v) closeV(); });
    document.addEventListener('keydown', function (e) { if (!v.classList.contains('open')) return; if (e.key === 'Escape') closeV(); if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
    var tx = null; v.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    v.addEventListener('touchend', function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); tx = null; });
  }

  /* ---------- intro: logo rysowane jak w CAD (tylko strona główna, raz na sesję) ---------- */
  if (!document.body.hasAttribute('data-intro')) return;
  var seen = false;
  try { seen = !!sessionStorage.getItem('ghIntro'); } catch (e) {}
  if (seen || reduce) return;

  var NS = 'http://www.w3.org/2000/svg';
  var intro = document.createElement('div');
  intro.id = 'gh-intro';
  intro.setAttribute('aria-hidden', 'true');
  intro.innerHTML =
    '<div class="gh-grid"></div><div class="gh-stage">' +
    '<svg class="gh-logo" viewBox="118 64 318 318"><defs>' +
    '<linearGradient id="gh-mos" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6cf9c"/><stop offset=".5" stop-color="#c2a066"/><stop offset="1" stop-color="#94743f"/></linearGradient>' +
    '<linearGradient id="gh-gra" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5d6268"/><stop offset="1" stop-color="#2e3135"/></linearGradient>' +
    '<pattern id="gh-hatch-m" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="#e6cf9c" stroke-width=".8"/></pattern>' +
    '<pattern id="gh-hatch-g" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="#aeb4ba" stroke-width=".8"/></pattern>' +
    '<linearGradient id="gh-glint-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    '<clipPath id="gh-clip"><polygon points="145,272 162,272 353,88 336,88"/><polygon points="222,354 239,354 412,182 395,182"/></clipPath></defs>' +
    '<g class="gh-cons"></g><g class="gh-hatch"></g><g class="gh-fills"></g>' +
    '<g clip-path="url(#gh-clip)"><rect class="gh-glint" x="40" y="64" width="70" height="318" fill="url(#gh-glint-g)"/></g>' +
    '<g class="gh-edges"></g><g class="gh-snaps"></g></svg>' +
    '<div class="gh-name"><div class="gh-n1">GHOUSE</div><div class="gh-n2">MODERN VISION</div></div></div>' +
    '<div class="gh-cross"><i></i></div>' +
    '<svg class="gh-ucs" viewBox="0 0 46 46" fill="none" stroke="#8d99a6" stroke-width="1.2"><path d="M6 40H40M34 36l6 4-6 4M6 40V6M2 12l4-6 4 6"/><text x="40" y="33" fill="#8d99a6" stroke="none" font-size="8" font-family="monospace">X</text><text x="10" y="8" fill="#8d99a6" stroke="none" font-size="8" font-family="monospace">Y</text></svg>' +
    '<div class="gh-cmd"><span>Polecenie: <span class="gh-cmdtxt"></span><span class="gh-caret"></span></span><span class="gh-xy">X: 0.0000  Y: 0.0000  Z: 0.0000</span></div>' +
    '<button class="gh-skip" type="button">Pomiń ›</button>';
  document.body.insertBefore(intro, document.body.firstChild);
  intro.querySelector('.gh-skip').removeAttribute('aria-hidden');

  var svg = intro.querySelector('.gh-logo');
  var G = { cons: svg.querySelector('.gh-cons'), hatch: svg.querySelector('.gh-hatch'), fills: svg.querySelector('.gh-fills'), edges: svg.querySelector('.gh-edges'), snaps: svg.querySelector('.gh-snaps') };
  var glint = svg.querySelector('.gh-glint'), grid = intro.querySelector('.gh-grid');
  var n1 = intro.querySelector('.gh-n1'), n2 = intro.querySelector('.gh-n2');
  var cross = intro.querySelector('.gh-cross'), cmd = intro.querySelector('.gh-cmdtxt'), xy = intro.querySelector('.gh-xy');
  var SHAPES = [
    { c: 'g', p: [[143, 185], [143, 202], [326, 358], [326, 341]] },
    { c: 'g', p: [[268, 213], [364, 213], [364, 224], [268, 224]] },
    { c: 'g', p: [[353, 213], [364, 213], [364, 357], [353, 357]] },
    { c: 'm', p: [[145, 272], [162, 272], [353, 88], [336, 88]] },
    { c: 'm', p: [[222, 354], [239, 354], [412, 182], [395, 182]] }
  ];
  var VERTS = []; SHAPES.forEach(function (s) { s.p.forEach(function (q) { VERTS.push(q); }); });
  var anims = [], timers = [], cursorTimer = null, done = false;

  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; }
  function A(e, keys, opts) { var o = { fill: 'both', easing: 'cubic-bezier(.65,0,.2,1)' }; for (var k in opts) o[k] = opts[k]; var a = e.animate(keys, o); anims.push(a); return a; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function draw() { return [{ strokeDashoffset: '1' }, { strokeDashoffset: '0' }]; }

  if (!svg.animate) { intro.remove(); return; }
  document.documentElement.classList.add('gh-lock');

  SHAPES.forEach(function (s, si) {
    var pts = s.p.map(function (q) { return q.join(','); }).join(' ');
    var col = s.c === 'm' ? '#e6cf9c' : '#aeb4ba';
    var h = el('polygon', { points: pts, fill: 'url(#gh-hatch-' + s.c + ')', opacity: 0 }, G.hatch);
    A(h, [{ opacity: 0 }, { opacity: 0.9, offset: 0.4 }, { opacity: 0 }], { delay: 1650 + si * 60, duration: 800, easing: 'ease-in-out' });
    var f = el('polygon', { points: pts, fill: s.c === 'm' ? 'url(#gh-mos)' : 'url(#gh-gra)', opacity: 0 }, G.fills);
    A(f, [{ opacity: 0 }, { opacity: 1 }], { delay: 1950 + si * 70, duration: 550, easing: 'ease-out' });
    var edges = [];
    for (var i = 0; i < 4; i++) { var a = s.p[i], b = s.p[(i + 1) % 4]; edges.push([a, b, Math.hypot(b[0] - a[0], b[1] - a[1])]); }
    edges.forEach(function (e, i) {
      var a = e[0], b = e[1];
      if ((i + si) % 2) { var t = a; a = b; b = t; }
      var ln = el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: col, 'stroke-width': 1.3, 'stroke-linecap': 'square', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, G.edges);
      A(ln, draw(), { delay: rnd(450, 900), duration: 600 + e[2] * 1.5 });
      A(ln, [{ opacity: 1 }, { opacity: s.c === 'm' ? 0 : 0.35 }], { delay: 2350, duration: 600, easing: 'ease-out' });
    });
    edges.slice().sort(function (x, y) { return y[2] - x[2]; }).slice(0, 2).forEach(function (e, k) {
      var a = e[0], b = e[1], d = e[2], ux = (b[0] - a[0]) / d, uy = (b[1] - a[1]) / d, L = 1400;
      var p1 = [a[0] - ux * L, a[1] - uy * L], p2 = [b[0] + ux * L, b[1] + uy * L];
      if ((si + k) % 2) { var t = p1; p1 = p2; p2 = t; }
      var c = el('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: '#5fc4e8', 'stroke-width': 0.6, 'stroke-opacity': 0.45, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, G.cons);
      A(c, draw(), { delay: rnd(100, 450), duration: 1100 });
      A(c, [{ opacity: 1 }, { opacity: 0 }], { delay: 1950, duration: 500, easing: 'ease-out' });
    });
    s.p.forEach(function (q) {
      var r = el('rect', { x: q[0] - 3, y: q[1] - 3, width: 6, height: 6, fill: 'none', stroke: '#ffd54a', 'stroke-width': 0.9, opacity: 0 }, G.snaps);
      A(r, [{ opacity: 0, transform: 'scale(2.2)' }, { opacity: 1, transform: 'scale(1)', offset: 0.35 }, { opacity: 1, transform: 'scale(1)', offset: 0.7 }, { opacity: 0, transform: 'scale(1)' }], { delay: rnd(1250, 1750), duration: 700, easing: 'ease-out' });
    });
  });
  A(grid, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out' });
  A(glint, [{ transform: 'translateX(0px)' }, { transform: 'translateX(420px)' }], { delay: 2500, duration: 800, easing: 'ease-in-out' });
  A(n1, [{ opacity: 0, letterSpacing: '.7em', filter: 'blur(6px)' }, { opacity: 1, letterSpacing: '.22em', filter: 'blur(0px)' }], { delay: 2400, duration: 900, easing: 'cubic-bezier(.2,.7,.2,1)' });
  A(n2, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { delay: 2750, duration: 700, easing: 'ease-out' });
  A(cross, [{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.85 }, { opacity: 0 }], { delay: 250, duration: 1900, easing: 'linear' });

  function moveCursor() {
    var q = VERTS[Math.floor(Math.random() * VERTS.length)];
    var m = svg.getScreenCTM(); if (!m) return;
    var p = svg.createSVGPoint(); p.x = q[0]; p.y = q[1]; p = p.matrixTransform(m);
    cross.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)';
    xy.textContent = 'X: ' + q[0].toFixed(4) + '  Y: ' + (446 - q[1]).toFixed(4) + '  Z: 0.0000';
  }
  function finish() {
    if (done) return; done = true;
    timers.forEach(clearTimeout); clearInterval(cursorTimer);
    intro.classList.add('gh-hide');
    document.documentElement.classList.remove('gh-lock');
    setTimeout(function () { intro.remove(); }, 800);
    try { sessionStorage.setItem('ghIntro', '1'); } catch (e) {}
  }
  function skip() { anims.forEach(function (a) { try { a.finish(); } catch (e) {} }); finish(); }

  later(function () { cmd.textContent = '_XLINE'; }, 100);
  later(function () { cmd.textContent = '_LINE'; }, 500);
  later(function () { cmd.textContent = '_HATCH'; }, 1500);
  later(function () { cmd.textContent = '_REGEN'; }, 1950);
  later(function () { cmd.textContent = 'Model gotowy'; }, 2450);
  later(function () { moveCursor(); cursorTimer = setInterval(moveCursor, 150); }, 250);
  later(function () { clearInterval(cursorTimer); }, 2100);
  later(finish, 4000);
  intro.querySelector('.gh-skip').addEventListener('click', skip);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !done) skip(); });
})();
