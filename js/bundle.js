/* Vitrolo "Build your bundle" hesaplayıcı + "Suggestions" (site v3, fiyat v19.1 = K85 üzerine K76 + K77, 2026-11-07: ilk 3 ay bakım dahil satırı).
   Veri: #bundle[data-katalog] (derlemede katalog.js'den, macros_v3.v19_bundle). Elle fiyat yok. Önceki sürüm: v3/arsiv/2026-11-06-fiyat-v19.0/bundle.js
   Kural (katalog.js sepetHesapla ile birebir): n = seçilen ürün sayısı (site + büyük site birlikte olmaz; büyük site seçilince site düşer),
   oran = INDIRIM basamağı (n'den), liste = ürünler + ek şube × fiyat (ek şube sayıya girmez, en az 1 ürün gerekir, en çok en_cok),
   ürün toplamı = Math.round(liste * (100 - oran) / 100), indirim = liste - ürün toplamı; bakım indirimsiz, yalnız gerektirdiği ürün seçiliyse.
   Öneri kartlarının derlemedeki toplamı burada aynı kuralla yeniden hesaplanır; fark olursa JS değeri yazılır ve konsola uyarı düşer.
   K131 (patron, 2026-11-11): öneri (hazır paket) kartları da bu dosyadaki AYNI hesapla() ile yazılır: tek tek toplam → indirim → paket fiyatı;
   aynı ürünler hesaplayıcıda seçilince aynı sonuç çıkar. Her toplamın yanında vergi durumu ([data-vergi]: TR "KDV dahil", diğer "+ applicable sales tax").
   Harici dosya (CSP script-src 'self'). */
