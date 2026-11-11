/* Vitrolo — core.js · üst çubuk, menü, reveal, Lenis, sayfa geçişi, sahne kayıt sistemi. Bağımlılık: config.js (+ gsap/ScrollTrigger varsa). */
(function () {
  var VT = window.VT, C = VT.C, html = document.documentElement;
  var MO = html.classList.contains('mo');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  VT.$ = $; VT.$$ = $$; VT.MO = MO;
  VT.desk = window.matchMedia('(min-width:1024px)');
  VT.fine = window.matchMedia('(hover:hover) and (pointer:fine)');
  var hasGsap = !!window.gsap;
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ----- sahne kayıt sistemi ----- */
  var inits = [], scenes = [];
  VT.init = function (name, fn) { inits.push({ name: name, fn: fn }); };            // her modda çalışır (etkileşim)
  VT.scene = function (name, setup) { scenes.push({ name: name, setup: setup, mm: null }); }; // yalnız hareket modunda (GSAP)
  function buildScene(s) {
    if (s.mm) s.mm.revert();
    s.mm = gsap.matchMedia();
    try { s.setup(s.mm, s); } catch (e) { console.error('[VT scene ' + s.name + ']', e); html.classList.add('mo-fail'); }
  }
  VT.rebuild = function () { if (!hasGsap || !MO) return; scenes.forEach(buildScene); ScrollTrigger.refresh(); };

  /* ----- üst çubuk ----- */
  var hdr = $('#hdr'), prog = hdr && $('.progress i', hdr);
  function onScroll() {
    var y = window.scrollY || html.scrollTop;
    if (hdr) hdr.classList.toggle('solid', y > C.header.solidAt);
    if (prog) { var h = html.scrollHeight - window.innerHeight; prog.style.setProperty('--p', h > 0 ? Math.min(1, y / h).toFixed(4) : 0); }
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ----- hizmetler açılır menüsü ----- */
  var subLi = $('.nav li.has-sub');
  if (subLi) {
    var sb = $('button', subLi);
    sb.addEventListener('click', function () { var o = subLi.classList.toggle('open'); sb.setAttribute('aria-expanded', o); });
    document.addEventListener('click', function (e) { if (!subLi.contains(e.target)) { subLi.classList.remove('open'); sb.setAttribute('aria-expanded', 'false'); } });
    subLi.addEventListener('keydown', function (e) { if (e.key === 'Escape') { subLi.classList.remove('open'); sb.setAttribute('aria-expanded', 'false'); sb.focus(); } });
    subLi.addEventListener('mouseenter', function () { sb.setAttribute('aria-expanded', 'true'); });
    subLi.addEventListener('mouseleave', function () { sb.setAttribute('aria-expanded', 'false'); });
  }

  /* ----- mobil menü ----- */
  var burger = $('.hdr__burger'), menu = $('#menu');
  function setMenu(open) {
    if (!burger || !menu) return;
    menu.classList.toggle('open', open); html.classList.toggle('menu-open', open); document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open); $('[data-t]', burger).textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
    if (window.lenis) open ? window.lenis.stop() : window.lenis.start();
    if (open && hasGsap && MO) gsap.fromTo($$('#menu li, #menu .btn'), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: C.menu.dur, stagger: C.menu.stagger, ease: C.menu.ease, clearProps: 'transform,opacity' });
  }
  if (burger) {
    burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); } });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    window.matchMedia('(min-width:1181px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ----- reveal (IntersectionObserver; CSS geçişleri) ----- */
  VT.revealInit = function () {
    var els = $$('[data-r]:not([data-r-hero])');
    if (!MO || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    /* clip-path ile tamamen kırpılmış öğeler (rule, wipe) Chrome'da IntersectionObserver'a hiç "kesişiyor" demez
       (IO hedefin kendi clip-path'ini hesaba katar). Bunları kutu konumuna bakan ScrollTrigger ile aç. */
    var CLIP = { rule: 1, wipe: 1 };
    els.forEach(function (e) {
      if (CLIP[e.getAttribute('data-r')]) {
        if (hasGsap && window.ScrollTrigger) ScrollTrigger.create({ trigger: e, start: 'top 88%', once: true, onEnter: function () { e.classList.add('in'); } });
        else e.classList.add('in');
      } else io.observe(e);
    });
  };
  /* genel "görününce bir kez" yardımcısı (sahneler için) */
  VT.once = function (el, fn, margin) {
    if (!el) return; if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { io.disconnect(); fn(); } }); }, { rootMargin: margin || '0px 0px -18% 0px', threshold: 0.01 });
    io.observe(el);
  };

  /* ----- Lenis ----- */
  function lenisInit() {
    if (!MO || !window.Lenis || !C.global.lenis || !VT.fine.matches || !hasGsap) return;
    var l = window.lenis = new Lenis({ lerp: C.global.lenisLerp, smoothWheel: true, syncTouch: false, anchors: { offset: -((parseInt(getComputedStyle(html).getPropertyValue('--hdr')) || 72) + 16) } });
    l.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { l.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ----- sayfa geçişi (nokta büyür / küçülür) ----- */
  var pt = $('.pt');
  function ptPos() { var d = $('.hdr__logo .dot'); var r = d ? d.getBoundingClientRect() : { left: 40, top: 30, width: 0, height: 0 }; return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
  function ptInit() {
    if (!MO || !pt || !hasGsap || !C.global.pageTransition) return;
    if (html.classList.contains('pt-enter')) {
      var p = ptPos(); pt.style.left = p.x + 'px'; pt.style.top = p.y + 'px';
      gsap.set(pt, { scale: 1 }); html.classList.remove('pt-enter');
      gsap.to(pt, { scale: 0, duration: C.page.inDur + 0.1, ease: C.page.ease, delay: 0.05 });
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return; if (a.hasAttribute('download')) return;
      var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search) || u.pathname.indexOf('/vitrolo-yedek-site/samples/') === 0) return;
      e.preventDefault();
      var r = a.getBoundingClientRect(), x = e.clientX || (r.left + r.width / 2), y = e.clientY || (r.top + r.height / 2);
      pt.style.left = x + 'px'; pt.style.top = y + 'px';
      try { sessionStorage.setItem('vt-pt', '1'); } catch (x2) { }
      setMenuClose();
      gsap.fromTo(pt, { scale: 0 }, { scale: 1, duration: C.page.outDur, ease: C.page.ease, onComplete: function () { location.href = a.href; } });
      setTimeout(function () { location.href = a.href; }, 1400);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) { gsap.set(pt, { scale: 0 }); } });
  }
  function setMenuClose() { if (menu && menu.classList.contains('open')) { menu.classList.remove('open'); document.body.style.overflow = ''; } }

  /* ----- açılır soru: ok dönüşü CSS; ?q= arama yok ----- */

  /* ----- başlat ----- */
  VT.start = function () {
    VT.apply();
    if (!MO) $$('img[loading=lazy]').forEach(function (i) { i.loading = 'eager'; });
    VT.revealInit();
    inits.forEach(function (i) { try { i.fn(); } catch (e) { console.error('[VT init ' + i.name + ']', e); } });
    if (hasGsap && MO) { lenisInit(); scenes.forEach(buildScene); ptInit(); }
    html.classList.add('mo-ready');
    window.addEventListener('load', function () { if (hasGsap && MO) ScrollTrigger.refresh(); });
    if (VT.tune) { var s = document.createElement('script'); s.src = '/vitrolo-yedek-site/js/tune.js'; document.body.appendChild(s); }
  };
  var started = false;
  function go() { if (started) return; started = true; VT.start(); }
  if (document.readyState === 'complete') go();
  else document.addEventListener('DOMContentLoaded', function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go); setTimeout(go, 1500); });

  /* sample linkleri tek yerden (yayında alt alan adına çevrilebilir) */
  VT.SAMPLE = '/vitrolo-yedek-site/samples/tidemark/';
})();
