/* Vitrolo — site-v2.js · 2026-11-06 · her sayfada. (1) Sürüm denetimi (K62, site için hafif sürüm): sekme öne gelince en çok dakikada bir
   /surum.json sorulur; yeni sürüm varsa ve kullanıcı bir şey yazmıyorsa sayfa bir kez sessizce yenilenir (aynı sürüm için döngü koruması).
   Yazı alanı doluysa yenilemez; bir sonraki tıklamada zaten yeni sayfa gelir (HTML no-cache). (2) Örnek kartlarında imleçle hafif 3B eğim. */
(function () {
  var html = document.documentElement, m = document.querySelector('meta[name="vitrolo-surum"]'), cur = m && m.content, last = 0;
  function busy() {
    var a = document.activeElement;
    if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return true;
    return [].some.call(document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),textarea'), function (i) { return i.value && i.value !== i.defaultValue; });
  }
  function check() {
    if (!cur || !window.fetch || Date.now() - last < 60000) return; last = Date.now();
    
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
  window.addEventListener('online', check);
  last = Date.now(); // ilk yüklemede sorma: sayfa zaten taze geldi

  if (!html.classList.contains('mo') || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  [].forEach.call(document.querySelectorAll('.wk__media'), function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', (x * 6).toFixed(2) + 'deg'); el.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', function () { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
  });
})();