(function () {
  'use strict';
  var root = document.getElementById('bundle');
  if (!root) return;
  var K;
  try { K = JSON.parse(root.getAttribute('data-katalog')); } catch (e) { return; }
  var $ = function (s) { return root.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var boxes = $$('input[data-item]'), cares = $$('select[data-care]'), subeSel = $('select[data-addon="sube"]');
  var U, B, E, pair, order, maxItems;
  var vEl = root.querySelector('[data-vergi]');
  var VERGI = vEl ? vEl.textContent.trim() : '';   /* K131: varsayılan (ABD/bilinmeyen) etiket HTML'de basılı; TR'de ulkeUygula değiştirir */
  function kur() {   /* K değişince (ülke TR → TL katalog, K110) yeniden kurulur */
    U = {}; K.urunler.forEach(function (u) { U[u.kod] = u; });
    B = {}; K.bakim.concat(K.birlesik_bakim || []).forEach(function (b) { B[b.kod] = b; });
    E = {}; (K.eklentiler || []).forEach(function (e) { E[e.kod] = e; });
    pair = {}; (K.birlikte_olmaz || []).forEach(function (g) { g.forEach(function (k) { pair[k] = g.filter(function (x) { return x !== k; }); }); });
    order = K.urunler.map(function (u) { return u.kod; });
    maxItems = order.length; (K.birlikte_olmaz || []).forEach(function (g) { maxItems -= g.filter(function (k) { return U[k]; }).length - 1; });
  }
  kur();
  var usdF = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  var tlF = function (n) { return Math.round(n).toLocaleString('tr-TR') + ' TL'; };   /* K110: Türkiye, KDV dahil */
  var usd = usdF;
  var minus = function (n) { return '−' + usd(n); };
  var nm = function (k) { return U[k].goster || U[k].kisa; };

  function oran(n) { var o = 0; K.indirim.forEach(function (b) { if (n >= b.adet) o = b.oran; }); return o; }
  function sonraki(n) { var o = oran(n); for (var i = 0; i < K.indirim.length; i++) { var b = K.indirim[i]; if (b.adet > n && b.oran > o) return b; } return null; }

  /* Saf hesap (test için dışarı açık: window.VitroloBundle.hesapla(urunler, bakim, sube)) */
  function hesapla(secim, bakim, sube) {
    var urunler = [];
    (secim || []).forEach(function (k) { if (U[k] && urunler.indexOf(k) < 0) urunler.push(k); });
    if (urunler.indexOf('site') > -1 && urunler.indexOf('buyuk_site') > -1) urunler.splice(urunler.indexOf('site'), 1);
    urunler.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
    var n = urunler.length, o = oran(n), liste = 0;
    urunler.forEach(function (k) { liste += U[k].fiyat; });
    var s = 0;
    if (E.sube && n) { s = Math.max(0, Math.min(E.sube.en_cok, Math.floor(+sube || 0))); liste += s * E.sube.fiyat; }
    var urunToplam = Math.round(liste * (100 - o) / 100), indirim = liste - urunToplam;
    var bakimlar = [], bakimToplam = 0;
    Object.keys(bakim || {}).forEach(function (k) {
      var ay = +bakim[k] || 0, b = B[k];
      if (!ay || !b || !b.fiyat[ay]) return;
      if (!b.gerekir.some(function (u) { return urunler.indexOf(u) > -1; })) return;
      bakimlar.push({ kod: k, ay: ay, fiyat: b.fiyat[ay] }); bakimToplam += b.fiyat[ay];
    });
    /* v19.3 (K110): QR bakımı + sipariş bakımı birlikte → tek restoran bakımı (katalog.js bakimBirlestir ile aynı: aynı ay → o ay;
       farklı ay → uzun ay, ayrı ayrı toplamdan pahalı değilse) */
    (K.birlesik_bakim || []).forEach(function (r) {
      var xa = null, xb = null, inU = function (u) { return urunler.indexOf(u) > -1; };
      bakimlar.forEach(function (x) { if (x.kod === r.yerine[0]) xa = x; if (x.kod === r.yerine[1]) xb = x; });
      if (!xa || !xb || !r.gerekir.some(inU) || !(r.ayrica || []).some(inU)) return;
      var m = Math.max(xa.ay, xb.ay), f = r.fiyat[m];
      if (!(xa.ay === xb.ay || f <= xa.fiyat + xb.fiyat)) return;
      bakimlar = bakimlar.filter(function (x) { return x !== xa && x !== xb; });
      bakimlar.push({ kod: r.kod, ay: m, fiyat: f, ayri: xa.fiyat + xb.fiyat });
      bakimToplam += f - xa.fiyat - xb.fiyat;
    });
    var dahil = null;   /* K85 + model §3: masa/sipariş/sadakat ile ilk 3 ay bakım dahil ($0); katalog.js sepetHesapla ile aynı */
    K.bakim.forEach(function (b) { if (!dahil && b.dahil && b.dahil.urunler.some(function (u) { return urunler.indexOf(u) > -1; })) dahil = { kod: b.kod, ay: b.dahil.ay }; });
    bakimlar.forEach(function (x) { x.dahilSonra = !!(dahil && (dahil.kod === x.kod || (B[x.kod].yerine || []).indexOf(dahil.kod) > -1)); });
    return { urunler: urunler, sube: s, adet: n, oran: o, liste: liste, indirim: indirim, urunToplam: urunToplam, bakimlar: bakimlar, bakimToplam: bakimToplam, toplam: urunToplam + bakimToplam, dahil: dahil, sonraki: sonraki(n) };
  }
  window.VitroloBundle = { hesapla: hesapla, katalog: K, para: 'USD', vergi: function () { return VERGI; } };

  var el = {
    empty: $('[data-bundle-empty]'), lines: $('[data-bundle-lines]'), listrow: $('[data-bundle-listrow]'), list: $('[data-bundle-list]'),
    disc: $('[data-bundle-discount]'), label: $('[data-bundle-label]'), save: $('[data-bundle-save]'), items: $('[data-bundle-items]'),
    carerow: $('[data-bundle-carerow]'), care: $('[data-bundle-care]'), total: $('[data-bundle-total]'), hint: $('[data-bundle-hint]'), live: $('[data-bundle-live]')
  };
  var note = '';
  var tiers = Array.prototype.slice.call(document.querySelectorAll('[data-tier]'));

  function render() {
    var sec = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.getAttribute('data-item'); });
    var bk = {};
    cares.forEach(function (s) {
      var need = (s.getAttribute('data-needs') || '').split(',');
      var ok = need.some(function (u) { return sec.indexOf(u) > -1; });
      s.disabled = !ok;
      if (!ok && s.value !== '0') s.value = '0';
      s.closest('.bnd__care').classList.toggle('is-off', !ok);
      bk[s.getAttribute('data-care')] = +s.value || 0;
    });
    var sube = 0;
    if (subeSel) {
      var okS = sec.length > 0;
      subeSel.disabled = !okS;
      if (!okS && subeSel.value !== '0') subeSel.value = '0';
      subeSel.closest('.bnd__care').classList.toggle('is-off', !okS);
      sube = +subeSel.value || 0;
    }
    var r = hesapla(sec, bk, sube);
    root.classList.toggle('has-items', r.adet > 0);
    el.empty.hidden = r.adet > 0;
    var h = '';
    r.urunler.forEach(function (k) { h += '<li><span>' + nm(k) + '</span><span class="num">' + usd(U[k].fiyat) + '</span></li>'; });
    if (r.sube) h += '<li><span>' + E.sube.kisa + ' &times; ' + r.sube + ' <em class="bnd__nd">not an item</em></span><span class="num">' + usd(r.sube * E.sube.fiyat) + '</span></li>';
    if (r.dahil) h += '<li class="is-care is-incl" data-bundle-included><span>' + B[r.dahil.kod].dahil.ad + '</span><span class="num">' + usd(0) + '</span></li>';
    r.bakimlar.forEach(function (b) { h += '<li class="is-care"><span>' + B[b.kod].ad + ' &middot; ' + b.ay + ' mo <em class="bnd__nd">no discount' + (B[b.kod].alt ? ' &middot; ' + B[b.kod].alt : '') + (b.dahilSonra && r.dahil ? ' &middot; ' + B[r.dahil.kod].dahil.sonra : '') + '</em></span><span class="num">' + usd(b.fiyat) + '</span></li>'; });
    el.lines.innerHTML = h;
    el.listrow.hidden = !r.oran;
    el.list.textContent = usd(r.liste);
    if (r.oran) { el.label.textContent = r.adet + ' items · ' + r.oran + '% bundle discount'; el.save.textContent = minus(r.indirim); }
    else { el.label.textContent = r.adet === 1 ? '1 item · no bundle discount' : 'Bundle discount'; el.save.textContent = '—'; }
    el.disc.classList.toggle('is-on', !!r.oran);
    el.items.textContent = r.adet ? usd(r.urunToplam) : '—';
    el.carerow.hidden = !r.bakimToplam;
    el.care.textContent = usd(r.bakimToplam);
    el.total.textContent = r.adet ? usd(r.toplam) : '—';
    var hint, nx = r.sonraki;
    if (!r.adet) hint = 'Pick 2 items for ' + oran(2) + '% off.';
    else if (nx && nx.adet <= maxItems) hint = 'Add ' + (nx.adet - r.adet) + ' more item' + (nx.adet - r.adet > 1 ? 's' : '') + ' for ' + nx.oran + '% off.';
    else if (nx) hint = 'That is every item we sell today: ' + r.oran + '% is the biggest discount for now.';
    else hint = 'You have the biggest bundle discount: ' + r.oran + '%.';
    el.hint.textContent = hint;
    // v19.2 (K95): basamaklar aralıklı (3–4 aynı oran) → seçili ürün sayısına eşit ya da altındaki en büyük basamak yanar
    var cur = 0;
    tiers.forEach(function (t) { var n = +t.getAttribute('data-tier'); if (r.adet >= n && n > cur) cur = n; });
    tiers.forEach(function (t) {
      var n = +t.getAttribute('data-tier');
      var on = r.adet > 0 && n === cur;
      t.classList.toggle('is-on', on);
      if (on) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
    });
    var say = r.adet ? (r.adet + (r.adet === 1 ? ' item' : ' items') + (r.sube ? ' and ' + r.sube + ' extra location' + (r.sube > 1 ? 's' : '') : '') +
      (r.oran ? ', ' + r.oran + '% bundle discount, you save ' + usd(r.indirim) : '') +
      (r.bakimToplam ? '. Care ' + usd(r.bakimToplam) + ', no discount' : '') + '. Total ' + usd(r.toplam) + (VERGI ? ', ' + VERGI : '') + '.') : 'No items picked.';
    el.live.textContent = (note ? note + ' ' : '') + say;
    note = '';
  }

  boxes.forEach(function (b) {
    b.addEventListener('change', function () {
      var k = b.getAttribute('data-item');
      if (b.checked && pair[k]) {
        pair[k].forEach(function (o) {
          var ob = root.querySelector('input[data-item="' + o + '"]');
          if (ob && ob.checked) { ob.checked = false; note = U[k].kisa + ' replaces the ' + U[o].kisa + '.'; }
        });
      }
      render();
    });
  });
  cares.forEach(function (s) { s.addEventListener('change', render); });
  if (subeSel) subeSel.addEventListener('change', render);

  /* ---- K131: öneri kartı = hesaplayıcıyla aynı hesap (hesapla). Tek tek toplam → indirim → paket fiyatı + vergi etiketi ---- */
  function kartYaz(btn) {
    var c = btn.closest('.sug'); if (!c) return null;
    var r = hesapla(btn.getAttribute('data-suggest').split(','), {}, 0);
    var q = function (s) { return c.querySelector(s); }, t;
    if ((t = q('[data-sug-liste]'))) t.textContent = usd(r.liste);
    if ((t = q('[data-sug-listrow]'))) t.hidden = !r.oran;
    if ((t = q('[data-sug-oran]'))) t.textContent = r.oran ? r.adet + ' items · ' + r.oran + '% bundle discount' : '1 item · no bundle discount';
    if ((t = q('[data-sug-indirim]'))) t.textContent = r.oran ? minus(r.indirim) : '—';
    if ((t = q('[data-sug-total]'))) t.textContent = usd(r.urunToplam);
    Array.prototype.slice.call(c.querySelectorAll('[data-vergi]')).forEach(function (e) { e.textContent = VERGI; });
    btn.setAttribute('data-total-js', String(r.urunToplam));
    return r;
  }

  /* ---- Suggestions: sekmeler (ok tuşları) + "Use this bundle" ---- */
  var sug = $('[data-bundle-suggest]');
  if (sug) {
    var tabs = Array.prototype.slice.call(sug.querySelectorAll('[role=tab]'));
    var panels = Array.prototype.slice.call(sug.querySelectorAll('[role=tabpanel]'));
    var tl = sug.querySelector('[role=tablist]');
    function pick(i, focus) {
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1; });
      panels.forEach(function (p, j) { p.hidden = j !== i; });
      if (focus) tabs[i].focus();
    }
    if (tl && tabs.length) {
      tl.hidden = false; sug.classList.add('is-tabs');
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { pick(i); });
        t.addEventListener('keydown', function (e) {
          var k = e.key, n = tabs.length, j = null;
          if (k === 'ArrowRight') j = (i + 1) % n; else if (k === 'ArrowLeft') j = (i - 1 + n) % n; else if (k === 'Home') j = 0; else if (k === 'End') j = n - 1;
          if (j !== null) { e.preventDefault(); pick(j, true); }
        });
      });
      pick(0);
    }
    Array.prototype.slice.call(sug.querySelectorAll('[data-suggest]')).forEach(function (btn) {
      var list = btn.getAttribute('data-suggest').split(',');
      var card = btn.closest('.sug'), r = kartYaz(btn);
      if (r.urunToplam !== +btn.getAttribute('data-total')) {  /* derleme ile JS farklıysa JS'e güven (kartYaz yazdı), uyar */
        if (window.console) console.warn('Vitrolo bundle: suggestion total differs', list.join('+'), btn.getAttribute('data-total'), r.urunToplam);
        card.setAttribute('data-mismatch', '1');
      }
      btn.hidden = false;
      btn.addEventListener('click', function () {
        boxes.forEach(function (b) { b.checked = list.indexOf(b.getAttribute('data-item')) > -1; });
        cares.forEach(function (s) { s.value = '0'; });
        if (subeSel) subeSel.value = '0';
        note = btn.getAttribute('data-name') + ' added to your bundle.';
        render();
        $$('.sug.is-on').forEach(function (c) { c.classList.remove('is-on'); });
        card.classList.add('is-on');
      });
    });
  }
  root.classList.add('is-ready');
  render();

  /* ---- Ülkeye göre fiyat (K110): js/ulke.js TR derse TR katalog (TL, KDV dahil) ile hesapla; diğer ülke/bilinmeyen → $ aynen ---- */
  function ulkeUygula(T) {
    if (!T || !T.katalog || K === T.katalog) return;
    K = T.katalog; kur(); usd = tlF; VERGI = T.kdv || VERGI;
    window.VitroloBundle.katalog = K; window.VitroloBundle.para = T.para || 'TRY';
    $$('[data-vergi]').forEach(function (e) { e.textContent = VERGI; });
    $$('[data-suggest]').forEach(kartYaz);   /* K131: kartlar hesaplayıcıyla aynı hesapla() ve aynı TR katalogla */
    render();
  }
  document.addEventListener('vitrolo:ulke', function (e) { ulkeUygula(e.detail && e.detail.fiyat); });
  if (window.VITROLO_ULKE) ulkeUygula(window.VITROLO_ULKE.fiyat);
})();
