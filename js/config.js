/* Vitrolo — config.js · TÜM hareket değerleri burada (süre sn, mesafe px/yüzde, easing GSAP adı). ?tune=1 paneli bunları canlı değiştirir. */
(function () {
  var C = {
    ease: { out: 'power3.out', soft: 'power2.out', inOut: 'power2.inOut', pop: 'back.out(1.7)', draw: 'power1.inOut', expo: 'expo.out', bounce: 'bounce.out' },
    global: { lenis: 1, lenisLerp: 0.1, pageTransition: 1 },
    header: { solidAt: 24, dur: 0.35 },
    logo: { dur: 0.8, stagger: 0.14 },
    button: { dotDur: 0.7 },
    page: { inDur: 0.32, outDur: 0.42, ease: 'power2.inOut' },
    menu: { dur: 0.7, stagger: 0.06, ease: 'power4.out' },
    reveal: { wordsDur: 0.95, wordsStagger: 0.045, wordsEase: 'power4.out', ruleDur: 1.1, ruleEase: 'power3.inOut', wipeDur: 1.15, wipeEase: 'expo.out', riseDur: 0.8, riseY: 22, riseEase: 'power3.out' },
    hero2: { start: 0.25, introStart: 0.78, show: 3.8, wipe: 0.7, pan: 0.6 }, // giriş v2 (2026-11-06): gecikme sn, camda her örnek sn, perde sn, kaydırma oranı
    hero: {
      scrollVh: 420, scrub: 0.6, introDur: 1.3, swayDeg: 3, swayDur: 4.4, mobileDur: 4.6, phoneMobile: 0,
      t: { copyOut: 0, copyOutDur: 0.9, cap1In: 0.7, cap1Dur: 0.8, chrome: 2.0, chromeDur: 1.4, cap2At: 2.5, cap2Dur: 0.8, skeleton: 3.0, skeletonDur: 0.7, skeletonStagger: 0.08, fill: 4.4, fillDur: 1.2, fillStagger: 0.2, light: 6.6, lightDur: 1.4, sign: 7.7, signDur: 1.1, endIn: 8.8, endDur: 0.8, total: 10 },
      ease: { chrome: 'power1.inOut', fill: 'power3.out', light: 'power2.inOut', sign: 'back.out(1.7)', caps: 'power3.out' }
    },
    name: { typeSpeed: 0.06, hold: 1.8, eraseSpeed: 0.03, startDelay: 1.2, samples: ["Rosa's Kitchen", 'Bayline Auto Spa', 'Oak & Comb Barbers', 'Fresh Start Cleaning'] },
    mini: { dur: 0.9, stagger: 0.12, pinDrop: 0.55, squash: 0.2, wave: 1.2, lock: 0.8, scan: 0.7, ease: 'power3.out' },
    device: { tilt: 14, tiltDur: 1, scrub: 0.5, holdFrac: 0.3, phoneDelay: 0.15, phoneAuto: 2.6, ease: 'power2.inOut' },
    sector: { dur: 0.45, mobileDur: 0.3, ease: 'power3.out' },
    steps: { scrub: 0.4 },
    price: { strikeDur: 0.5, rollDur: 0.8, stagger: 0.18, strikeEase: 'power2.out', rollEase: 'power3.out' },
    final: { flipDur: 0.7, swing: 12, ease: 'back.out(1.7)' },
    loop: { rotStep: 120, stepDur: 1, scrub: 0.6, dotDur: 7, ease: 'power2.inOut' },
    qr: { rise: 0.9, tilt: -8, lock: 0.7, scan: 0.8, menu: 0.7, item: 0.1, roll: 0.7, ease: 'power3.out' },
    map: { type: 0.06, zoom: 1.06, zoomDur: 1.4, drop: 0.55, squash: 0.2, wave: 1.1, card: 0.6, ease: 'power3.out' },
    logoscene: { draw: 1.1, stagger: 0.18, ease: 'power2.inOut' },
    timeline: { scrollVh: 260, scrub: 0.5 },
    about: { draw: 1.2, ease: 'power2.inOut' },
    form: { slide: 0.4, ease: 'power2.inOut' }
  };
  var CSSEASE = {
    'power1.out': '.5,1,.89,1', 'power2.out': '.33,1,.68,1', 'power3.out': '.22,1,.36,1', 'power4.out': '.16,1,.3,1', 'expo.out': '.16,1,.3,1',
    'power1.inOut': '.45,0,.55,1', 'power2.inOut': '.65,0,.35,1', 'power3.inOut': '.76,0,.24,1', 'power4.inOut': '.83,0,.17,1', 'expo.inOut': '.87,0,.13,1',
    'back.out(1.7)': '.34,1.56,.64,1', 'back.out(1.4)': '.34,1.4,.64,1', 'sine.out': '.39,.58,.57,1', 'sine.inOut': '.37,0,.63,1', 'none': '0,0,1,1', 'linear': '0,0,1,1'
  };
  var EASES = ['power1.out', 'power2.out', 'power3.out', 'power4.out', 'expo.out', 'power1.inOut', 'power2.inOut', 'power3.inOut', 'power4.inOut', 'expo.inOut', 'back.out(1.7)', 'back.out(1.4)', 'bounce.out', 'sine.out', 'sine.inOut', 'none'];
  var VT = window.VT = { C: C, DEFAULT: JSON.parse(JSON.stringify(C)), EASES: EASES, scenes: [], bez: function (n) { return 'cubic-bezier(' + (CSSEASE[n] || CSSEASE['power3.out']) + ')'; } };

  function merge(t, s) { for (var k in s) { if (!Object.prototype.hasOwnProperty.call(s, k)) continue; if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && t[k] && typeof t[k] === 'object') merge(t[k], s[k]); else if (typeof t[k] === typeof s[k] || t[k] === undefined) t[k] = s[k]; } }
  VT.merge = merge;
  VT.tune = false;
  try {
    var q = /[?&]tune=(\d)/.exec(location.search);
    if (q) { if (q[1] === '1') sessionStorage.setItem('vt-tune', '1'); else { sessionStorage.removeItem('vt-tune'); localStorage.removeItem('vt-config'); } }
    VT.tune = sessionStorage.getItem('vt-tune') === '1';
    if (VT.tune) { var saved = localStorage.getItem('vt-config'); if (saved) merge(C, JSON.parse(saved)); }
  } catch (e) { }

  VT.apply = function () {
    var r = document.documentElement.style, b = VT.bez;
    r.setProperty('--words-dur', C.reveal.wordsDur + 's'); r.setProperty('--words-stagger', C.reveal.wordsStagger + 's'); r.setProperty('--words-ease', b(C.reveal.wordsEase));
    r.setProperty('--rule-dur', C.reveal.ruleDur + 's'); r.setProperty('--rule-ease', b(C.reveal.ruleEase));
    r.setProperty('--wipe-dur', C.reveal.wipeDur + 's'); r.setProperty('--wipe-ease', b(C.reveal.wipeEase));
    r.setProperty('--rise-dur', C.reveal.riseDur + 's'); r.setProperty('--rise-y', C.reveal.riseY + 'px'); r.setProperty('--rise-ease', b(C.reveal.riseEase));
    r.setProperty('--hdr-dur', C.header.dur + 's'); r.setProperty('--logo-dur', C.logo.dur + 's'); r.setProperty('--logo-stagger', C.logo.stagger + 's');
    r.setProperty('--dot-dur', C.button.dotDur + 's'); r.setProperty('--hero-vh', C.hero.scrollVh);
    r.setProperty('--intro-dur', C.hero.introDur + 's'); r.setProperty('--sway', C.hero.swayDeg); r.setProperty('--sway-dur', C.hero.swayDur + 's');
  };
  VT.apply();
})();
