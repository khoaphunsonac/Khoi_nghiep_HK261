/* =========================================================
   app.js · MilkLoop pitch deck
   - Reveal.js 5.1.0 (offline) + GSAP 3.13 (SplitText, DrawSVG, ScrambleText)
   - CSS giữ trạng thái cuối; JS chỉ chạy hiệu ứng khi trình chiếu.
     In PDF (?print-pdf) hoặc prefers-reduced-motion: không chạy hiệu ứng.
   ========================================================= */
(function () {
  'use strict';
  const PRINT = /print-pdf/i.test(location.search);
  if (PRINT) document.documentElement.classList.add('print-pdf');
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION = !PRINT && !REDUCED && window.gsap;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const MAIN = 12;

  if (window.gsap) gsap.registerPlugin(SplitText, DrawSVGPlugin, ScrambleTextPlugin);

  /* ---------- định dạng số kiểu Việt Nam ---------- */
  function vn(x, d) {
    const s = Math.abs(x).toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
    return (x < 0 ? '−' : '') + s;
  }
  function countUp(el, delay) {
    const to = parseFloat(el.dataset.to), to2 = el.dataset.to2 ? parseFloat(el.dataset.to2) : null, d = parseInt(el.dataset.d || '0', 10);
    const fin = to2 !== null ? vn(to, d) + '–' + vn(to2, d) : vn(to, d);
    if (!MOTION) { el.textContent = fin; return; }
    const o = { v: 0, v2: 0 };
    gsap.to(o, { v: to, v2: to2 || 0, duration: 1.6, delay: delay || 0, ease: 'power3.out',
      onUpdate: () => { el.textContent = to2 !== null ? vn(o.v, d) + '–' + vn(o.v2, d) : vn(o.v, d); },
      onComplete: () => { el.textContent = fin; } });
  }

  /* ---------- biểu đồ tài chính (số từ Excel, sheet CF) ---------- */
  const FIN = { rev: [1400.7, 3302.7, 5344.8, 7432.3, 9489.4], cost: [2459.2, 3718.7, 5443.7, 6438.8, 7685.6], cf: [-1058.4, -416.0, -98.9, 993.5, 1803.8] };
  function buildFin() {
    const svg = $('#finChart'); if (!svg) return;
    const NS = 'http://www.w3.org/2000/svg', W = 560, H = 400, L = 54, R = 10, T = 16, B = 34;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const ymin = -2000, ymax = 10000, y = v => T + (ymax - v) / (ymax - ymin) * (H - T - B);
    const mk = (t, a, p) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); (p || svg).appendChild(n); return n; };
    const g = mk('g', { class: 'grid' });
    for (let v = -2000; v <= 10000; v += 2000) { mk('line', { x1: L, x2: W - R, y1: y(v), y2: y(v) }, g); const t = mk('text', { x: L - 8, y: y(v) + 4, class: 'yl' }); t.textContent = (v / 1000).toLocaleString('vi-VN') + ' tỷ'; }
    mk('line', { x1: L, x2: W - R, y1: y(0), y2: y(0), class: 'zero' });
    const cw = (W - L - R) / 5, bw = 30;
    const barsR = [], barsC = [], pts = [];
    FIN.rev.forEach((v, i) => {
      const cx = L + cw * i + cw / 2;
      barsR.push(mk('rect', { x: cx - bw - 2, y: y(v), width: bw, height: y(0) - y(v), rx: 6, class: 'bar-rev' }));
      barsC.push(mk('rect', { x: cx + 2, y: y(FIN.cost[i]), width: bw, height: y(0) - y(FIN.cost[i]), rx: 6, class: 'bar-cost' }));
      const t = mk('text', { x: cx, y: H - 10, class: 'ax' }); t.textContent = 'Năm ' + (i + 1);
      pts.push([cx, y(FIN.cf[i])]);
    });
    const line = mk('path', { d: 'M' + pts.map(p => p.join(' ')).join(' L'), class: 'cfl' });
    const dots = pts.map((p, i) => mk('circle', { cx: p[0], cy: p[1], r: 6, class: 'cfp' + (FIN.cf[i] < 0 ? ' neg' : '') }));
    const labels = pts.map((p, i) => { const t = mk('text', { x: p[0], y: p[1] + (FIN.cf[i] < 0 ? 24 : -14), class: 'vl' + (FIN.cf[i] < 0 ? ' neg' : '') }); t.textContent = vn(FIN.cf[i], 0); return t; });
    svg._parts = { barsR, barsC, line, dots, labels };
  }

  /* ---------- hiệu ứng vào slide ---------- */
  let tl = null, splits = [];
  function cleanup() {
    if (tl) { tl.revert(); tl = null; }
    splits.forEach(s => s.revert()); splits = [];
  }
  let lastSec = null, lastAt = 0;
  function enter(sec, delay) {
    const now = performance.now();
    if (sec === lastSec && now - lastAt < 400) return;   // Reveal có thể báo hai lần khi mở bằng link #/n
    lastSec = sec; lastAt = now;
    document.body.dataset.theme = sec.dataset.theme || 'orange';
    document.body.classList.toggle('on-title', sec.id === 's-title');
    if (!MOTION) { $$('.count', sec).filter(c => !c.closest('.fragment')).forEach(c => countUp(c)); return; }
    cleanup();
    tl = gsap.timeline({ delay: delay || 0, defaults: { ease: 'expo.out', duration: .9 } });
    const k = $('.kicker', sec); if (k) tl.from(k, { x: -30, opacity: 0, duration: .6 }, 0);
    $$('.split-words', sec).forEach(h => {
      const s = new SplitText(h, { type: 'words,lines', mask: 'lines' }); splits.push(s);
      tl.from(s.words, { yPercent: 120, rotate: 6, opacity: 0, stagger: .045, duration: .9 }, .05);
    });
    $$('.split-chars', sec).forEach(h => {
      const s = new SplitText(h, { type: 'chars' }); splits.push(s);
      tl.from(s.chars, { y: 140, rotationX: -100, opacity: 0, transformPerspective: 600, transformOrigin: '50% 100%', stagger: .05, duration: 1.1, ease: 'back.out(1.8)' }, .05);
    });
    $$('.scramble', sec).forEach(e => { e.textContent = ' '; tl.to(e, { duration: 1.6, scrambleText: { text: e.dataset.text, chars: 'ĂÂĐÊÔƠƯabcxyz01', revealDelay: .4, speed: .5 } }, .5); });
    const ups = $$('[data-anim="fade-up"]', sec).filter(e => !e.closest('.fragment'));
    if (ups.length) tl.from(ups, { y: 36, opacity: 0, stagger: .1, clearProps: 'transform' }, .35);
    const pops = $$('[data-anim="pop"]', sec);
    if (pops.length) tl.from(pops, { scale: .5, opacity: 0, stagger: .09, ease: 'back.out(1.7)', transformOrigin: '50% 50%', clearProps: 'transform' }, .3);
    const sl = $$('[data-anim="slide-r"]', sec); if (sl.length) tl.from(sl, { x: -120, rotation: -8, opacity: 0, duration: 1, ease: 'back.out(1.4)', clearProps: 'transform' }, .25);
    const sr = $$('[data-anim="slide-l"]', sec); if (sr.length) tl.from(sr, { x: 140, rotation: 8, opacity: 0, duration: 1, ease: 'back.out(1.4)', clearProps: 'transform' }, .35);
    const dp = $$('[data-anim="drop"]', sec); if (dp.length) tl.from(dp, { y: -420, rotation: -20, duration: 1.3, ease: 'bounce.out', clearProps: 'transform' }, .15);
    const fl = $$('[data-anim="flip"]', sec); if (fl.length) tl.from(fl, { rotationY: -95, opacity: 0, transformPerspective: 900, transformOrigin: '0% 50%', stagger: .06, duration: .8, clearProps: 'transform' }, .3);
    $$('[data-anim="stagger"]', sec).forEach(p => tl.from(p.children, { y: 18, opacity: 0, stagger: .05, duration: .6 }, .6));
    const dr = $$('path.draw', sec); if (dr.length) tl.from(dr, { drawSVG: 0, duration: 1.4, stagger: .15, ease: 'power2.inOut' }, .4);
    const da = $$('path.dash, .arrowhead', sec); if (da.length) tl.from(da, { opacity: 0, duration: .8, stagger: .1 }, .6);
    $$('.count', sec).filter(c => !c.closest('.fragment')).forEach(c => countUp(c, (delay || 0) + .5));
    special(sec);
  }
  function special(sec) {
    switch (sec.id) {
      case 's-title':
        tl.from($('.marquee', sec), { yPercent: 200, duration: 1 }, .6)
          .from($('.brand', sec), { textShadow: '0px 0px 0 #FF5A1F', duration: .8, ease: 'power2.out' }, 1.1);
        break;
      case 's-company':
        tl.from($$('.fnode img, .fill img', sec), { scale: 0, rotation: () => gsap.utils.random(-30, 30), stagger: .12, ease: 'back.out(2)', duration: .8, clearProps: 'transform' }, .4);
        break;
      case 's-problem':
        tl.from($$('.pb-fill', sec), { scaleX: 0, transformOrigin: '0 50%', stagger: .25, duration: 1.3, ease: 'power3.out' }, .6)
          .from($$('.pains .ic', sec), { scale: 0, rotation: -90, stagger: .12, ease: 'back.out(3)' }, .9);
        break;
      case 's-solution':
        tl.from($('.burst', sec), { scale: 0, rotation: -180, duration: 1.2, ease: 'back.out(1.6)' }, .2)
          .from($$('.feats .ic', sec), { scale: 0, rotation: -90, stagger: .1, ease: 'back.out(3)' }, .7);
        break;
      case 's-market':
        tl.from($$('.spark .pts circle', sec), { scale: 0, transformOrigin: '50% 50%', stagger: .12, ease: 'back.out(3)' }, 1)
          .from($$('.spark .lb', sec), { opacity: 0, y: 8, duration: .6 }, 1.5);
        break;
      case 's-customers':
        tl.from($$('.j-step .art', sec), { y: 60, opacity: 0, stagger: .15, ease: 'back.out(1.6)' }, .5)
          .from($$('.j-n', sec), { scale: 0, stagger: .15, ease: 'back.out(3)' }, .9)
          .from($$('.chips span', sec), { y: 14, opacity: 0, rotation: () => gsap.utils.random(-12, 12), stagger: .06, ease: 'back.out(2)' }, 1);
        break;
      case 's-compete':
        tl.from($$('.dot', sec), { scale: 0, opacity: 0, stagger: { each: .1, from: 'random' }, ease: 'back.out(2.5)', duration: .7 }, .5)
          .from($$('.meter', sec), { scaleX: 0, transformOrigin: '0 50%', stagger: .1, duration: 1 }, .7)
          .from($('.gap-zone', sec), { scale: .4, opacity: 0, rotation: -6, duration: .9, ease: 'back.out(2)' }, .4);
        break;
      case 's-milestones':
        tl.from($$('.ms i', sec), { scale: 0, stagger: .14, ease: 'back.out(3)' }, .9)
          .from($('.ms.now .flag', sec), { scaleY: 0, transformOrigin: '50% 100%', duration: .6, ease: 'back.out(2)' }, .8)
          .from($$('.ms b, .ms span, .ms em', sec), { y: 14, opacity: 0, stagger: .03, duration: .5 }, 1);
        break;
      case 's-finance': {
        const p = $('#finChart')._parts; if (!p) break;
        tl.from(p.barsR, { scaleY: 0, transformOrigin: '50% 100%', stagger: .12, duration: 1, ease: 'power3.out' }, .5)
          .from(p.barsC, { scaleY: 0, transformOrigin: '50% 100%', stagger: .12, duration: 1, ease: 'power3.out' }, .65)
          .from(p.line, { drawSVG: 0, duration: 1.2, ease: 'power2.inOut' }, 1.4)
          .from(p.dots, { scale: 0, transformOrigin: '50% 50%', stagger: .1, ease: 'back.out(3)' }, 1.6)
          .from(p.labels, { opacity: 0, y: 8, stagger: .08 }, 1.8);
        break;
      }
      case 's-team':
        tl.from($$('.fcard', sec), { y: 260, rotation: () => gsap.utils.random(-24, 24), opacity: 0, stagger: .1, duration: 1.1, ease: 'back.out(1.4)', clearProps: 'transform' }, .3);
        break;
      case 's-cta':
        tl.from($$('.stack i', sec), { scaleX: 0, transformOrigin: '0 50%', stagger: .15, duration: .9 }, .9)
          .from($('.ask-eq', sec), { scale: .8, opacity: 0, ease: 'back.out(2)' }, 1.1);
        break;
      default: break;
    }
  }

  /* ---------- hình minh họa nhích theo chuột (parallax nhẹ) ---------- */
  if (MOTION) {
    let raf = 0;
    addEventListener('pointermove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const dx = e.clientX / innerWidth - .5, dy = e.clientY / innerHeight - .5;
        const cur = Reveal.getCurrentSlide && Reveal.getCurrentSlide(); if (!cur) return;
        $$('.art, .doodle, .art-in', cur).forEach((im, i) => gsap.to(im, { x: dx * (14 + i * 4), y: dy * (10 + i * 3), duration: .8, ease: 'power2.out', overwrite: 'auto' }));
      });
    }, { passive: true });
  }

  /* ---------- minh chứng và thuật ngữ ---------- */
  const dlg = $('#evDlg');
  function openDlg(kind, title, html) {
    $('#evKind').textContent = kind; $('#evTitle').textContent = title; $('#evBody').innerHTML = html;
    Reveal.configure({ keyboard: false });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    if (MOTION) gsap.fromTo(dlg, { scale: .85, rotation: -2, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: .45, ease: 'back.out(1.8)' });
  }
  function closeDlg() { if (dlg.open) dlg.close(); }
  if (dlg) {
    dlg.addEventListener('close', () => Reveal.configure({ keyboard: true }));
    dlg.addEventListener('click', e => { if (e.target === dlg) closeDlg(); });
    $('.ev-close', dlg).addEventListener('click', closeDlg);
  }
  $$('.ev').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); const d = (window.MILK_EV || {})[b.dataset.ev]; if (!d) return;
    let html = d.b || '';
    if (d.img) html += `<img src="${d.img}" alt="Ảnh bảng Excel minh chứng" class="ev-img">`;
    if (d.img2) html += `<img src="${d.img2}" alt="Ảnh bảng Excel minh chứng" class="ev-img">`;
    if (d.s) html += `<p class="ev-src">Nguồn: ${d.s}</p>`;
    openDlg('Minh chứng số liệu', d.t, html);
  }));
  $$('.term').forEach(t => {
    const d = (window.MILK_TERMS || {})[t.dataset.term]; if (!d) return;
    t.setAttribute('data-def', d[1]); t.setAttribute('role', 'button'); t.setAttribute('aria-label', d[0] + ': ' + d[1]);
    const open = e => { e.stopPropagation(); openDlg('Thuật ngữ', d[0], `<p class="ev-lead">${d[1]}</p><p>${d[2]}</p>`); };
    t.addEventListener('click', open);
    t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(e); } });
  });

  /* ---------- khung chung ---------- */
  function chrome(sec) {
    const n = parseInt(sec.dataset.n || '1', 10);
    $('#pg').textContent = n <= MAIN ? String(n).padStart(2, '0') : (n === 13 ? 'Q&A' : 'D' + (n - 13));
    $('#pgt').textContent = String(MAIN);
    $('#prog').style.width = Math.min(100, n / MAIN * 100) + '%';
  }
  function wipe() {
    if (!MOTION) return;
    const w = $('.wipe'); w.classList.remove('go'); void w.offsetWidth; w.classList.add('go');
  }

  /* ---------- khởi động ---------- */
  buildFin();
  Reveal.initialize({
    width: 1280, height: 720, margin: 0, minScale: .2, maxScale: 2,
    hash: true, center: false, controls: false, controlsTutorial: false, progress: false, slideNumber: false,
    transition: 'fade', transitionSpeed: 'fast', backgroundTransition: 'none',
    pdfSeparateFragments: false, pdfMaxPagesPerSlide: 1,
    plugins: window.RevealNotes ? [RevealNotes] : []
  }).then(() => {
    const cur = Reveal.getCurrentSlide();
    chrome(cur); enter(cur, .2);
  });
  Reveal.on('slidechanged', e => { chrome(e.currentSlide); wipe(); enter(e.currentSlide, MOTION ? .3 : 0); });
  Reveal.on('fragmentshown', e => {
    const f = e.fragment;
    $$('.count', f).forEach(c => countUp(c, .1));
    if (MOTION) gsap.from(f, { scale: .92, duration: .6, ease: 'back.out(2)', clearProps: 'transform' });
  });
})();
