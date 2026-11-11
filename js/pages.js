/* Vitrolo — pages.js · iç sayfa sahneleri: Services halkası (W2), tarayıcı mini sahnesi, QR (W3), harita (W4), logo, zaman çizgisi (W5b), Hakkımızda, Work demoları, saatler, SSS araması. */
(function () {
  var VT = window.VT, C = VT.C, $ = VT.$, $$ = VT.$$;
  var ST = function (o) { return ScrollTrigger.create(o); };
  var onceST = function (trigger, tl, start) { return ST({ trigger: trigger, start: start || 'top 78%', once: true, onEnter: function () { tl.play(); } }); };

  /* =============== her modda: SSS araması =============== */
  VT.init('faq', function () {
    var q = $('#faq-q'); if (!q) return;
    var items = $$('details[data-faq]'), groups = $$('[data-group]'), cnt = $('#faq-count'), none = $('#faq-nores');
    function norm(s) { return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' '); }
    var texts = items.map(function (d) { return norm(d.textContent); });
    q.addEventListener('input', function () {
      var v = norm(q.value).trim(), n = 0;
      items.forEach(function (d, i) { var m = !v || texts[i].indexOf(v) > -1; d.hidden = !m; if (m) n++; });
      groups.forEach(function (g) { g.hidden = !$$('details[data-faq]:not([hidden])', g).length; });
      none.hidden = n > 0; cnt.textContent = v ? (n ? n + (n === 1 ? ' question found' : ' questions found') : '') : '';
    });
  });

  /* =============== her modda: Work karşılaştırma kaydırıcısı =============== */
  VT.init('ba', function () {
    $$('.ba').forEach(function (ba) { var r = $('.ba__r', ba); r.addEventListener('input', function () { ba.style.setProperty('--p', r.value + '%'); }); });
  });

  /* =============== her modda: saatler (Hakkımızda) =============== */
  VT.init('clocks', function () {
    var root = $('[data-scene="clocks"]'); if (!root) return;
    function tick() {
      $$('.clock', root).forEach(function (c) {
        var tz = c.dataset.tz, d = new Date();
        var t = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(d);
        var h = +new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', hour12: false }).format(d);
        var day = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long' }).format(d);
        $('.clock__t', c).textContent = t; $('.clock__d', c).textContent = day + (h >= 7 && h < 20 ? ', daytime' : ', night');
        c.dataset.night = (h >= 7 && h < 20) ? '0' : '1';
      });
    }
    tick(); setInterval(tick, 20000);
  });

  /* =============== Services halkası: adım durumu =============== */
  function setStep(root, i, animate) {
    var lr = $('.lr', root); if (!lr) return;
    lr.setAttribute('data-step', i);
    $$('.lp', root).forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    if (window.gsap && VT.MO) {
      var target = [-65, -190, -305, -360][i], tg = [$('.lr__arcs', lr), $('.lr__orbit', lr)];
      gsap.to(tg, { rotation: target, svgOrigin: '50 50', duration: animate === false ? 0 : C.loop.stepDur, ease: C.loop.ease, overwrite: true });
    }
  }
  var loopSticky = null;
  VT.init('loop', function () {
    var root = $('[data-scene="loop"]'); if (!root) return;
    $$('.lp', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.dataset.i;
        if (loopSticky && VT.desk.matches) { var st = loopSticky; window.scrollTo({ top: st.start + (i + 0.5) / 4 * (st.end - st.start), behavior: 'smooth' }); }
        else setStep(root, i);
      });
    });
  });
  VT.scene('loop', function (mm) {
    var root = $('[data-scene="loop"]'); if (!root) return;
    mm.add('(min-width:1024px)', function () {
      var last = -1;
      var st = loopSticky = ST({ trigger: root, start: 'top top', end: 'bottom bottom', onUpdate: function (s) { var i = Math.min(3, Math.floor(s.progress * 4)); if (i !== last) { last = i; setStep(root, i); } } });
      setStep(root, 0, false); last = 0;
      return function () { st.kill(); loopSticky = null; root.querySelector('.lr').removeAttribute('data-step'); gsap.set([$('.lr__arcs', root), $('.lr__orbit', root)], { clearProps: 'all' }); };
    });
    mm.add('(max-width:1023px)', function () {
      var lr = $('.lr', root); gsap.set(lr, { opacity: 0, scale: 0.92 });
      var tl = gsap.timeline({ paused: true }).to(lr, { opacity: 1, scale: 1, duration: 0.9, ease: C.loop.ease });
      onceST(lr, tl, 'top 85%');
    });
  });

  /* =============== Websites: kendini kuran tarayıcı (mini W1) =============== */
  VT.scene('bw', function (mm) {
    var root = $('[data-scene="bw"]'); if (!root) return;
    mm.add('(min-width:0px)', function () {
      var T = C.hero.t, sks = $$('.sk', root), outline = $('.vs__outline rect', root), paper = $('.vs__paper', root), live = $('.bw__live', root), tiles = $$('.ms-tiles i', root), btn = $('.ms-btn', root);
      gsap.set(outline, { opacity: 0, strokeDashoffset: 1 }); gsap.set(paper, { opacity: 0 }); gsap.set(sks, { clipPath: 'inset(0 100% 0 0)', opacity: 1 }); gsap.set(live, { opacity: 0, y: 8 }); gsap.set(tiles, { scale: 0.9 });
      var k = 0.4;
      var tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      tl.to(outline, { opacity: 1, duration: 0.15 }).to(outline, { strokeDashoffset: 0, duration: 0.9, ease: C.ease.draw }, 0)
        .to(paper, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.7)
        .to(sks, { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power2.out', stagger: 0.06 }, 0.9)
        .to(sks, { clipPath: 'inset(0 0% 0 100%)', duration: 0.7, ease: C.hero.ease.fill, stagger: 0.11 }, 1.9)
        .to(tiles, { scale: 1, duration: 0.7, ease: C.hero.ease.fill, stagger: 0.11 }, 2.0)
        .fromTo(btn, { scale: 0.88 }, { scale: 1, duration: 0.5, ease: C.hero.ease.sign, transformOrigin: '0 50%' }, 2.6)
        .to(outline, { opacity: 0, duration: 0.5 }, 3.0)
        .to(live, { opacity: 1, y: 0, duration: 0.5, ease: C.ease.out }, 3.2);
      var st = onceST(root, tl, 'top 80%');
      return function () { st.kill(); tl.kill(); };
    });
  });

  /* =============== QR sahnesi (W3) =============== */
  VT.scene('qrscene', function (mm) {
    var root = $('[data-scene="qrscene"]'); if (!root) return;
    mm.add('(min-width:0px)', function () {
      var Q = C.qr, ph = $('.qs-phin', root), view = $('.qs-view', root), scan = $('.qs-scan', root), menu = $('.qs-menu', root), items = $$('.qs-i', root), roll = $('.qs-roll', root), upd = $('.qs-upd', root);
      gsap.set(ph, { y: 300, rotation: Q.tilt, svgOrigin: '385 205', opacity: 0 }); gsap.set(view, { scale: 1.5, opacity: 0, svgOrigin: '154 222' });
      gsap.set(menu, { y: 330 }); gsap.set(items, { opacity: 0, y: 10 }); gsap.set(roll, { y: 0 }); gsap.set(upd, { opacity: 0, x: -10 }); gsap.set(scan, { opacity: 0, y: 0 });
      var tl = gsap.timeline({ paused: true });
      tl.to(ph, { y: 0, opacity: 1, duration: Q.rise * 0.5, ease: 'power2.out' }, 0)
        .to(ph, { rotation: 0, duration: Q.rise, ease: 'back.out(1.3)' }, 0.1)
        .to(view, { scale: 1, opacity: 1, duration: Q.lock, ease: 'back.out(1.8)' }, Q.rise * 0.6)
        .set(scan, { opacity: 1 }).to(scan, { y: 104, duration: Q.scan, ease: 'power1.inOut' }).to(scan, { opacity: 0, duration: 0.15 })
        .to(menu, { y: 0, duration: Q.menu, ease: Q.ease }, '-=0.1')
        .to(items, { opacity: 1, y: 0, duration: 0.4, ease: Q.ease, stagger: Q.item }, '-=0.25')
        .to(roll, { y: -16, duration: Q.roll, ease: 'power3.inOut' }, '+=0.35')
        .to(upd, { opacity: 1, x: 0, duration: 0.5, ease: Q.ease }, '-=0.2');
      var st = onceST(root, tl, 'top 75%');
      return function () { st.kill(); tl.kill(); };
    });
  });

  /* =============== Harita sahnesi (W4) =============== */
  VT.scene('mapscene', function (mm) {
    var root = $('[data-scene="mapscene"]'); if (!root) return;
    mm.add('(min-width:0px)', function () {
      var M = C.map, FULL = 'car detailing near me', q = $('.mp-q', root), caret = $('.mp-caret', root), map = $('.mp-map', root), pin = $('.mp-pin', root), waves = $$('.mp-wave ellipse', root), card = $('.mp-cardin', root);
      q.textContent = ''; gsap.set(caret, { opacity: 1 }); gsap.set(pin, { y: -150, opacity: 0, svgOrigin: '285 330' }); gsap.set(card, { scaleY: 0, opacity: 0, svgOrigin: '285 264' });
      var o = { n: 0 };
      var tl = gsap.timeline({ paused: true });
      tl.to(o, { n: FULL.length, duration: FULL.length * M.type, ease: 'none', onUpdate: function () { q.textContent = FULL.slice(0, Math.round(o.n)); caret.setAttribute('x', 90 + (q.getComputedTextLength ? q.getComputedTextLength() : 0) + 2); } })
        .to(caret, { opacity: 0, duration: 0.2 })
        .to(map, { scale: M.zoom, duration: M.zoomDur, ease: 'power2.inOut', svgOrigin: '280 250' }, '-=0.1')
        .to(pin, { y: 0, opacity: 1, duration: M.drop, ease: 'power2.in' }, '-=' + (M.zoomDur * 0.6))
        .to(pin, { scaleY: 0.7, scaleX: 1.22, duration: M.squash * 0.5, ease: 'power2.out' })
        .to(pin, { scaleY: 1, scaleX: 1, duration: M.squash * 2.4, ease: 'elastic.out(1,.4)' })
        .fromTo(waves, { opacity: 0.8, scale: 0.4 }, { opacity: 0, scale: 3, duration: M.wave, ease: 'power2.out', stagger: 0.25 }, '<')
        .to(card, { scaleY: 1, opacity: 1, duration: M.card, ease: 'back.out(1.4)' }, '-=0.9');
      var st = onceST(root, tl, 'top 75%');
      return function () { st.kill(); tl.kill(); q.textContent = FULL; };
    });
  });

  /* =============== Logo sahnesi =============== */
  VT.scene('logoscene', function (mm) {
    var root = $('[data-scene="logoscene"]'); if (!root) return;
    mm.add('(min-width:0px)', function () {
      var L = C.logoscene, frames = [$('.ls-sign', root), $('.ls-prof', root), $('.ls-cover', root)];
      var tl = gsap.timeline({ paused: true });
      frames.forEach(function (f, i) {
        var arcs = $$('.lg', f);
        gsap.set(arcs, { strokeDasharray: 1, strokeDashoffset: 1 }); gsap.set(f, { opacity: 0, y: 24 });
        tl.to(f, { opacity: 1, y: 0, duration: 0.6, ease: C.ease.out }, i * L.stagger * 3)
          .to(arcs, { strokeDashoffset: 0, duration: L.draw, ease: L.ease, stagger: L.stagger * 0.5 }, i * L.stagger * 3 + 0.2);
      });
      var st = onceST(root, tl, 'top 78%');
      return function () { st.kill(); tl.kill(); };
    });
  });

  /* =============== Hakkımızda: isim sahnesi =============== */
  VT.scene('aboutname', function (mm) {
    var root = $('[data-scene="aboutname"]'); if (!root) return;
    mm.add('(min-width:0px)', function () {
      var ring = $('.ar', root), arcs = $$('.ar-p', root), orbit = $('.ar-orbit', root);
      gsap.set(arcs, { strokeDasharray: 1, strokeDashoffset: 1 }); gsap.set(orbit, { opacity: 0 });
      var tl = gsap.timeline({ paused: true });
      tl.to(arcs.slice(0, 3), { strokeDashoffset: 0, duration: C.about.draw, ease: C.about.ease, stagger: 0.25 })
        .to(arcs[3], { strokeDashoffset: 0, duration: C.about.draw * 0.6, ease: C.about.ease }, '-=0.3')
        .to(orbit, { opacity: 1, duration: 0.4 }).add(function () { ring.classList.add('in'); });
      var st = onceST(ring, tl, 'top 78%');
      return function () { st.kill(); tl.kill(); ring.classList.remove('in'); };
    });
  });

  /* =============== Work: hareket demoları =============== */
  VT.scene('demos', function (mm) {
    mm.add('(min-width:0px)', function () {
      var kills = [];
      $$('[data-scene="demo-sweep"]').forEach(function (d) {
        var light = $('.sw-light', d), spans = $$('.sw-steps span', d);
        var tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8 });
        tl.fromTo(light, { xPercent: 0, opacity: 0 }, { xPercent: 330, duration: 2.8, ease: 'power1.inOut' }, 0)
          .to(light, { opacity: 1, duration: 0.5 }, 0).to(light, { opacity: 0, duration: 0.6 }, 2.2);
        spans.forEach(function (s, i) { tl.to(s, { color: '#fff', borderTopColor: '#6B93FF', duration: 0.2 }, 0.3 + i * 0.65).to(s, { color: '#B9C4E8', borderTopColor: 'rgba(255,255,255,.22)', duration: 0.5 }, 1.1 + i * 0.65); });
        kills.push(ST({ trigger: d, start: 'top 90%', end: 'bottom 10%', onToggle: function (s) { s.isActive ? tl.play() : tl.pause(); } }), { kill: function () { tl.kill(); } });
      });
      $$('[data-scene="demo-stack"]').forEach(function (d) {
        var cards = $$('.st-card', d);
        gsap.set(cards, { y: 160, opacity: 0 });
        var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        cards.forEach(function (c, i) { tl.to(c, { y: 0, opacity: 1, duration: 1 }, i * 0.6); });
        kills.push(ST({ trigger: d, start: 'top 88%', end: 'top 35%', scrub: 0.5, animation: tl }));
      });
      $$('[data-scene="demo-ba"]').forEach(function (d) {
        var ba = $('.ba', d), o = { p: 50 };
        var tl = gsap.timeline({ paused: true });
        tl.to(o, { p: 66, duration: 0.5, ease: 'power2.out', onUpdate: function () { ba.style.setProperty('--p', o.p + '%'); } }).to(o, { p: 50, duration: 0.8, ease: 'elastic.out(1,.5)', onUpdate: function () { ba.style.setProperty('--p', o.p + '%'); } });
        kills.push(onceST(d, tl, 'top 70%'));
      });
      return function () { kills.forEach(function (k) { k.kill(); }); };
    });
  });

  /* =============== How it works: zaman çizgisi (W5b) =============== */
  VT.scene('timeline', function (mm) {
    var root = $('[data-scene="timeline"]'); if (!root) return;
    document.documentElement.style.setProperty('--tl-vh', C.timeline.scrollVh);
    var steps = $$('.tl__s', root), n = steps.length, arc = $('.dial__arc', root), hrs = $('[data-hours]', root), dot = $('.dial__dot', root);
    mm.add('(min-width:1024px)', function () {
      var st = ST({
        trigger: root, start: 'top top', end: 'bottom bottom', scrub: C.timeline.scrub,
        onUpdate: function (s) {
          var p = s.progress, a = Math.min(n - 1, Math.floor(p * n));
          steps.forEach(function (e, i) { e.classList.toggle('on', i === a); e.classList.toggle('lit', i <= a); });
          var h = a < n - 1 ? 0 : Math.min(1, (p - (n - 1) / n) / (1 / n * 0.85)); // son adımda 0 -> 24
          arc.style.strokeDashoffset = (1 - h).toFixed(3); gsap.set(dot, { rotation: -90 + h * 360, svgOrigin: '100 100' }); hrs.textContent = Math.round(h * 24);
        }
      });
      arc.style.strokeDashoffset = 1; hrs.textContent = '0'; st.vars.onUpdate(st);
      return function () { st.kill(); arc.style.strokeDashoffset = 0; hrs.textContent = '24'; steps.forEach(function (e) { e.classList.remove('on'); e.classList.add('lit'); }); gsap.set(dot, { clearProps: 'all' }); };
    });
    mm.add('(max-width:1023px)', function () {
      var list = $('.tl__steps', root);
      var st = ST({ trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: true, onUpdate: function (s) { steps.forEach(function (e, i) { e.classList.toggle('lit', s.progress >= i / n - 0.02); }); } });
      return function () { st.kill(); steps.forEach(function (e) { e.classList.add('lit'); }); };
    });
  });
})();
