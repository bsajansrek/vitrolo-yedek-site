/* Vitrolo — forms.js (v3, 2026-11-07) · /free-draft iki adımlı form → POST /api/draft (worker/index.js).
   Mesajlar dürüst: "A real person will reach out within 1 business day" YALNIZ sunucu başvuruyu iletişim uygulamasına teslim ettiyse (delivered:true).
   Kaydedildi ama teslim edilmediyse farklı, açık bir mesaj. Hata olursa "kaydedilmedi" denir ve yazılanlar formda kalır. */
(function () {
  var VT = window.VT, C = VT.C, $ = VT.$, $$ = VT.$$;
  VT.init('draft-form', function () {
    var form = $('#draft-form'); if (!form) return;
    var t0 = Date.now(); // bot süzgeci: formda geçen süre sunucuya _dt olarak gider (en az 3 sn)
    var s1 = $('[data-step="1"]', form), s2 = $('[data-step="2"]', form), bars = $$('.dform__steps span', form), status = $('#form-status');
    // ön doldurma: sessionStorage (ağ yok) ve no-JS GET yedeği (?business=&email=)
    var qs = new URLSearchParams(location.search);
    try {
      var nm = sessionStorage.getItem('vt-name') || qs.get('business') || '', em = sessionStorage.getItem('vt-email') || qs.get('email') || '';
      if (nm) $('#d-biz').value = nm; if (em) $('#d-email').value = em;
      if (qs.get('email') || qs.get('business')) history.replaceState(null, '', location.pathname); // adres çubuğunda kişisel veri kalmasın
    } catch (e) { }
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    // Telefon zorunlu (müdür 2026-11-07). Sunucu (worker/index.js telefonCoz) ile aynı kural: ABD 10 hane (başında 1 olabilir, alan kodu 2-9) ya da +/00 ile uluslararası 8-15 hane.
    function phoneOk(v) {
      var s = String(v || '').trim(); if (!/^[+\d\s().\-]{7,30}$/.test(s)) return false;
      var d = s.replace(/\D/g, ''), intl = s.charAt(0) === '+' || d.indexOf('00') === 0;
      if (d.indexOf('00') === 0) d = d.slice(2);
      if (intl && d.charAt(0) !== '1') return /^[2-9]\d{7,14}$/.test(d);
      if (d.length === 10) d = '1' + d;
      return /^1[2-9]\d{9}$/.test(d);
    }
    function fieldOk(f, v) { return f.dataset.f === 'email' ? emailRe.test(v) : f.dataset.f === 'phone' ? phoneOk(v) : v.length > 0; }
    function validate1() {
      var ok = true, first = null;
      $$('.field[data-f]', s1).forEach(function (f) {
        var inp = $('input', f), v = inp.value.trim(), good = fieldOk(f, v);
        f.classList.toggle('err', !good); inp.setAttribute('aria-invalid', !good);
        if (!good) { ok = false; if (!first) first = inp; }
      });
      if (first) first.focus();
      return ok;
    }
    $$('.field[data-f] input', s1).forEach(function (i) { i.addEventListener('input', function () { var f = i.closest('.field'); if (f.classList.contains('err')) { var v = i.value.trim(), good = fieldOk(f, v); if (good) { f.classList.remove('err'); i.setAttribute('aria-invalid', 'false'); } } }); });
    function go(to) {
      var from = to === 2 ? s1 : s2, dest = to === 2 ? s2 : s1;
      from.hidden = true; dest.hidden = false;
      bars.forEach(function (b, i) { b.classList.toggle('on', i < to); });
      var h = $('.eyebrow', dest); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      if (VT.MO && window.gsap) gsap.fromTo(dest, { x: to === 2 ? 28 : -28, opacity: 0 }, { x: 0, opacity: 1, duration: C.form.slide, ease: C.form.ease, clearProps: 'transform,opacity' });
      var top = form.getBoundingClientRect().top + window.scrollY - 100; window.scrollTo({ top: Math.max(0, top), behavior: VT.MO ? 'smooth' : 'auto' });
    }
    $('[data-next]', form).addEventListener('click', function () { if (validate1()) go(2); });
    $('[data-back]', form).addEventListener('click', function () { go(1); });
    form.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !s1.hidden && e.target.tagName === 'INPUT') { e.preventDefault(); if (validate1()) go(2); } });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!s1.hidden) { if (validate1()) go(2); return; }
      if (!validate1()) { go(1); return; }
      if ($('[name=company_site]', form).value) return; // honeypot: bot
      var ep = form.dataset.endpoint, btn = $('button[type=submit]', form);
      if (!ep || (btn && btn.disabled)) return;
      var data = { _dt: Date.now() - t0 }; new FormData(form).forEach(function (v, k) { if (k === 'interest') (data[k] = data[k] || []).push(v); else data[k] = v; });
      function say(cls, html) { status.className = 'note-live' + (cls ? ' ' + cls : ''); status.innerHTML = html; status.setAttribute('tabindex', '-1'); status.focus(); }
      var ALAN = { name: 'your name', business: 'business name', city: 'city and state', email: 'email', phone: 'phone (U.S. 10 digits, or + and country code)', link: 'link', notes: 'notes (too long)', kind: 'business type', site: 'website answer', interest: 'interests' };
      if (btn) btn.disabled = true;
      status.className = 'note-live'; status.textContent = 'Sending...';
      fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), credentials: 'same-origin' })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { return { st: r.status, b: b }; }); })
        .then(function (x) {
          var b = x.b || {};
          if (x.st === 200 && b.ok) {
            s1.hidden = true; s2.hidden = true; var st = $('.dform__steps', form); if (st) st.hidden = true;
            // 2026-11-11 (SITE-AKIS-HARITASI-v1 madde 2-3): sunucunun yol/izin cevabına göre dürüst mesaj (form-v4.js ile aynı mantık; eski sunucuda delivered'a döner)
            var yol = b.yol || (b.delivered ? 'ekip' : 'bekliyor');
            if (yol === 'ekip' && b.izin === 0) say('ok', '<strong>We got your request.</strong> We won\'t call you. A real person will email you within 1 business day.');
            else if (yol === 'ekip') say('ok', '<strong>We got your request.</strong> A real person will reach out within 1 business day.');
            else if (yol === 'elle') say('ok', '<strong>We got your request and saved it.</strong> Our phone team can\'t take this one, so a person on our team will read it and reply by email if we can help. We won\'t call you about it.');
            else if (yol === 'kayit') say('ok', '<strong>We saved your request.</strong> We can\'t take it on right now, so please don\'t wait for a reply from us.');
            else say('ok', '<strong>We got your request and saved it.</strong> It is not in front of our team yet, so this one may take longer than 1 business day. You don\'t need to send it again.');
            return;
          }
          if (btn) btn.disabled = false;
          if (x.st === 422 && b.error === 'invalid' && b.fields && b.fields.length) {
            var f1 = b.fields.filter(function (f) { return ['name', 'business', 'city', 'email', 'phone'].indexOf(f) >= 0; });
            if (f1.length) { go(1); validate1(); }
            say('', 'Please check: ' + b.fields.map(function (f) { return ALAN[f] || f; }).join(', ') + '. Your request was not saved yet.');
          } else if (x.st === 422 && b.error === 'too_fast') say('', 'That was quick! Please check your details and press Send again.');
          else if (x.st === 429) say('', 'Too many tries from this connection. Please wait an hour and try again. Your request was not saved.');
          else say('', 'Something went wrong on our side and your request was not saved. Please try again in a few minutes.');
        })
        .catch(function () { if (btn) btn.disabled = false; say('', 'We couldn\'t reach our server, so your request was not saved. Check your connection and try again.'); });
    });
  });
})();
