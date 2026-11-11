/* Vitrolo — v3.js · 2026-11-06 · site v3 gösteri sahneleri. Kaynak: uretim-araci/v3/assets/js/v3.js (build kopyalar). GSAP gerektirmez.
   Her döngü: ekran dışında ve sekme gizliyken durur, Duraklat düğmesi var (WCAG 2.2.2). Bir kez oynayanlar ≤ 5 sn + Replay.
   Hareket azaltma / ?static=1 (html.static): hiçbir şey oynamaz; sahneler CSS'te son karededir, seçiciler anında çalışır. */
(function () {
  var html = document.documentElement, MO = html.classList.contains('mo');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var loops = [];

  /* ---------- döngü: adımlar [fn, ms]; görünürlük + sekme + kullanıcı duraklatması ---------- */
  function Loop(el, steps, btn) {
    var L = { i: 0, t: null, vis: false, user: false, ready: false, steps: steps };
    function can() { return MO && L.ready && L.vis && !L.user && !document.hidden; }
    L.run = function () {
      clearTimeout(L.t); if (!can()) return;
      var s = L.steps[L.i]; try { s[0](); } catch (e) { console.error('[v3]', e); return; }
      L.t = setTimeout(function () { L.i = (L.i + 1) % L.steps.length; L.run(); }, s[1]);
    };
    L.stop = function () { clearTimeout(L.t); };
    L.resume = function () { if (can()) L.run(); else L.stop(); el.classList.toggle('paused', !can()); };
    L.setUser = function (p) {
      L.user = p;
      if (btn) { btn.setAttribute('aria-pressed', p ? 'true' : 'false'); btn.textContent = p ? 'Play' : 'Pause'; }
      L.resume();
    };
    if (btn) btn.addEventListener('click', function () { L.setUser(!L.user); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (en) { var v = en.isIntersecting; if (v !== L.vis) { L.vis = v; L.resume(); } }); }, { threshold: 0.12 }).observe(el);
    } else L.vis = true;
    loops.push(L);
    return L;
  }
  document.addEventListener('visibilitychange', function () { loops.forEach(function (l) { l.resume(); }); });

  /* görününce bir kez (+ Replay) */
  function once(el, fn, margin) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { io.disconnect(); fn(); } }); }, { rootMargin: margin || '0px 0px -20% 0px', threshold: 0.05 });
    io.observe(el);
  }
  function playOnce(el, dur) {
    if (!MO || !el) return;
    clearTimeout(el._t); el.classList.remove('done', 'play'); void el.offsetWidth; el.classList.add('play');
    el._t = setTimeout(function () { el.classList.remove('play'); el.classList.add('done'); }, dur);
  }

  /* ================================================================ 1 · HERO */
  (function hero() {
    var st = $('#bd-st'); if (!st) return;
    var tpls = $$('[data-biz-tpl]'), slots = $$('[data-slot]', st), cur = $('.bd-cur', st), sw = $('.bd-swatch', st), swn = $('[data-sw-name]', st);
    var url = $('.bd-desk [data-url]', st), now = $('[data-now]'), meta = $('[data-now-meta]'), chips = $$('[data-pick]'), steps = $$('.bd-steps li');
    var bi = 0;
    load.n = 0;
    $$('.bd-cols i', st).forEach(function (c, i) { c.style.setProperty('--n', i); });
    function setB(n) {
      st.setAttribute('data-b', n);
      steps.forEach(function (li) { li.classList.toggle('on', +li.getAttribute('data-l') <= n); });
    }
    function point(x, y, tap) { st.style.setProperty('--cx', x + '%'); st.style.setProperty('--cy', y + '%'); if (tap) { cur.classList.remove('tap'); void cur.offsetWidth; cur.classList.add('tap'); } }
    function load(i) {
      bi = i; var t = tpls[i];
      slots.forEach(function (s) { if (!load.n && s.querySelector('[data-slug="' + t.getAttribute('data-biz-tpl') + '"]')) return; s.innerHTML = t.innerHTML; }); /* ilk örnek HTML'de hazır: yeniden yazma (LCP) */
      if (load.n++) slots.forEach(function (s) { s.classList.add('rot'); }); /* sonraki örnekler LCP adayı olmasın: %0,8 küçük */
      var slug = t.getAttribute('data-biz-tpl'), nm = t.getAttribute('data-name');
      if (url) url.textContent = 'vitrolo.com/samples/' + slug;
      if (now) { now.textContent = nm; now.setAttribute('href', '/vitrolo-yedek-site/samples/' + slug + '/'); }
      if (meta) meta.textContent = '· ' + t.getAttribute('data-style') + ' style · code ' + t.getAttribute('data-code') + ' · concept, fictional business';
      chips.forEach(function (c, k) { c.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      var mq = $('.mq', slots[0]), cs = getComputedStyle(mq);
      ['--bg', '--ac', '--pop'].forEach(function (v, k) { sw.style.setProperty('--sw' + (k + 1), mq.style.getPropertyValue(v) || cs.getPropertyValue(v)); });
      if (swn) swn.textContent = t.getAttribute('data-pal');
    }
    var seq = [
      [function () { st.classList.remove('out'); setB(1); point(14, 22); }, 600],
      [function () { setB(2); point(30, 36, 1); }, 700],
      [function () { setB(3); point(36, 58, 1); st.style.setProperty('--sx', '41%'); st.style.setProperty('--sy', '64%'); }, 700],
      [function () { setB(4); point(64, 40, 1); }, 850],
      [function () { setB(5); point(86, 70, 1); }, 3800],
      [function () { st.classList.add('out'); }, 380],
      [function () { load((bi + 1) % tpls.length); setB(0); }, 140]
    ];
    if (!MO) { load(0); setB(5); chips.forEach(function (c, k) { c.addEventListener('click', function () { load(k); }); }); return; }
    var L = Loop(st, seq, $('[data-pause]'));
    chips.forEach(function (c, k) { c.addEventListener('click', function () { L.stop(); st.classList.add('out'); setTimeout(function () { load(k); setB(0); L.i = 0; L.t = null; L.resume(); if (L.user) { setB(5); st.classList.remove('out'); } }, 200); }); });
    load(0); setB(1); point(14, 22); /* 2026-11-08: ilk karede tarayıcı görünür (gerçek ekran görüntüsü LCP'si animasyonu beklemesin) */
    setTimeout(function () { L.ready = true; L.resume(); }, html.classList.contains('vti') ? 520 : 150);
  })();

  /* ================================================================ 2 · üç görünüm */
  (function looks() {
    var box = $('.lk__box'); if (!box) return;
    var data = JSON.parse(($('#lk-data') || {}).textContent || '{}');
    var t = '3', c = 'A', auto = ['3A', '3B', '3C', '1A', '1B', '1C', '2A', '2B', '2C'], ai = 0;
    var mqs = $$('.lk-slot .mq', box), code = $('[data-code]', box), out = $('[data-out]', box);
    var sb = $$('.lk-b', box), cb = $$('.lk-c', box);
    var names = { '1': 'Motion', '2': 'Classic', '3': 'Bold' };
    function swatches() {
      'ABC'.split('').forEach(function (L) {
        var d = data[t + L]; if (!d) return;
        var i = $('[data-sw="' + L + '"]', box); if (i) i.style.background = 'conic-gradient(' + d.sw[0] + ' 0 50%,' + d.sw[1] + ' 50% 80%,' + d.sw[2] + ' 80%)';
        var n = $('[data-pn="' + L + '"]', box); if (n) n.textContent = d.pal;
      });
    }
    function apply(nt, nc, anim) {
      var d = data[nt + nc]; if (!d) return;
      if (anim && MO) {
        mqs.forEach(function (m) {
          var scr = m.closest('.dv-scr'), g = document.createElement('div'); g.className = 'lk-ghost'; g.setAttribute('aria-hidden', 'true');
          g.appendChild(m.cloneNode(true)); scr.appendChild(g);
          requestAnimationFrame(function () { requestAnimationFrame(function () { g.classList.add('go'); }); });
          setTimeout(function () { g.remove(); }, 800);
        });
      }
      t = nt; c = nc;
      mqs.forEach(function (m) {
        m.className = 'mq mq--' + d.style; m.setAttribute('style', d.css);
        if (d.img) { var ph = !!m.closest('.dv-ph'), im = m.querySelector(ph ? '.mq-sp' : '.mq-sd'); if (im) { if (!ph && d.img[2]) im.srcset = d.img[2] + ' 600w, ' + d.img[0] + ' 1200w'; im.src = ph ? d.img[1] : d.img[0]; } } /* 2026-11-08: gerçek ekran görüntüsü */
      });
      code.textContent = t + c;
      out.textContent = names[t] + ' · ' + d.pal + ' · code ' + t + c;
      sb.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-t') === t ? 'true' : 'false'); });
      cb.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-c') === c ? 'true' : 'false'); });
      swatches();
    }
    swatches();
    var L = null;
    function manual() { if (L && !L.user) L.setUser(true); }
    sb.forEach(function (b) { b.addEventListener('click', function () { manual(); apply(b.getAttribute('data-t'), c, true); }); });
    cb.forEach(function (b) { b.addEventListener('click', function () { manual(); apply(t, b.getAttribute('data-c'), true); }); });
    if (!MO) return;
    L = Loop(box, [[function () { ai = (ai + 1) % auto.length; apply(auto[ai][0], auto[ai][1], true); }, 2600]], $('[data-lk-pause]', box));
    L.i = 0; setTimeout(function () { L.ready = true; L.resume(); }, 1800);
  })();

  /* ================================================================ 3 · QR menü */
  (function qrm() {
    var tb = $('.qm-table'); if (!tb || !MO) return;
    var q = function (n) { return function () { tb.setAttribute('data-q', n); }; };
    tb.setAttribute('data-q', '0');
    var L = Loop(tb, [[q(0), 700], [q(1), 900], [q(2), 900], [q(3), 800], [q(4), 1700], [q(5), 1000], [q(6), 3400]], $('[data-qm-pause]'));
    L.ready = true; L.resume();
  })();

  /* ================================================================ 4-5 · logo kiti, sosyal set (bir kez + Replay) */
  var lg = $('[data-lg]'), so = $('[data-so]');
  once(lg, function () { playOnce(lg, 4800); });
  once(so, function () { playOnce(so, 3200); });
  var r1 = $('[data-lg-replay]'), r2 = $('[data-so-replay]');
  if (r1) r1.addEventListener('click', function () { playOnce(lg, 4800); });
  if (r2) r2.addEventListener('click', function () { playOnce(so, 3200); });

  /* ================================================================ 6 · vaka dosyaları: sekmeler (ok tuşları) + oynatma */
  (function cases() {
    var tabs = $$('.cf-tabs [role=tab]'), panels = $$('.cf-p');
    function show(i, focus) {
      tabs.forEach(function (t, k) { var on = k === i; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
      panels.forEach(function (p, k) { p.hidden = k !== i; });
      if (focus) tabs[i].focus();
      playOnce(panels[i], 3000);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (e.key === 'Home') k = -i; if (e.key === 'End') k = tabs.length - 1 - i;
        if (k === undefined) return; e.preventDefault(); show((i + k + tabs.length) % tabs.length, true);
      });
    });
    var first = panels[0]; if (first) once(first, function () { playOnce(first, 3000); });
    $$('[data-cf]').forEach(function (el) { if (!el.classList.contains('cf-p')) once(el, function () { playOnce(el, 3000); }); });
    var rp = $('[data-cf-replay]');
    if (rp) rp.addEventListener('click', function () { var p = panels.filter(function (x) { return !x.hidden; })[0]; playOnce(p, 3000); });
  })();

  /* ================================================================ 7 · 24 saat kadranı: kaydırmaya bağlı (otomatik hareket yok) */
  (function clock() {
    var ck = $('.ck'); if (!ck || !MO) return;
    var items = $$('.ck-i', ck), dots = $$('.ck-dot', ck), rd = $('[data-ck-h]', ck), raf = 0;
    function upd() {
      raf = 0;
      var r = ck.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < -50 || r.top > vh + 50) return;
      var p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height * 0.75)));
      ck.style.setProperty('--p', p.toFixed(4));
      var h = p * 24; if (rd) rd.textContent = Math.round(h);
      var curI = -1;
      items.forEach(function (it, k) { var on = h + 0.01 >= +it.getAttribute('data-h'); it.classList.toggle('on', on); if (on) curI = k; });
      items.forEach(function (it, k) { it.classList.toggle('cur', k === curI); });
      dots.forEach(function (d) { d.classList.toggle('on', h + 0.01 >= +d.getAttribute('data-h')); });
    }
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    window.addEventListener('resize', upd); upd();
  })();

  /* geç font: sahne ekrana 1 ekran kala .fl alır (font indirmesi o an başlar) */
  $$('[data-fl]').forEach(function (el) {
    if (!('IntersectionObserver' in window)) { el.classList.add('fl'); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { el.classList.add('fl'); io.disconnect(); } }); }, { rootMargin: '0px 0px 60% 0px' });
    io.observe(el);
  });
  html.classList.add('v3-ok');
})();
