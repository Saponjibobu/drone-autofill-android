/* Pengisi form DRONE 5.0. Dipanggil aplikasi lewat window.DroneAF.run(hari, variasi, sampaiAkhir, ulang). */
(function () {
  if (window.DroneAF) return;

  var Q = {
    jabatan: 'rdb169863b7d94b29b15bbaedfbf36bee', nama: 'r0583c4541b1c4cd88c6777a222ffd7a6',
    biro: 'r170ec564c54b4f4c9b9c3f00041327cf', satker: 'r45a87620e6e84903a7f2df1a8a9e2f20',
    status: 'ra39a2e38ea9649b88d0f0e8b4da129ac',
    srS: 'r1b56d1424af74fa7803600720db76168', srE: 'rba4b116db40249aa97cda608bb3ce700',
    talk: 'rd0c7f3f2174d4eaabcad8b9e45394248', insp: 'rba7ef7be86c043eeb6c6d1b2b9688524',
    coach: 'r5c3c87ed78224c28b025a46d45988911',
    saranCat: 'r3dc6285bec094ab98218ad15efd9c6f4', saran: 'r2f2bb2abe14f4f6c9ecb6c8808ae3c3e'
  };
  var PILAR = {
    2: ['ra308f275e80640269445e0f8b2a1e3f1', 'r36005cced2bb4b8490c179ddfdf65131', 'rba0879b9561d449a97e02ae0e507931d', 'r1dba8aae5c7b41e099dabc35cb9c69d8'],
    3: ['re0e7eb9e3311436d9d5589da2069db15', 'r9b075f684eb9421387e6f7370a4a404d', 'r7ab277ca41ef4ac4996f60aa572d18f7', 'r14c0ef0fc33049858bc9944686828804'],
    4: ['rdf69d9b4db0d492fab5c2199ce21bc20', 're97104c6331043c491bd2308ee34876f', 'r46c76b6a9e8e40d6aea72a39e6101f1e', 'r1460dca7e8f844b48b8e8568e0129609'],
    5: ['r0f4402b175dc4557aa533b75e5be4824', 'ra87fbbc5920f4ebb86d64659a01387d3', 'r3ba1a5dbc37d4934a5f691b0e86f37bc', 'rdd656ac59dd94308bbee5e37056bd506']
  };
  var HARI = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  var NAMA_PILAR = ['', 'Safety Resilience', 'Productivity & Quality', 'Low Cost Operation', 'Green Standard', 'Continuous Improvement'];

  var CFG = window.droneMerge(null);
  var busy = false, follow = null, filled = {};

  function ui(msg, kind) { try { window.AndroidBridge.onStatus(String(msg), kind || ''); } catch (e) {} }
  function lock(on) { try { window.AndroidBridge.onBusy(!!on); } catch (e) {} }
  function reloadForm(day) { try { window.AndroidBridge.reloadForm(day); } catch (e) {} }

  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  function norm(s) { return String(s == null ? '' : s).replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function items() { return Array.prototype.slice.call(document.querySelectorAll('[data-automation-id="questionItem"]')); }
  function qidOf(it) {
    var h = it.querySelector('[id^="QuestionId_"]');
    if (h) return h.id.replace('QuestionId_', '');
    var l = it.querySelector('[aria-labelledby*="QuestionId_"]');
    var m = l && /QuestionId_(\w+)/.exec(l.getAttribute('aria-labelledby'));
    return m ? m[1] : null;
  }
  function itemById(id) {
    var h = document.getElementById('QuestionId_' + id) || document.querySelector('[aria-labelledby*="QuestionId_' + id + '"]');
    return h ? h.closest('[data-automation-id="questionItem"]') : null;
  }
  function btn(name) { return document.querySelector('[data-automation-id="' + name + '"]'); }
  function startBtn() {
    var bs = document.querySelectorAll('button');
    for (var i = 0; i < bs.length; i++) if (/^(start now|mulai sekarang|mulai)$/i.test(bs[i].textContent.trim())) return bs[i];
    return null;
  }
  function sig() { var its = items(); return its.length ? (qidOf(its[0]) || its[0].textContent.slice(0, 40)) : ''; }
  async function waitChange(prev) {
    for (var i = 0; i < 50; i++) { await sleep(150); var s = sig(); if (s && s !== prev) { await sleep(300); return true; } }
    return false;
  }
  async function waitReady(ms) {
    for (var i = 0; i < Math.ceil(ms / 250); i++) { if (items().length || startBtn()) return true; await sleep(250); }
    return false;
  }
  function onForm() { return /(^|\.)forms\.(cloud\.microsoft|office\.com)$/i.test(location.hostname); }

  function isoWeek(d) {
    var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var wd = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - wd);
    return Math.ceil(((t - new Date(Date.UTC(t.getUTCFullYear(), 0, 1))) / 86400000 + 1) / 7);
  }
  function toMin(s) { var m = /^(\d{1,2}):(\d{2})/.exec(String(s || '')); return m ? (+m[1]) * 60 + (+m[2]) : null; }
  function fmt(m) { var h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm; }
  function rnd(a, b) { if (b < a) b = a; return a + Math.floor(Math.random() * (b - a + 1)); }
  function makeTimes(day) {
    var lo = toMin(CFG.jam.awal), hi = toMin(CFG.jam.akhir);
    if (lo == null) lo = 480; if (hi == null) hi = 990;
    lo = Math.ceil(lo / 5) * 5; hi = Math.floor(hi / 5) * 5;
    if (hi - lo < 180) hi = lo + 180;
    var srS = lo + 5 * rnd(0, 4);
    var srE = Math.min(hi, day === 1 ? srS + 5 * rnd(30, 54) : srS + 5 * rnd(3, 6));
    var pS = null, pE = null;
    if (day !== 1) {
      var a = srE + 15, b = Math.max(a, Math.min(srE + 120, hi - 150));
      pS = a + 5 * rnd(0, Math.floor((b - a) / 5));
      pE = Math.min(hi, pS + 5 * rnd(24, 60));
      if (pE <= pS) pE = Math.min(hi, pS + 30);
    }
    return { srS: srS, srE: srE, pS: pS, pE: pE };
  }

  function buildPlan(day, vk) {
    var c = (CFG.content[vk] || {})[day] || {};
    var t = makeTimes(day), NA = 'n/a', id = CFG.identitas, p = {};
    p[Q.jabatan] = ['radio', id.jabatan];
    if (id.jabatan === 'Specialist') p[Q.nama] = ['dd', id.nama];
    p[Q.biro] = ['dd', id.biro]; p[Q.satker] = ['dd', id.satker]; p[Q.status] = ['dd', id.status];
    p[Q.srS] = ['text', fmt(t.srS)]; p[Q.srE] = ['text', fmt(t.srE)];
    p[Q.talk] = ['text', c.talk || NA];
    p[Q.insp] = ['text', day === 1 ? (c.a || NA) : NA];
    p[Q.coach] = ['text', day === 1 ? (c.b || NA) : NA];
    for (var k = 2; k <= 5; k++) {
      var ids = PILAR[k], on = k === day;
      p[ids[0]] = ['text', on ? fmt(t.pS) : NA]; p[ids[1]] = ['text', on ? fmt(t.pE) : NA];
      p[ids[2]] = ['text', on ? (c.a || NA) : NA]; p[ids[3]] = ['text', on ? (c.b || NA) : NA];
    }
    p[Q.saranCat] = ['radio', c.cat]; p[Q.saran] = ['text', c.saran || NA];
    return { p: p, t: t };
  }

  function setText(el, v) {
    var proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    el.focus(); setter.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.blur();
  }
  function pickRadio(it, v) {
    var rs = it.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < rs.length; i++) if (norm(rs[i].value) === norm(v)) { if (!rs[i].checked) rs[i].click(); return true; }
    return false;
  }
  async function pickDD(it, v) {
    var b = it.querySelector('[aria-haspopup="listbox"]') || it.querySelector('[role="button"]');
    if (!b) return false;
    if (norm(b.textContent) === norm(v)) return true;
    b.click();
    var opt = null;
    for (var i = 0; i < 20 && !opt; i++) {
      await sleep(100);
      var os = document.querySelectorAll('[role="option"]');
      for (var j = 0; j < os.length; j++) if (norm(os[j].textContent) === norm(v)) { opt = os[j]; break; }
    }
    if (!opt) {
      (document.activeElement || document.body).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
      await sleep(200);
      return false;
    }
    opt.scrollIntoView({ block: 'nearest' }); opt.click(); await sleep(250);
    return norm(b.textContent) === norm(v);
  }
  async function fillPage(plan, miss) {
    var keys = Object.keys(plan);
    for (var i = 0; i < keys.length; i++) {
      var it = itemById(keys[i]); if (!it) continue;
      var kind = plan[keys[i]][0], v = plan[keys[i]][1], ok = true;
      if (v == null || v === '') continue;
      if (kind === 'text') {
        var el = it.querySelector('[data-automation-id="textInput"]') || it.querySelector('textarea, input[type="text"]');
        if (el) { if (el.value !== v) setText(el, v); } else ok = false;
      } else if (kind === 'radio') ok = pickRadio(it, v);
      else if (kind === 'dd') ok = await pickDD(it, v);
      if (!ok && miss.indexOf(v) < 0) miss.push(v);
      await sleep(40);
    }
  }

  function summary(b) {
    var day = b.day, t = b.t;
    var s = 'Selesai: ' + HARI[day] + ' (' + NAMA_PILAR[day] + '), variasi ' + b.vk + '. ';
    s += (day === 1 ? 'Safety Resilience ' : 'Safety Talk ') + fmt(t.srS) + '–' + fmt(t.srE);
    if (day !== 1) s += ', ' + NAMA_PILAR[day] + ' ' + fmt(t.pS) + '–' + fmt(t.pE);
    s += '. Cek isian, unggah foto bila perlu (Back), lalu tekan Submit.';
    if (b.miss.length) s += ' Tidak ditemukan, pilih manual: ' + b.miss.join(', ');
    return s;
  }

  setInterval(function () {
    if (!follow || busy) return;
    var s = sig(); if (!s || filled[s]) return;
    filled[s] = 1; busy = true;
    var f = follow;
    fillPage(f.p, f.miss).then(function () {
      busy = false;
      if (btn('submitButton')) { follow = null; ui(summary(f), f.miss.length ? 'err' : 'ok'); }
    });
  }, 600);

  async function run(day, vkSel, autoNext, isRetry) {
    if (busy) { ui('Masih mengisi, tunggu sebentar…'); return; }
    if (!onForm()) { ui('Form belum terbuka. Login akun Microsoft kantor dulu, lalu tekan hari lagi.', 'err'); return; }
    busy = true; lock(true); follow = null;
    var VK = Object.keys(CFG.content);
    var vk = vkSel && vkSel !== 'auto' && CFG.content[vkSel] ? vkSel : VK[(isoWeek(new Date()) - 1) % VK.length];
    var built = buildPlan(day, vk), miss = [];
    var info = { day: day, t: built.t, vk: vk, miss: miss, p: built.p };
    try {
      ui('Menunggu form siap…');
      if (!(await waitReady(isRetry ? 25000 : 5000))) {
        if (isRetry) ui('Form belum tampil. Tunggu sebentar, lalu tekan hari lagi.', 'err');
        else { ui('Memuat ulang form…'); reloadForm(day); }
        return;
      }
      var sb = startBtn();
      if (sb && !items().length) { sb.click(); await waitChange(''); }
      for (var g = 0; g < 10 && btn('backButton'); g++) {
        ui('Kembali ke halaman pertama…');
        var s0 = sig(); btn('backButton').click();
        if (!(await waitChange(s0))) break;
      }
      for (var pg = 1; pg <= 10; pg++) {
        ui('Mengisi halaman ' + pg + '…');
        await fillPage(built.p, miss);
        if (btn('submitButton')) { ui(summary(info), miss.length ? 'err' : 'ok'); return; }
        if (!autoNext) {
          filled = {}; filled[sig()] = 1; follow = info;
          ui('Halaman ' + pg + ' terisi (' + HARI[day] + ', variasi ' + vk + '). Unggah foto bila perlu, lalu tekan Next. Halaman berikutnya terisi otomatis.');
          return;
        }
        var nx = btn('nextButton');
        if (!nx) break;
        var s1 = sig(); nx.click();
        if (!(await waitChange(s1))) {
          ui('Berhenti di halaman ' + pg + ': ada isian yang belum valid. Cek tanda merah di form.' + (miss.length ? ' Tidak ditemukan: ' + miss.join(', ') : ''), 'err');
          return;
        }
      }
      ui(summary(info), miss.length ? 'err' : 'ok');
    } catch (e) {
      ui('Terjadi error: ' + (e && e.message ? e.message : e), 'err');
    } finally {
      busy = false; lock(false);
    }
  }

  window.DroneAF = {
    setConfig: function (saved) { CFG = window.droneMerge(saved); },
    run: run
  };
})();
