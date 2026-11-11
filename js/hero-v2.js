/* Vitrolo — hero-v2.js · 2026-11-06 · Home girişi v2. (hero.js v1 yerinde durur; bu dosya onun yerine yüklenir.)
   Sıra: marka açılışı (CSS, ≤1 sn) → vitrin kendiliğinden yanar (≈2,3 sn) → camda gerçek örnek sitelerimiz sırayla döner.
   Kullanıcı adını yazarsa döngü durur, camda onun sitesi görünür. Duraklat düğmesi (WCAG 2.2.2), sekme/ekran dışında durur.
   Hareket azaltma / ?static=1: sahne son hâlinde, döngü yok. Değerler: config.js → hero2. */
(function () {
  var VT = window.VT, C = VT.C, $ = VT.$, $$ = VT.$$, html = document.documentElement;
  var vs = $('#vs'); if (!vs) return;
  var H = C.hero2 || { start: 0.25, introStart: 0.78, show: 3.8, wipe: 0.7, pan: 0.6 };
  var DEF = 'Your Business';
  var input = $('[data-name-input]'), board = $('.vs__board'), nm = $('.vs__name');
  var lbl = $('[data-now-lbl]'), link = $('[data-now-link]'), pbtn = $('[data-pause]'), ptxt = $('[data-pause-t]');
  var shows = $$('.vs__show'), si = -1, playing = false, paused = false, userTyped = false, ready = false, onScreen = true, timer = null;
  var hasG = !!window.gsap && VT.MO;

  function slug(s) { return (s.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20) || 'yourbusiness') + '.com'; }
  function fit() {
    var unit = vs.clientWidth / 100; if (!unit) return;
    nm.style.fontSize = '10px'; var w = nm.scrollWidth || 1;
    var px = Math.min(5.4 * unit, (board.clientWidth * 0.9) / w * 10);
    nm.style.fontSize = (px / unit).toFixed(3) + 'cqw';
  }
  function setName(txt, anim) {
    $$('[data-biz]').forEach(function (e) { e.textContent = txt; });
    $$('[data-url]').forEach(function (e) { e.textContent = slug(txt); });
    var h = $('.ms-h'); if (h) h.setAttribute('data-size', txt.length > 18 ? 'lg' : txt.length > 11 ? 'md' : '');
    fit();
    if (anim && hasG) gsap.fromTo(nm, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
  }
  VT.setBusinessName = setName;
  function now(text, href, label) { if (lbl) lbl.textContent = label || 'In the window:'; if (link) { link.textContent = text; link.setAttribute('href', href); } }

  /* ----- örnek siteler camda ----- */
  function load() { shows.forEach(function (im) { if (!im.getAttribute('src')) im.setAttribute('src', im.getAttribute('data-src')); }); }
  function show(i) {
    var prev = shows[si], im = shows[i]; si = i;
    var ph = $('.vs__panel').clientHeight, ih = im.clientHeight || ph * 1.6, dist = Math.max(0, ih - ph);
    gsap.killTweensOf(im); gsap.set(im, { y: 0, zIndex: 3, opacity: 1 });
    if (prev && prev !== im) gsap.set(prev, { zIndex: 2 });
    gsap.fromTo(im, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: H.wipe, ease: 'power3.inOut', onComplete: function () { shows.forEach(function (o) { if (o !== im) gsap.set(o, { opacity: 0, zIndex: 1 }); }); } });
    gsap.to(im, { y: -dist * H.pan, duration: H.show, ease: 'sine.inOut', delay: H.wipe * 0.6 });
    setName(im.getAttribute('data-name'), true);
    now(im.getAttribute('data-name'), im.getAttribute('data-url'));
  }
  function tick() { if (!playing) return; show((si + 1) % shows.length); timer = setTimeout(tick, H.show * 1000); }
  function play() {
    if (!hasG || !ready || playing || paused || userTyped || !onScreen || document.hidden || !shows.length) return;
    playing = true; load();
    var first = shows[(si + 1) % shows.length];
    var go = function () { if (playing) { clearTimeout(timer); tick(); } };
    if (first.decode) first.decode().then(go, go); else go();
  }
  function stop() { playing = false; clearTimeout(timer); timer = null; }
  function hideShows() { if (hasG) gsap.to(shows, { opacity: 0, duration: 0.3, overwrite: 'auto' }); si = -1; }
  if (pbtn) pbtn.addEventListener('click', function () {
    paused = !paused; pbtn.setAttribute('aria-pressed', paused); if (ptxt) ptxt.textContent = paused ? 'Play' : 'Pause';
    if (paused) { stop(); shows.forEach(function (o) { gsap.killTweensOf(o, 'y'); }); } else play();
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; if (onScreen) play(); else stop(); }, { threshold: 0.15 }).observe(vs);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else play(); });

  /* ----- adını yaz (her modda; ağ isteği YOK) ----- */
  function typed(v) {
    userTyped = !!v;
    if (userTyped) { stop(); hideShows(); setName(v); now('your free draft', '/vitrolo-yedek-site/free-draft', 'Next in the window:'); }
    else { setName(DEF); now('our concept sites', '/vitrolo-yedek-site/work'); play(); }
  }
  if (input) {
    var saved = ''; try { saved = sessionStorage.getItem('vt-name') || ''; } catch (e) { }
    if (saved) { input.value = saved; typed(saved); }
    input.addEventListener('input', function () {
      var v = input.value.replace(/\s+/g, ' ').slice(0, 28).trim();
      try { sessionStorage.setItem('vt-name', v); } catch (e) { }
      typed(v);
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(); });
  window.addEventListener('resize', fit);
  if (!userTyped) setName(DEF);

  /* ----- GSAP sahnesi: vitrin yanar, sonra döngü ----- */
  VT.scene('hero2', function (mm) {
    mm.add({ desk: '(min-width:1024px)', phone: '(max-width:1023px)' }, function (ctx) {
      var desk = ctx.conditions.desk;
      var outline = $('.vs__outline rect'), paper = $('.vs__paper'), dim = $('.vs__dim'), lights = $('.vs__lights'), sks = $$('.vs .sk');
      var closed = $('.vs__closed'), open = $('.vs__open'), tiles = $$('.ms-tiles i'), btn = $('.ms-btn');
      gsap.set(outline, { opacity: 0, strokeDashoffset: 1 });
      gsap.set(paper, { opacity: 0 }); gsap.set(dim, { opacity: 0 }); gsap.set(lights, { opacity: 0 }); gsap.set(board, { opacity: 0.45 });
      gsap.set(sks, { clipPath: 'inset(0 100% 0 0)', opacity: 1 });
      gsap.set(closed, { scaleX: 1 }); gsap.set(open, { scaleX: 0 }); gsap.set(tiles, { scale: 0.9 });
      var tl = gsap.timeline({ paused: true, onComplete: function () { ready = true; if (pbtn) pbtn.hidden = false; play(); } });
      tl.to(outline, { opacity: 1, duration: 0.15 }, 0)
        .to(outline, { strokeDashoffset: 0, duration: 0.7, ease: 'power1.inOut' }, 0)
        .to(paper, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 0.35)
        .to(dim, { opacity: 0.55, duration: 0.35 }, 0.35)
        .to(sks, { clipPath: 'inset(0 0% 0 0)', duration: 0.35, ease: 'power2.out', stagger: 0.04 }, 0.45)
        .to(sks, { clipPath: 'inset(0 0% 0 100%)', duration: 0.5, ease: 'power3.out', stagger: 0.07 }, 0.95)
        .to(tiles, { scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.07 }, 1.0)
        .fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.45, ease: 'back.out(1.7)', transformOrigin: '0 50%' }, 1.3)
        .to(dim, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 1.35)
        .to(lights, { opacity: 1, duration: 0.6, ease: 'power2.inOut' }, 1.35)
        .to(board, { opacity: 1, duration: 0.6, ease: 'power2.inOut' }, 1.35)
        .to(closed, { scaleX: 0, duration: 0.18, ease: 'power2.in' }, 1.75)
        .to(open, { scaleX: 1, duration: 0.32, ease: 'back.out(1.7)' }, 1.93);
      var st = null, dl = null;
      if (desk) dl = gsap.delayedCall(html.classList.contains('vti') ? H.introStart : H.start, function () { tl.play(0); });
      else st = ScrollTrigger.create({ trigger: vs, start: 'top 82%', once: true, onEnter: function () { tl.play(0); } });

      // derinlik: imleçle üç katman farklı hızda kayar (arka duvar < cam < kapı/tabela), cam yansıması ters yönde
      var move = null;
      if (VT.fine.matches) {
        var L = [[$('.vs__bg'), 0.35], [$('.vs__win'), 0.8], [$('.vs__door'), 1.3], [board, 1.0], [$('.vs__refl'), -2.2]];
        var q = L.map(function (l) { return [gsap.quickTo(l[0], 'x', { duration: 0.9, ease: 'power3.out' }), gsap.quickTo(l[0], 'y', { duration: 0.9, ease: 'power3.out' }), l[1]]; });
        move = function (e) {
          var r = vs.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5, u = r.width / 100;
          q.forEach(function (k) { k[0](-px * k[2] * u); k[1](-py * k[2] * u * 0.6); });
        };
        vs.addEventListener('pointermove', move);
      }
      return function () { if (move) vs.removeEventListener('pointermove', move); if (st) st.kill(); if (dl) dl.kill(); tl.kill(); stop(); };
    });
  });
})();
