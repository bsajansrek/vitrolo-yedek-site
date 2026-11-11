/* Vitrolo Order sahneleri (/vitrolo-yedek-site/services/ordering, 2026-11-06 K77). Her sahne [data-os][data-n]: data-s 0..n adım adım, görününce BİR KEZ oynar (≤ 5 sn) + Replay.
   Hareket yalnız html.mo iken (hareket azaltma ve ?static=1'de sahne son karede durur; işaretlemenin varsayılanı da son kare: JS'siz tam görünür). */
(function () {
  'use strict';
  var mo = document.documentElement.classList.contains('mo');
  var scenes = Array.prototype.slice.call(document.querySelectorAll('[data-os]'));
  if (!scenes.length) return;
  var STEP = 900;
  function play(sc) {
    var n = +sc.getAttribute('data-n') || 1, s = 0, dt = Math.min(STEP, 4600 / n);
    clearInterval(sc._t);
    sc.setAttribute('data-s', '0');
    sc._t = setInterval(function () {
      s++; sc.setAttribute('data-s', String(s));
      if (s >= n) clearInterval(sc._t);
    }, dt);
  }
  scenes.forEach(function (sc) {
    var sec = sc.closest('section');
    var rb = sec && sec.querySelector('[data-os-replay]');
    if (!mo) { if (rb) rb.hidden = true; return; }
    sc.setAttribute('data-s', '0');
    if (rb) rb.addEventListener('click', function () { play(sc); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); play(sc); } });
      }, { threshold: 0.35 });
      io.observe(sc);
    } else { sc.setAttribute('data-s', sc.getAttribute('data-n')); }
  });
})();
