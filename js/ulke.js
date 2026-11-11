/* Vitrolo ülkeye göre fiyat (K110, patron 2026-11-11: "kim hangi ülke üzerinden giriyorsa ona göre çıkar") + K131 (aynı gün: her tutarda para birimi ve KDV durumu).
   Sayfalar ABD fiyatıyla ($) basılır; ülke /api/ulke'den gelir (Worker: request.cf.country / CF-IPCountry; yanıt Cache-Control: no-store, Vary: CF-IPCountry).
   HTML herkese aynıdır, bu yüzden önbellek yanlış para birimi gösteremez. TR ise:
     1) sayfadaki katalog tutarları ($ ile) /data/fiyat-ulke-<sürüm>.js eşlemesiyle TL tutarına çevrilir (KDV dahil),
     2) tek başına duran her tutarın yanına "KDV dahil" yazılır (K131; üstü çizili eski fiyat, indirim, 0, seçim kutusu ve tablo hücresi hariç: onlar notla),
        [data-vergi] etiketleri "KDV dahil" olur, [data-ulke-not] öğeleri "Fiyatlar: Türkiye (TL, KDV dahil)" notunu gösterir,
     3) hesaplayıcıya 'vitrolo:ulke' olayı gider (bundle.js TR katalogla, KDV dahil hesaplar).
   TR değilse (ABD ve bilinmeyen): tutarlar $ kalır; [data-vergi] "+ applicable sales tax" kalır; fiyat olan sayfada tek satır genel not (K131, ABD için nötr ifade).
   Örnek işletme sayfaları (/vitrolo-yedek-site/samples/) ve kurgusal menü/sahne fiyatları ([data-fy-sabit], .os, .qm, .demo__box) çevrilmez, etiket almaz.
   Kaynak: uretim-araci/v3/assets/js/ulke.js; site-v3/js ve site-v4-taslak/js birebir kopyalarını scripts/katalog-uret.py yazar/denetler.
   Harici dosya (CSP script-src 'self'; connect-src 'self'). Metinler burada; fiyat yok (fiyatlar yalnız katalogdan). */
(function () {
  'use strict';
  var d = document, h = d.documentElement;
  var ATLA = 'script,style,svg,noscript,textarea,[data-fy-sabit],.os,.qm,[data-os],.demo__box';
  var RE = /\$(\d{1,3}(?:,\d{3})+|\d+)(?![.,]?\d)/g;
  var VERGI_US = '+ applicable sales tax';                          /* K131: ABD için nötr ifade */
  var NOT_US = 'Prices in US dollars (USD), plus applicable sales tax.';
  /* tek başına tutar ama etiket almayanlar: üstü çizili, indirim, seçim, tablo hücresi (tablonun notu var), hesaplayıcı özeti ve öneri kartları (kendi [data-vergi]'leri var) */
  var ETIKETSIZ = 's,del,option,select,td,th,[data-bundle-save],[data-bundle-lines],[data-bundle-list],[data-bundle-suggest],[data-vergi],.vergi,.bnd__sum';

  function cevir(kok, esle) {
    var w = d.createTreeWalker(kok, NodeFilter.SHOW_TEXT, null), n, list = [], say = 0, yeni = [];
    while ((n = w.nextNode())) { if (n.nodeValue.indexOf('$') > -1) list.push(n); }
    list.forEach(function (t) {
      var p = t.parentElement;
      if (!p || p.closest(ATLA)) return;
      var v = t.nodeValue.replace(RE, function (m) { if (Object.prototype.hasOwnProperty.call(esle, m)) { say++; return esle[m]; } return m; });
      if (v !== t.nodeValue) { t.nodeValue = v; yeni.push(p); }
    });
    cevir.son = yeni;
    return say;
  }

  /* K131: tek başına duran tutarın (öğenin bütün metni tutar) sonuna vergi etiketi */
  function etiketle(ogeler, metin) {
    var say = 0;
    ogeler.forEach(function (p) {
      var t = (p.textContent || '').replace(/\s+/g, ' ').trim();
      if (!/^\d{1,3}(?:\.\d{3})*(?:,\d+)? TL$/.test(t) || /^0 TL$/.test(t)) return;
      if (p.closest(ETIKETSIZ)) return;
      if (p.querySelector('.vergi')) return;
      var e = d.createElement('span'); e.className = 'vergi'; e.setAttribute('data-vergi-oto', ''); e.textContent = metin;
      p.appendChild(d.createTextNode(' ')); p.appendChild(e);   /* öğenin içine: dl/table yapısı bozulmaz */
      say++;
    });
    return say;
  }

  function fiyatVar() {   /* sayfada (kurgusal örnekler dışında) $ tutarı var mı */
    var w = d.createTreeWalker(d.body, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) { RE.lastIndex = 0; if (RE.test(n.nodeValue) && n.parentElement && !n.parentElement.closest(ATLA)) return true; }
    return false;
  }

  function notYaz(metin, say) {
    var notlar = Array.prototype.slice.call(d.querySelectorAll('[data-ulke-not]'));
    if (!notlar.length && say) {   /* fiyatı olan ama kendi notu olmayan sayfa: altbilginin başına tek satır */
      var f = d.querySelector('footer .wrap') || d.querySelector('footer') || d.querySelector('main');
      if (f) { var p = d.createElement('p'); p.className = 'fn ulke-not'; p.setAttribute('data-ulke-not', ''); f.insertBefore(p, f.firstChild); notlar.push(p); }
    }
    notlar.forEach(function (e) { e.textContent = metin; e.hidden = false; });
  }

  function uygula(u) {
    u = typeof u === 'string' && /^[A-Z]{2}$/.test(u) ? u : 'XX';
    var V = window.VITROLO_ULKE_FIYAT, T = (V && V.ulkeler && V.ulkeler[u]) || null;
    var ornek = /\/samples\//.test(location.pathname);
    h.setAttribute('data-ulke', u);
    h.setAttribute('data-para', T ? T.para : 'USD');
    if (T) {
      var say = ornek ? 0 : cevir(d.body, T.esle);
      if (!ornek) {
        etiketle(cevir.son || [], T.kdv);
        Array.prototype.slice.call(d.querySelectorAll('[data-vergi]')).forEach(function (e) { e.textContent = T.kdv; });
      }
      notYaz(T.not, say);
    } else if (!ornek) {
      Array.prototype.slice.call(d.querySelectorAll('[data-vergi]')).forEach(function (e) { e.textContent = VERGI_US; });
      notYaz(NOT_US, fiyatVar() ? 1 : 0);
    }
    window.VITROLO_ULKE = { ulke: u, fiyat: T, vergi: T ? T.kdv : VERGI_US };
    var ev;
    try { ev = new CustomEvent('vitrolo:ulke', { detail: window.VITROLO_ULKE }); } catch (e) { ev = d.createEvent('CustomEvent'); ev.initCustomEvent('vitrolo:ulke', false, false, window.VITROLO_ULKE); }
    d.dispatchEvent(ev);
  }

  window.VitroloUlke = { cevir: cevir, uygula: uygula, etiketle: etiketle, VERGI_US: VERGI_US, NOT_US: NOT_US };
  if (!window.fetch) { uygula(null); return; }
  uygula(null);
})();
