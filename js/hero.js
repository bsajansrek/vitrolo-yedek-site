/* Vitrolo — hero.js · Home imza sahnesi (W1 boş vitrin canlı siteye döner + W7 adını yaz). */
(function () {
  var VT = window.VT, C = VT.C, $ = VT.$, $$ = VT.$$;
  var vs = $('#vs'); if (!vs) return;
  var DEF = "Rosa's Kitchen";
  var input = $('[data-name-input]'), board = $('.vs__board'), nm = $('.vs__name');
  var cur = DEF, userTyped = false, cycling = null;

  function slug(s) { return (s.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20) || 'yourbusiness') + '.com'; }
  function fit() {
    var unit = vs.clientWidth / 100; if (!unit) return;
    nm.style.fontSize = '10px'; var w = nm.scrollWidth || 1;
    var px = Math.min(5.4 * unit, (board.clientWidth * 0.9) / w * 10);
    nm.style.fontSize = (px / unit).toFixed(3) + 'cqw';
  }
  function setName(txt) {
    cur = txt; var len = txt.length;
    $$('[data-biz]').forEach(function (e) { e.textContent = txt; });
    $$('[data-url]').forEach(function (e) { e.textContent = slug(txt); });
    var h = $('.ms-h'); if (h) h.setAttribute('data-size', len > 18 ? 'lg' : len > 11 ? 'md' : '');
    fit();
  }
  VT.setBusinessName = setName;

  /* ----- W7: giriş kutusu (her modda çalışır; ağ isteği YOK) ----- */
  if (input) {
    var saved = ''; try { saved = sessionStorage.getItem('vt-name') || ''; } catch (e) { }
    if (saved) { input.value = saved; userTyped = true; setName(saved); }
    input.addEventListener('input', function () {
      userTyped = true; stopCycle();
      var v = input.value.replace(/\s+/g, ' ').slice(0, 28);
      try { sessionStorage.setItem('vt-name', v.trim()); } catch (e) { }
      setName(v.trim() || DEF);
    });
    input.addEventListener('focus', stopCycle);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setName(cur); });
  window.addEventListener('resize', fit);

  /* ----- örnek adların daktilo döngüsü (yalnız hareket modu, hero görünürken, kullanıcı yazmadıkça) ----- */
  var curFull = DEF;
  function stopCycle() { if (cycling) { clearTimeout(cycling); cycling = null; if (!userTyped) setName(curFull); } }
  function startCycle() {
    if (!VT.MO || userTyped) return;
    var list = C.name.samples, i = 0;
    function typeOut(txt, k) {
      if (userTyped) return;
      if (window.scrollY > 60) { stopCycle(); return; }
      curFull = txt;
      if (k <= txt.length) { setName(txt.slice(0, k) || ' '); cycling = setTimeout(function () { typeOut(txt, k + 1); }, C.name.typeSpeed * 1000); }
      else cycling = setTimeout(function () { erase(txt, txt.length); }, C.name.hold * 1000);
    }
    function erase(txt, k) {
      if (userTyped) return;
      if (window.scrollY > 60) { stopCycle(); return; }
      curFull = txt;
      if (k > 0) { setName(txt.slice(0, k - 1) || ' '); cycling = setTimeout(function () { erase(txt, k - 1); }, C.name.eraseSpeed * 1000); }
      else { i = (i + 1) % list.length; typeOut(list[i], 1); }
    }
    cycling = setTimeout(function () { erase(DEF, DEF.length); }, C.name.startDelay * 1000 + C.name.hold * 1000);
  }
  VT.init('hero-name', startCycle);

  /* ----- GSAP sahnesi ----- */
  VT.scene('hero', function (mm) {
    var T = C.hero.t, E = C.hero.ease;
    mm.add({ desk: '(min-width:1024px)', phone: '(max-width:1023px)' }, function (ctx) {
      var desk = ctx.conditions.desk;
      var copy = $('.hero__copy'), cap1 = $('.cap1'), cap2 = $('.cap2'), cap2btn = $('.cap2 .btns');
      var outline = $('.vs__outline rect'), paper = $('.vs__paper'), dim = $('.vs__dim'), lights = $('.vs__lights'), sks = $$('.vs .sk');
      var closed = $('.vs__closed'), open = $('.vs__open'), tiles = $$('.ms-tiles i'), btn = $('.ms-btn'), replay = $('[data-replay]');
      gsap.set(outline, { opacity: 0, strokeDashoffset: 1 });
      gsap.set(paper, { opacity: 0 }); gsap.set(dim, { opacity: 0 }); gsap.set(lights, { opacity: 0 }); gsap.set(board, { opacity: 0.45 });
      gsap.set(sks, { clipPath: 'inset(0 100% 0 0)', opacity: 1 });
      gsap.set(closed, { scaleX: 1 }); gsap.set(open, { scaleX: 0 });
      gsap.set(tiles, { scale: 0.9 });
      if (desk) { gsap.set([cap1, cap2], { autoAlpha: 0 }); gsap.set(cap2btn, { autoAlpha: 0, y: 12 }); }

      var tl = gsap.timeline({ paused: !desk, defaults: { ease: 'none' } });
      if (desk) {
        tl.to(copy, { autoAlpha: 0, y: -48, duration: T.copyOutDur, ease: E.caps }, T.copyOut);
        tl.fromTo(cap1, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: T.cap1Dur, ease: E.caps }, T.cap1In);
        tl.to(cap1, { autoAlpha: 0, y: -48, duration: T.cap2Dur, ease: E.caps }, T.cap2At);
        tl.fromTo(cap2, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: T.cap2Dur, ease: E.caps }, T.cap2At + 0.25);
        tl.to(cap2btn, { autoAlpha: 1, y: 0, duration: T.endDur, ease: E.caps }, T.endIn);
      }
      // tarayıcı çerçevesi çizilir
      tl.to(outline, { opacity: 1, duration: 0.2 }, T.chrome);
      tl.to(outline, { strokeDashoffset: 0, duration: T.chromeDur, ease: E.chrome }, T.chrome);
      // iskelet
      tl.to(paper, { opacity: 1, duration: T.skeletonDur, ease: 'power2.out' }, T.skeleton - 0.1);
      tl.to(dim, { opacity: 0.55, duration: T.skeletonDur }, T.skeleton - 0.1);
      tl.to(sks, { clipPath: 'inset(0 0% 0 0)', duration: T.skeletonDur, ease: 'power2.out', stagger: T.skeletonStagger }, T.skeleton);
      // içerik gelir (iskelet perdesi sağa çekilir)
      tl.to(sks, { clipPath: 'inset(0 0% 0 100%)', duration: T.fillDur, ease: E.fill, stagger: T.fillStagger }, T.fill);
      tl.to(tiles, { scale: 1, duration: T.fillDur, ease: E.fill, stagger: T.fillStagger }, T.fill + 0.2);
      tl.fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.6, ease: E.sign, transformOrigin: '0 50%' }, T.fill + T.fillStagger * 4 + 0.2);
      // ışık
      tl.to(dim, { opacity: 0, duration: T.lightDur, ease: E.light }, T.light);
      tl.to(lights, { opacity: 1, duration: T.lightDur, ease: E.light }, T.light);
      tl.to(board, { opacity: 1, duration: T.lightDur, ease: E.light }, T.light);
      // tabela CLOSED -> OPEN
      tl.to(closed, { scaleX: 0, duration: T.signDur * 0.4, ease: 'power2.in' }, T.sign);
      tl.to(open, { scaleX: 1, duration: T.signDur * 0.6, ease: E.sign }, T.sign + T.signDur * 0.4);
      tl.set({}, {}, T.total); // süreyi sabitle

      var st;
      if (desk) {
        tl.duration(T.total);
        st = ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: C.hero.scrub, animation: tl });
      } else {
        tl.timeScale(T.total / C.hero.mobileDur);
        if (replay) { replay.hidden = false; replay.onclick = function () { tl.restart(); }; }
        st = ScrollTrigger.create({ trigger: vs, start: 'top 72%', once: true, onEnter: function () { tl.play(0); } });
      }

      // W1: imleç camın üstünde gezinince içindeki site hafifçe kayar
      var move = null;
      if (VT.fine.matches) {
        var ms = $('.vs__paper'), refl = $('.vs__refl');
        var qx = gsap.quickTo(ms, 'x', { duration: 0.8, ease: 'power3.out' }), qy = gsap.quickTo(ms, 'y', { duration: 0.8, ease: 'power3.out' });
        var rx = gsap.quickTo(refl, 'x', { duration: 1.1, ease: 'power3.out' });
        move = function (e) { var r = vs.getBoundingClientRect(); var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; var u = r.width / 100; qx(-px * 1.6 * u * 0.5); qy(-py * 1.2 * u * 0.5); rx(px * 5 * u * 0.5); };
        vs.addEventListener('pointermove', move);
      }
      return function () { if (move) vs.removeEventListener('pointermove', move); if (replay) { replay.hidden = true; replay.onclick = null; } if (st) st.kill(); tl.kill(); };
    });
  });
})();
