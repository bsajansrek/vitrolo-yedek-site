/* Vitrolo — scenes-common.js · Home sakin sahneleri + tüm sayfalarda ortak bileşenler (cihaz vitrini, sektör değiştirici, paketler, kapanış tabelası, adım çizgisi). */
(function () {
  var VT = window.VT, C = VT.C, $ = VT.$, $$ = VT.$$;
  var ST = function (o) { return ScrollTrigger.create(o); };

  /* ================= SEKTÖR DEĞİŞTİRİCİ (W6) — her modda çalışır ================= */
  VT.init('sector', function () {
    $$('.stool').forEach(function (tool) {
      var tabs = $$('.stab', tool), panels = $$('.sinfo', tool), mock = $('[data-mock]', tool);
      var tpl = {}; $$('template[data-ic]', tool).forEach(function (t) { tpl[t.getAttribute('data-ic')] = t.innerHTML; });
      function apply(i, focus) {
        var t = tabs[i], d = t.dataset;
        tabs.forEach(function (b, k) { b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
        panels.forEach(function (p, k) { p.hidden = k !== i; });
        if (focus) t.focus();
        var dur = (VT.desk.matches ? C.sector.dur : C.sector.mobileDur);
        var texts = $$('[data-m-name],[data-m-title],[data-m-btn]', mock), tiles = $$('[data-m-tile]', mock);
        function swap() {
          mock.style.setProperty('--m-bg', d.bg); mock.style.setProperty('--m-ink', d.ink); mock.style.setProperty('--m-acc', d.acc);
          mock.setAttribute('data-call', d.call);
          $$('[data-m-name]', mock).forEach(function (e) { e.innerHTML = d.name; });
          $$('[data-m-title]', mock).forEach(function (e) { e.innerHTML = d.title; });
          $$('[data-m-btn]', mock).forEach(function (e) { e.innerHTML = d.btn; });
          tiles.forEach(function (e) { e.innerHTML = tpl[d.icon]; });
        }
        if (VT.MO && window.gsap) {
          mock.style.transition = ''; // @property geçişi CSS'te
          gsap.to(texts, { opacity: 0, y: -6, duration: dur * 0.35, ease: 'power2.in', onComplete: function () { swap(); gsap.fromTo(texts, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: dur, ease: C.sector.ease, stagger: 0.04, clearProps: 'transform,opacity' }); } });
          gsap.fromTo(tiles, { scale: 0.7, opacity: 0.2 }, { scale: 1, opacity: 1, duration: dur * 1.2, ease: 'back.out(1.8)', stagger: 0.07, delay: dur * 0.3, clearProps: 'transform,opacity' });
          // renk geçişini hemen başlat
          mock.style.setProperty('--m-bg', d.bg); mock.style.setProperty('--m-ink', d.ink); mock.style.setProperty('--m-acc', d.acc);
        } else swap();
      }
      tabs.forEach(function (b, i) {
        b.addEventListener('click', function () { apply(i); });
        b.addEventListener('keydown', function (e) {
          var k = e.key, n = tabs.length, j = i;
          if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % n; else if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + n) % n; else if (k === 'Home') j = 0; else if (k === 'End') j = n - 1; else return;
          e.preventDefault(); apply(j, true);
        });
      });
    });
  });

  /* ================= CİHAZ VİTRİNİ (W8) — statik modda "sonraki ekran" düğmesi ================= */
  VT.init('device', function () {
    $$('.dev').forEach(function (dev) {
      var btn = $('[data-dev-next]', dev); if (!btn) return;
      if (!VT.MO) {
        btn.hidden = false;
        var strip = $('[data-strip]', dev), sp = $('[data-strip-ph]', dev), k = 0;
        btn.addEventListener('click', function () { k = (k + 1) % 4; strip.style.transform = 'translateY(' + (-25 * k) + '%)'; if (sp) sp.style.transform = 'translateY(' + (-33.333 * (k % 3)) + '%)'; });
      }
    });
  });

  /* ================= KAPANIŞ FORMU (ad + e-posta -> /free-draft, ağ isteği yok) ================= */
  VT.init('final-form', function () {
    var f = $('[data-final-form]'); if (!f) return;
    var biz = $('#f-biz', f);
    try { var s = sessionStorage.getItem('vt-name'); if (s && biz) biz.value = s; } catch (e) { }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      try { sessionStorage.setItem('vt-name', biz.value.trim()); sessionStorage.setItem('vt-email', $('#f-mail', f).value.trim()); } catch (x) { }
      location.href = '/vitrolo-yedek-site/free-draft';
    });
  });

  /* ================= HAREKET SAHNELERİ ================= */
  VT.scene('minis', function (mm) {
    mm.add('(min-width:0px)', function () {
      var M = C.mini;
      // --- harita: iğne düşer, dalga, kart ---
      var map = $('[data-scene="map-mini"]');
      if (map) {
        var pin = $('.mm-pin', map), card = $('.mm-card', map), waves = $$('.mm-wave ellipse', map);
        gsap.set(pin, { y: -90, opacity: 0, svgOrigin: '248 150' }); gsap.set(card, { scale: 0, svgOrigin: '248 92', opacity: 0 }); gsap.set(waves, { opacity: 0 });
        var tl = gsap.timeline({ paused: true });
        tl.to(pin, { y: 0, opacity: 1, duration: M.pinDrop, ease: 'power2.in' })
          .to(pin, { scaleY: 0.72, scaleX: 1.2, duration: M.squash * 0.5, ease: 'power2.out' })
          .to(pin, { scaleY: 1, scaleX: 1, duration: M.squash * 2.2, ease: 'elastic.out(1,.45)' })
          .fromTo(waves, { opacity: 0.8, scale: 0.4 }, { opacity: 0, scale: 2.6, duration: M.wave, ease: 'power2.out', stagger: 0.25 }, '<')
          .to(card, { scale: 1, opacity: 1, duration: M.dur * 0.7, ease: 'back.out(1.5)' }, '-=0.9');
        ST({ trigger: map, start: 'top 78%', once: true, onEnter: function () { tl.play(); } });
      }
      // --- menü: vizör kilitlenir, tarama, telefon + menü ---
      var menu = $('[data-scene="menu-mini"]');
      if (menu) {
        var view = $('.mn-view', menu), scan = $('.mn-scan', menu), ph = $('.mn-phone', menu), items = $$('.mn-menu > *', menu);
        gsap.set(view, { scale: 1.45, opacity: 0, svgOrigin: '122 220' }); gsap.set(scan, { opacity: 0 }); gsap.set(ph, { y: 50, opacity: 0 }); gsap.set(items, { opacity: 0, y: 10 });
        var t2 = gsap.timeline({ paused: true });
        t2.to(ph, { y: 0, opacity: 1, duration: M.dur, ease: M.ease })
          .to(view, { scale: 1, opacity: 1, duration: M.lock, ease: 'back.out(1.6)' }, 0.25)
          .set(scan, { opacity: 1, y: 0 }).to(scan, { y: 102, duration: M.scan, ease: 'power1.inOut' }).to(scan, { opacity: 0, duration: 0.15 })
          .to(items, { opacity: 1, y: 0, duration: 0.5, ease: M.ease, stagger: 0.08 }, '-=0.2');
        ST({ trigger: menu, start: 'top 78%', once: true, onEnter: function () { t2.play(); } });
      }
      // --- bakım: halka çizilir, nokta yörüngeye çıkar ---
      var care = $('[data-scene="care-mini"]');
      if (care) {
        var arcs = $$('.ring path', care), orbit = $('.orbit', care);
        gsap.set(arcs, { strokeDasharray: 1, strokeDashoffset: 1 }); gsap.set(orbit, { opacity: 0 });
        var t3 = gsap.timeline({ paused: true });
        t3.to(arcs, { strokeDashoffset: 0, duration: M.dur * 1.2, ease: 'power2.inOut', stagger: M.stagger }).to(orbit, { opacity: 1, duration: 0.5 }, '-=0.3').add(function () { care.classList.add('in'); });
        ST({ trigger: care, start: 'top 80%', once: true, onEnter: function () { t3.play(); } });
        return function () { care.classList.remove('in'); gsap.set(arcs, { clearProps: 'all' }); };
      }
    });
  });

  VT.scene('device', function (mm) {
    $$('.dev').forEach(function (dev) {
      var D = C.device, lap = $('.dev__lap', dev), strip = $('[data-strip]', dev), ph = $('.dev__ph', dev), sp = $('[data-strip-ph]', dev), stage = $('.dev__stage', dev);
      mm.add({ desk: '(min-width:1024px)', phone: '(max-width:1023px)' }, function (ctx) {
        var hold = D.holdFrac * 2;
        if (ctx.conditions.desk) {
          gsap.set(lap, { rotateX: D.tilt, transformPerspective: 1800, transformOrigin: '50% 100%' });
          gsap.set(ph, { opacity: 0, x: 70, y: 24 });
          var tl = gsap.timeline({ defaults: { ease: D.ease } });
          tl.to(lap, { rotateX: 0, duration: D.tiltDur, ease: 'power2.out' }, 0)
            .to(ph, { opacity: 1, x: 0, y: 0, duration: D.tiltDur, ease: 'power3.out' }, D.phoneDelay + D.tiltDur * 0.5);
          var t0 = D.tiltDur + 0.2, step = 1 + hold;
          for (var i = 1; i < 4; i++) tl.to(strip, { yPercent: -25 * i, duration: 1, ease: D.ease }, t0 + (i - 1) * step);
          for (var j = 1; j < 3; j++) tl.to(sp, { yPercent: -33.333 * j, duration: 1, ease: D.ease }, t0 + 0.3 + (j - 1) * step * 1.5);
          tl.set({}, {}, t0 + 3 * step);
          ST({ trigger: stage, start: 'top 88%', end: 'bottom 30%', scrub: D.scrub, animation: tl });
        } else {
          // telefon: görünürken otomatik ilerler
          var k = 0, timer = null;
          function next() { k = (k + 1) % 4; gsap.to(strip, { yPercent: -25 * k, duration: 0.8, ease: D.ease }); gsap.to(sp, { yPercent: -33.333 * (k % 3), duration: 0.8, ease: D.ease }); }
          var st = ST({ trigger: stage, start: 'top 85%', end: 'bottom 15%', onToggle: function (s) { if (s.isActive) { if (!timer) timer = setInterval(next, D.phoneAuto * 1000); } else { clearInterval(timer); timer = null; } } });
          return function () { clearInterval(timer); st.kill(); };
        }
      });
    });
  });

  VT.scene('steps', function (mm) {
    var steps = $('[data-scene="steps"]'); if (!steps) return;
    mm.add('(min-width:0px)', function () {
      var items = $$('.steps__i', steps), n = items.length;
      steps.style.setProperty('--fill', 0);
      var st = ST({
        trigger: steps, start: 'top 72%', end: 'bottom 62%', scrub: C.steps.scrub,
        onUpdate: function (s) { var p = s.progress; steps.style.setProperty('--fill', p.toFixed(3)); items.forEach(function (it, i) { it.classList.toggle('lit', p >= i / (n - 1) - 0.01); }); }
      });
      return function () { st.kill(); steps.style.removeProperty('--fill'); items.forEach(function (it) { it.classList.add('lit'); }); };
    });
  });

  VT.scene('packs', function (mm) {
    $$('[data-scene="packs"]').forEach(function (wrap) {
      mm.add('(min-width:0px)', function () {
        var P = C.price, packs = $$('[data-pack]', wrap), made = [];
        packs.forEach(function (p, i) {
          var path = $('.strike__p', p), b = $('[data-roll]', p), reg = $('.strike s', p);
          var from = +p.dataset.from, to = +p.dataset.to, fmt = function (v) { return '$' + Math.round(v).toLocaleString('en-US'); }, o = { v: from };
          gsap.set(path, { strokeDashoffset: 1 }); gsap.set(reg, { opacity: 1 }); b.textContent = fmt(from);
          var tl = gsap.timeline({ paused: true, delay: i * P.stagger });
          tl.to(path, { strokeDashoffset: 0, duration: P.strikeDur, ease: P.strikeEase })
            .to(reg, { opacity: 0.55, duration: 0.3 }, '<0.2')
            .to(o, { v: to, duration: P.rollDur, ease: P.rollEase, onUpdate: function () { b.textContent = fmt(o.v); } }, '<0.15');
          made.push(ST({ trigger: p, start: 'top 82%', once: true, onEnter: function () { tl.play(); } }));
          made.push({ kill: function () { b.textContent = fmt(to); } });
        });
        return function () { made.forEach(function (m) { m.kill(); }); };
      });
    });
  });

  VT.scene('final', function (mm) {
    var sec = $('[data-scene="final"]'); if (!sec) return;
    mm.add('(min-width:0px)', function () {
      var F = C.final, c = $('.osign__c', sec), o = $('.osign__o', sec), box = $('.osign', sec);
      gsap.set(c, { scaleX: 1 }); gsap.set(o, { scaleX: 0 });
      var tl = gsap.timeline({ paused: true });
      tl.fromTo(box, { rotation: -F.swing }, { rotation: 0, duration: 1.4, ease: 'elastic.out(1,.35)' }, 0)
        .to(c, { scaleX: 0, duration: F.flipDur * 0.4, ease: 'power2.in' }, 0.25)
        .to(o, { scaleX: 1, duration: F.flipDur * 0.6, ease: F.ease }, 0.25 + F.flipDur * 0.4);
      ST({ trigger: sec, start: 'top 65%', once: true, onEnter: function () { tl.play(); } });
    });
  });
})();
