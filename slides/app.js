/* =========================================================
   app.js · Seminar 3.1 Phân tích tài chính
   - Khung slide (logo, footer, số slide, mục lục phần)
   - Chuyển trang kiểu Morph bằng View Transitions API
   - Component Spider UI viết lại bằng JS thuần
   - Biểu đồ SVG vẽ từ số liệu báo cáo nhóm / bài giảng
   ========================================================= */
(function () {
  'use strict';

  const PRINT = /print-pdf/i.test(window.location.search);
  if (PRINT) document.documentElement.classList.add('print-pdf');
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const C = {
    bk: '#032B91', bk2: '#1488DB', tint: '#E7EEFB', tint2: '#D3E1F7', ink: '#0A1A3F', ink2: '#39476A', ink3: '#5A6787',
    line: '#D8E0EE', pos: '#04785A', posT: '#E3F4EE', neg: '#B42318', negT: '#FBE9E7', cheese: '#C98A0B', cheeseT: '#FBF1DA', paper: '#F5F7FC'
  };

  /* ---------- tiện ích ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = (x, d = 0) => (Math.abs(x) < 1e-9 ? 0 : x).toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
  function el(tag, attrs, parent, text) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) {
      if (tag === 'text' && /_T/.test(text)) {
        text.split(/(_T)/).forEach(part => {
          if (part === '_T') { const t = document.createElementNS(NS, 'tspan'); t.setAttribute('baseline-shift', 'sub'); t.setAttribute('font-size', '75%'); t.textContent = 'T'; n.appendChild(t); }
          else if (part) n.appendChild(document.createTextNode(part));
        });
      } else n.textContent = text;
    }
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ---------- số liệu ---------- */
  const D = {
    cf: [300, 726, 1300.6, 1899.4, 2370.6],
    inv: 1200, r: 0.12, g: 0.05,
    cum: [-1200, -900, -174, 1126.6, 3026.0, 5396.6],
    rev: [3000, 3750, 4687.5, 5625, 6468.7],
    cost: [2700, 3024, 3386.9, 3725.6, 4098.1],
    gpCheese: [1440000, 1152000, 921600, 737280, 589824, 471859],
    gpWhey: [7140000, 5712000, 4569600, 3655680, 2924544, 2339635],
    pvf: [1, 0.8696, 0.7561, 0.6575, 0.5718, 0.4972],
    lecFlows: [-500, -160, 24, 266.4, 437, 7691.9],
    lecCum: [-500, -660, -636, -369.6, 67.4]
  };
  function npvOps(r) { let v = -D.inv; D.cf.forEach((c, i) => { v += c / Math.pow(1 + r, i + 1); }); return v; }
  function pvCft(r) { const cft = D.cf[4] * (1 + D.g) / (r - D.g); return cft / Math.pow(1 + r, 5); }
  function npvFlows(fl, r) { return fl.reduce((s, c, t) => s + c / Math.pow(1 + r, t), 0); }

  /* =========================================================
     1. KHUNG SLIDE
     ========================================================= */
  const sections = $$('.reveal .slides > section');
  const total = sections.length;
  const REFS = { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' };

  sections.forEach((s, i) => {
    s.dataset.n = String(i + 1).padStart(2, '0');
    if (s.classList.contains('s-cover')) return;
    const logo = document.createElement('img');
    logo.className = 's-logo'; logo.src = 'assets/img/logo-bk.png'; logo.alt = '';
    s.appendChild(logo);
    const src = (s.dataset.src || '').split(',').filter(Boolean).map(k => '[' + REFS[k.trim()] + ']').join(', ');
    const f = document.createElement('div');
    f.className = 's-foot';
    f.innerHTML = '<span class="f-school">Trường Đại học Bách Khoa, ĐHQG-HCM</span>' +
      '<span class="f-part">' + (s.dataset.part || '') + '</span>' +
      '<span class="f-src">' + (src ? 'Nguồn ' + src : '') + '</span>' +
      '<span class="f-n">' + s.dataset.n + ' / ' + total + '</span>';
    s.appendChild(f);
  });

  // Mục lục của slide chia phần: các slide tới phần kế tiếp
  sections.forEach((s, i) => {
    if (!s.dataset.divider) return;
    const ol = $('.d-list', s);
    for (let j = i + 1; j < sections.length; j++) {
      const t = sections[j];
      if (t.dataset.divider || !t.dataset.part || t.dataset.part.indexOf('Phần') !== 0) break;
      const h = $('.s-title', t);
      const li = document.createElement('li');
      li.innerHTML = '<b>' + t.dataset.n + '</b><span>' + (h ? h.textContent : '') + '</span>';
      ol.appendChild(li);
    }
    // họa tiết khối lục giác theo logo
    const svg = el('svg', { class: 'hexes', viewBox: '0 0 760 200', 'aria-hidden': 'true' });
    hexField(svg, 760, 200, 34, true);
    s.insertBefore(svg, s.firstChild);
  });

  /* họa tiết khối lập phương isometric giống logo */
  function hexField(svg, W, H, R, mono) {
    const w = Math.sqrt(3) * R;
    let k = 0;
    for (let row = -1; row * 1.5 * R < H + R; row++) {
      for (let col = -1; col * w < W + w; col++) {
        const cx = col * w + (row % 2 ? w / 2 : 0), cy = row * 1.5 * R;
        const p = a => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
        const top = [p(-Math.PI / 2), p(-Math.PI / 6), [cx, cy], p(-5 * Math.PI / 6)];
        const left = [p(-5 * Math.PI / 6), [cx, cy], p(Math.PI / 2), p(5 * Math.PI / 6)];
        const right = [[cx, cy], p(-Math.PI / 6), p(Math.PI / 6), p(Math.PI / 2)];
        const h = (Math.sin(row * 12.9898 + col * 78.233) * 43758.5453) % 1;
        const r = Math.abs(h);
        const shades = mono ? ['#FFFFFF', '#9FC3F2', '#1488DB'] :
          (r > 0.82 ? [C.bk2, C.bk, '#021E66'] : r > 0.64 ? ['#FFFFFF', C.bk2, C.bk] : [C.paper, C.tint, C.tint2]);
        [[top, shades[0]], [left, shades[1]], [right, shades[2]]].forEach(([pts, fill]) => {
          el('path', { d: 'M' + pts.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L') + 'Z', fill, stroke: mono ? 'none' : C.paper, 'stroke-width': mono ? 0 : 1, opacity: mono ? (0.25 + r * 0.75).toFixed(2) : 1 }, svg);
        });
        k++;
      }
    }
  }
  const cvHex = $('#cvHex');
  if (cvHex) hexField(cvHex, 470, 552, 46, false);

  /* =========================================================
     2. COMPONENTS (Spider UI → vanilla)
     ========================================================= */

  // Progressive Blur
  $$('[data-pblur]').forEach(box => {
    const levels = [0.5, 1, 2, 4, 8, 16, 32];
    const edge = box.dataset.pblur;
    const bg = document.createElement('div');
    bg.style.background = 'linear-gradient(to ' + edge + ', transparent, ' + C.paper + ')';
    box.appendChild(bg);
    levels.forEach((b, i) => {
      const d = document.createElement('div');
      const prev = levels[i - 1] || 0, step = 100 / levels.length;
      const m = 'linear-gradient(to ' + edge + ', transparent ' + Math.max(0, (i - 1) * step) + '%, black ' + Math.min(100, (i + 1) * step) + '%)';
      d.style.backdropFilter = d.style.webkitBackdropFilter = 'blur(' + Math.max(0, b - prev) + 'px)';
      d.style.maskImage = d.style.webkitMaskImage = m;
      box.appendChild(d);
    });
  });

  // Text Roll
  const rolls = $$('[data-roll]').map(host => {
    const items = host.dataset.roll.split('|');
    items.forEach(t => { const g = document.createElement('span'); g.className = 'ghost'; g.textContent = t; host.appendChild(g); });
    const nodes = items.map((t, i) => { const s = document.createElement('span'); s.className = 'it' + (i === 0 ? ' on' : ''); s.textContent = t; s.setAttribute('aria-hidden', 'true'); host.appendChild(s); return s; });
    let idx = 0, timer = null;
    return {
      host,
      start() { if (PRINT || REDUCED || timer) return; timer = setInterval(() => { nodes[idx].classList.remove('on'); nodes[idx].classList.add('out'); const o = nodes[idx]; setTimeout(() => o.classList.remove('out'), 460); idx = (idx + 1) % nodes.length; nodes[idx].classList.add('on'); }, 1600); },
      stop() { clearInterval(timer); timer = null; }
    };
  });

  // Wave Text
  $$('[data-wave]').forEach(h => {
    const words = h.textContent.split(' ');
    h.textContent = '';
    let i = 0;
    words.forEach((w, wi) => {
      const ww = document.createElement('span'); ww.style.whiteSpace = 'nowrap'; ww.style.display = 'inline-block';
      [...w].forEach(ch => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i++); s.textContent = ch; ww.appendChild(s); });
      h.appendChild(ww);
      if (wi < words.length - 1) h.appendChild(document.createTextNode(' '));
    });
  });

  // Dia Text Reveal: một dải màu BK quét qua rồi trả về màu chữ thường
  function diaRun(n) {
    if (PRINT || REDUCED) return;
    const colors = ['#7FB8F0', '#FFFFFF', '#1488DB', '#9FC3F2'], half = 17, text = '#C9D8F5';
    const t0 = performance.now(), dur = 1500;
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    n.style.color = 'transparent';
    function frame(now) {
      const p = Math.min(1, (now - t0) / dur), pos = -half + ease(p) * (100 + 2 * half);
      const a = pos - half, stops = [];
      if (a > 0) stops.push(text + ' 0%', text + ' ' + a.toFixed(1) + '%');
      colors.forEach((c, i) => stops.push(c + ' ' + (a + i / (colors.length - 1) * half * 2).toFixed(1) + '%'));
      if (pos + half < 100) stops.push('rgba(201,216,245,0) ' + (pos + half).toFixed(1) + '%', 'rgba(201,216,245,0) 100%');
      n.style.backgroundImage = 'linear-gradient(90deg,' + stops.join(',') + ')';
      if (p < 1) requestAnimationFrame(frame); else { n.style.backgroundImage = 'none'; n.style.color = ''; }
    }
    requestAnimationFrame(frame);
  }

  // Scramble / Encrypted Text cho con số
  function scramble(n) {
    const final = n.dataset.scramble;
    if (PRINT || REDUCED) { n.textContent = final; return; }
    const t0 = performance.now(), dur = 900;
    function frame(now) {
      const p = Math.min(1, (now - t0) / dur), keep = Math.floor(p * final.length);
      n.textContent = [...final].map((ch, i) => (i < keep || !/\d/.test(ch)) ? ch : String(Math.floor(Math.random() * 10))).join('');
      if (p < 1) requestAnimationFrame(frame); else n.textContent = final;
    }
    requestAnimationFrame(frame);
  }

  // Accordion Reveal (fragment + hover)
  $$('[data-acc]').forEach(acc => {
    const rows = $$('[data-acc-row]', acc);
    acc._state = -1;
    acc._set = k => { rows.forEach((r, i) => r.classList.toggle('on', i === k)); acc.classList.toggle('has-on', k >= 0); };
    rows.forEach((r, i) => {
      r.addEventListener('mouseenter', () => acc._set(i));
      r.addEventListener('mouseleave', () => acc._set(acc._state));
    });
    if (PRINT) rows.forEach(r => r.classList.add('on'));
  });

  // Fan Cards
  $$('[data-fan]').forEach(fan => {
    const cards = $$('.fcard', fan);
    const X = [-375, -125, 125, 375], R = [-7, -2.5, 2.5, 7], Y = [22, 4, 4, 22];
    fan._sel = -1;
    fan._set = k => {
      fan._sel = k;
      cards.forEach((c, i) => {
        const on = i === k;
        c.style.zIndex = on ? 10 : i + 1;
        c.style.transform = 'translate(' + X[i] + 'px,' + (on ? -18 : Y[i]) + 'px) rotate(' + (on ? 0 : R[i]) + 'deg) scale(' + (on ? 1.07 : (k >= 0 ? 0.97 : 1)) + ')';
        c.style.boxShadow = on ? '0 18px 40px rgba(10,26,63,.22)' : '';
      });
    };
    cards.forEach((c, i) => c.addEventListener('click', () => fan._set(fan._sel === i ? -1 : i)));
    fan._set(-1);
  });

  // Discrete Tabs
  $$('[data-tabs]').forEach(list => {
    const tabs = $$('.dtab', list);
    const pick = t => {
      tabs.forEach(x => { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); x.tabIndex = x === t ? 0 : -1; });
      if (list.dataset.tabs === 'ltv') drawLtvBars(t.dataset.v);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => pick(t));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.stopPropagation(); const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); pick(n); }
      });
    });
  });

  // Switch
  $$('[data-switch]').forEach(sw => {
    sw.addEventListener('click', () => {
      const on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      if (sw.dataset.switch === 'cft') drawCfBars(on);
    });
  });

  // Toggle group
  $$('[data-toggle-group]').forEach(g => {
    const btns = $$('.toggle', g);
    btns.forEach(b => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      btns.forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      const slide = g.closest('section');
      const v = on ? b.dataset.v : '';
      slide.dataset.focus = v;
      drawAdopt($('#adopt2'), 'split', v);
    }));
  });

  // Stepper
  const STEPS = ['Nhận diện', 'Gán giá trị', 'Dòng tiền', 'Chỉ tiêu', 'Đánh giá'];
  function renderStepper(host, cur) {
    host.innerHTML = '';
    STEPS.forEach((s, i) => {
      const k = i + 1;
      const st = document.createElement('div');
      st.className = 'step' + (k < cur ? ' done' : '') + (k === cur ? ' cur' : '');
      st.innerHTML = '<span class="dot"><b>' + k + '</b><svg class="ic"><use href="#i-check"/></svg></span><span class="sl">' + s + '</span>';
      host.appendChild(st);
      if (i < STEPS.length - 1) { const r = document.createElement('div'); r.className = 'rail' + (k < cur ? ' done' : ''); host.appendChild(r); }
    });
  }
  $$('[data-stepper]').forEach(h => renderStepper(h, PRINT && h.dataset.stepper === '0' ? 5 : +h.dataset.stepper));

  // Card Stroke
  $$('[data-cstroke]').forEach(card => {
    const svg = el('svg', { class: 'strk', viewBox: '0 0 400 300', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    const d = 'M-20 250 C 60 180, 120 300, 190 210 S 300 60, 420 120';
    const d2 = 'M-30 60 C 80 10, 140 140, 230 90 S 350 -10, 430 40';
    [[d, C.bk2, 0.35], [d2, '#5C8FE6', 0.22]].forEach(([p, c, o]) => {
      const path = el('path', { d: p, stroke: c, 'stroke-width': 24, opacity: o }, svg);
      path.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.65,0,.35,1), stroke-width 1.5s cubic-bezier(.65,0,.35,1)';
    });
    card.insertBefore(svg, card.firstChild);
    requestAnimationFrame(() => $$('path', svg).forEach(p => {
      const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = PRINT ? 0 : L;
      if (PRINT) p.setAttribute('stroke-width', 90);
    }));
    card._on = on => { card.classList.toggle('on', on); $$('path', svg).forEach(p => { p.style.strokeDashoffset = on ? 0 : p.getTotalLength(); p.setAttribute('stroke-width', on ? 90 : 24); }); };
    if (PRINT) card.classList.add('on');
  });

  // Modal + Drawer
  let openLayer = null;
  function openLayerFn(id) {
    const box = document.getElementById(id), ov = $('[data-overlay="' + id + '"]');
    if (!box) return;
    box.classList.add('open'); ov && ov.classList.add('open'); openLayer = id;
    if (window.Reveal && Reveal.isReady()) Reveal.configure({ keyboard: false });
    const x = $('[data-close]', box); x && x.focus();
  }
  function closeLayer() {
    if (!openLayer) return;
    const box = document.getElementById(openLayer), ov = $('[data-overlay="' + openLayer + '"]');
    box.classList.remove('open'); ov && ov.classList.remove('open');
    const opener = $('[data-open="' + openLayer + '"]'); openLayer = null;
    if (window.Reveal) Reveal.configure({ keyboard: true });
    opener && opener.focus();
  }
  $$('[data-open]').forEach(b => b.addEventListener('click', () => openLayerFn(b.dataset.open)));
  $$('[data-close]').forEach(b => b.addEventListener('click', closeLayer));
  $$('[data-overlay]').forEach(o => o.addEventListener('click', closeLayer));
  document.addEventListener('keydown', e => { if (openLayer && e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); closeLayer(); } }, true);

  // Elastic Slider
  $$('[data-eslider]').forEach(sl => {
    const min = +sl.dataset.min, max = +sl.dataset.max, step = +sl.dataset.step;
    let val = +sl.dataset.val;
    const fill = $('.fill', sl), knob = $('.knob', sl), out = $('.val', sl), ticks = $('.ticks', sl);
    for (let v = min; v <= max; v += 1) { const t = document.createElement('i'); t.style.left = ((v - min) / (max - min) * 100) + '%'; ticks.appendChild(t); }
    sl.tabIndex = 0; sl.setAttribute('role', 'slider'); sl.setAttribute('aria-label', 'Suất chiết khấu r'); sl.setAttribute('aria-valuemin', min); sl.setAttribute('aria-valuemax', max);
    const render = () => {
      const p = (val - min) / (max - min) * 100;
      fill.style.width = p + '%'; knob.style.left = p + '%';
      out.textContent = fmt(val, 1) + '%'; sl.setAttribute('aria-valuenow', val);
      drawNpvComp(val / 100);
    };
    const setFromX = x => {
      const b = sl.getBoundingClientRect(), raw = (x - b.left) / b.width;
      const over = raw < 0 ? raw : raw > 1 ? raw - 1 : 0;
      sl.style.transform = over ? 'scaleX(' + (1 + Math.min(0.06, Math.abs(over) * 0.25)) + ')' : '';
      sl.style.transformOrigin = over < 0 ? 'right center' : 'left center';
      val = Math.round((min + Math.min(1, Math.max(0, raw)) * (max - min)) / step) * step;
      render();
    };
    let drag = false;
    sl.addEventListener('pointerdown', e => { drag = true; sl.setPointerCapture(e.pointerId); setFromX(e.clientX); });
    sl.addEventListener('pointermove', e => { if (drag) setFromX(e.clientX); });
    const end = () => { drag = false; sl.style.transform = ''; };
    sl.addEventListener('pointerup', end); sl.addEventListener('pointercancel', end);
    sl.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.stopPropagation(); e.preventDefault(); val = Math.min(max, Math.max(min, val + (e.key === 'ArrowRight' ? step : -step))); render(); }
    });
    sl._render = render;
  });

  /* =========================================================
     3. BIỂU ĐỒ
     ========================================================= */
  const charts = {};
  $$('[data-chart]').forEach(svg => { (charts[svg.dataset.chart] = charts[svg.dataset.chart] || []).push(svg); });
  const vb = svg => svg.viewBox.baseVal;
  const clear = svg => { while (svg.firstChild) svg.removeChild(svg.firstChild); };

  // Đường cong chấp nhận sản phẩm
  function drawAdopt(svg, mode, focus) {
    if (!svg) return;
    clear(svg);
    const W = vb(svg).width, H = vb(svg).height, base = H - (mode === 'all' ? 46 : 34), top = 10;
    const x = z => 40 + (z + 3) / 6 * (W - 80);
    const y = z => base - Math.exp(-z * z / 2) * (base - top);
    const cuts = [-3, -2, -1, 0, 1, 3];
    const names = ['Tín đồ công nghệ', 'Người tiếp nhận sớm', 'Số đông chấp nhận sớm', 'Số đông chấp nhận trễ', 'Người “bảo thủ”'];
    const allFill = [C.bk, '#1C4FC8', C.bk2, '#7FB8F0', C.tint2];
    for (let s = 0; s < 5; s++) {
      let d = 'M' + x(cuts[s]) + ' ' + base;
      for (let z = cuts[s]; z <= cuts[s + 1] + 1e-9; z += 0.05) d += 'L' + x(z).toFixed(1) + ' ' + y(z).toFixed(1);
      d += 'L' + x(cuts[s + 1]) + ' ' + base + 'Z';
      let fill = allFill[s], op = 1;
      if (mode === 'split') {
        fill = s <= 1 ? C.bk : s <= 3 ? C.bk2 : C.tint2;
        if (focus === 'early' && s > 1) op = 0.25;
        if (focus === 'late' && s <= 1) op = 0.25;
      }
      const p = el('path', { d, fill, stroke: '#fff', 'stroke-width': 2, opacity: op }, svg);
      p.style.transition = 'opacity .4s';
    }
    el('line', { x1: 30, x2: W - 30, y1: base, y2: base, class: 'ax0' }, svg);
    if (mode === 'all') {
      names.forEach((n, s) => {
        const cx = (x(cuts[s]) + x(cuts[s + 1])) / 2;
        el('text', { x: cx, y: base + 24, 'text-anchor': 'middle', class: 'lb' }, svg, n);
      });
      el('text', { x: W - 34, y: base + 42, 'text-anchor': 'end', class: 'tk' }, svg, 'thời gian chấp nhận sản phẩm →');
    } else {
      const lab = (a, b, t, c) => {
        el('line', { x1: x(a) + 4, x2: x(b) - 4, y1: base + 14, y2: base + 14, stroke: c, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
        el('text', { x: (x(a) + x(b)) / 2, y: base + 30, 'text-anchor': 'middle', class: 'lb', fill: c }, svg, t);
      };
      lab(-3, -1, 'Khách hàng đến sớm', C.bk);
      lab(-1, 1, 'Khách hàng đến sau', C.bk2);
    }
  }
  (charts.adopt || []).forEach(s => drawAdopt(s, s.dataset.mode));

  // Giá quy đổi theo kg
  (charts.perkg || []).forEach(svg => {
    const rows = [['Lẻ niêm yết', 480000, '120.000 ₫ × 4 hộp'], ['Đến sớm −20%', 384000, '96.000 ₫ × 4'], ['Thuê bao', 380000, '95.000 ₫ × 4'], ['B2B 5–19 kg', 320000, 'giá sỉ'], ['B2B từ 20 kg', 280000, 'chiết khấu số lượng']];
    const x0 = 150, W = 640 - x0 - 90, max = 500000;
    rows.forEach((r, i) => {
      const yy = 14 + i * 56, w = r[1] / max * W;
      el('text', { x: 0, y: yy + 22, class: 'lb' }, svg, r[0]);
      el('text', { x: 0, y: yy + 39, class: 'tk' }, svg, r[2]);
      const b = el('rect', { x: x0, y: yy + 6, width: w.toFixed(1), height: 30, rx: 6, fill: i < 3 ? C.bk : C.bk2, class: 'bar-grow' }, svg);
      b.style.transformOrigin = '0 50%'; b.style.setProperty('--i', i);
      el('text', { x: x0 + w + 8, y: yy + 27, class: 'vl' }, svg, fmt(r[1] / 1000) + 'k');
    });
  });

  // Khoảng giá whey
  (charts.wheyrange || []).forEach(svg => {
    const W = 1168, x0 = 20, x1 = W - 20, lo = 700000, hi = 1300000;
    const X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
    el('line', { x1: x0, x2: x1, y1: 70, y2: 70, class: 'ax0' }, svg);
    for (let v = lo; v <= hi; v += 100000) {
      el('line', { x1: X(v), x2: X(v), y1: 66, y2: 74, class: 'ax0' }, svg);
      el('text', { x: X(v), y: 108, 'text-anchor': 'middle', class: 'tk' }, svg, fmt(v / 1000));
    }
    el('rect', { x: X(900000), y: 56, width: X(1200000) - X(900000), height: 28, rx: 8, fill: C.tint2 }, svg);
    el('text', { x: (X(900000) + X(1200000)) / 2, y: 40, 'text-anchor': 'middle', class: 'lb' }, svg, 'Whey nhập khẩu 900.000 – 1.200.000 ₫/kg');
    el('circle', { cx: X(850000), cy: 70, r: 10, fill: C.bk, stroke: '#fff', 'stroke-width': 3 }, svg);
    el('text', { x: X(850000), y: 40, 'text-anchor': 'middle', class: 'vl', fill: C.bk }, svg, 'Giá neo của dự án 850.000 ₫ / hũ 1 kg');
    el('text', { x: x1, y: 128, 'text-anchor': 'end', class: 'tk' }, svg, 'nghìn ₫ / kg');
  });

  // Hệ số chiết khấu
  (charts.discount || []).forEach(svg => {
    const H = 330, base = 290, bw = 66, gap = 34, x0 = 40;
    el('line', { x1: x0 - 10, x2: 630, y1: base, y2: base, class: 'ax0' }, svg);
    for (let t = 0; t <= 5; t++) {
      const v = 1 / Math.pow(1.15, t), h = v * 240, xx = x0 + t * (bw + gap);
      el('rect', { x: xx, y: base - 240, width: bw, height: 240, rx: 6, fill: C.tint }, svg);
      const b = el('rect', { x: xx, y: base - h, width: bw, height: h, rx: 6, fill: C.bk, class: 'bar-grow' }, svg); b.style.setProperty('--i', t);
      el('text', { x: xx + bw / 2, y: base - h - 8, 'text-anchor': 'middle', class: 'vl' }, svg, fmt(v, 2));
      el('text', { x: xx + bw / 2, y: base + 22, 'text-anchor': 'middle', class: 'tk' }, svg, 'Năm ' + t);
    }
  });

  // Duy trì & hệ số PV
  (charts.retention || []).forEach(svg => {
    const x0 = 56, x1 = 610, top = 30, base = 320;
    const X = t => x0 + t / 5 * (x1 - x0), Y = v => base - v * (base - top);
    [0, 0.25, 0.5, 0.75, 1].forEach(v => { el('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), class: 'ax' }, svg); el('text', { x: x0 - 10, y: Y(v) + 4, 'text-anchor': 'end', class: 'tk' }, svg, (v * 100) + '%'); });
    const ret = [1, 0.8, 0.64, 0.512, 0.4096, 0.3277];
    const comb = ret.map((r, t) => r / Math.pow(1.15, t));
    const line = (vals, color, dash, w) => {
      const d = vals.map((v, t) => (t ? 'L' : 'M') + X(t) + ' ' + Y(v)).join('');
      const p = el('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-dasharray': dash || '', class: dash ? '' : 'draw' }, svg);
      if (!dash) p.style.setProperty('--len', 900);
      return p;
    };
    const area = 'M' + X(0) + ' ' + base + comb.map((v, t) => 'L' + X(t) + ' ' + Y(v)).join('') + 'L' + X(5) + ' ' + base + 'Z';
    el('path', { d: area, fill: C.tint, opacity: 0.9 }, svg);
    line(D.pvf, C.bk2, '6 6', 2.5);
    line(ret, C.bk, '', 3);
    ret.forEach((v, t) => { el('circle', { cx: X(t), cy: Y(v), r: 5, fill: C.bk, stroke: '#fff', 'stroke-width': 2 }, svg); el('text', { x: X(t), y: Y(v) - 12, 'text-anchor': 'middle', class: 'vl' }, svg, fmt(v * 100, t >= 3 ? 2 : 0).replace(/,00$/, '') + '%'); });
    for (let t = 0; t <= 5; t++) el('text', { x: X(t), y: base + 22, 'text-anchor': 'middle', class: 'tk' }, svg, 'Năm ' + t);
    // chú giải
    const lg = (yy, c, dash, t) => { el('line', { x1: 380, x2: 410, y1: yy, y2: yy, stroke: c, 'stroke-width': 3, 'stroke-dasharray': dash || '' }, svg); el('text', { x: 418, y: yy + 4, class: 'lb' }, svg, t); };
    lg(354, C.bk, '', 'Duy trì tích lũy rᵗ');
    lg(374, C.bk2, '6 6', 'Hệ số PV 1/(1,15)ᵗ');
    el('rect', { x: 60, y: 346, width: 26, height: 14, fill: C.tint }, svg);
    el('text', { x: 94, y: 358, class: 'lb' }, svg, 'Tích của hai hệ số');
  });

  // LTV stacked bars
  function drawLtvBars(mode) {
    const svg = $('#ltvBars'); if (!svg) return;
    if (!svg._built) {
      svg._built = true;
      const base = 290, x0 = 30, bw = 52, gap = 22;
      el('line', { x1: 20, x2: 470, y1: base, y2: base, class: 'ax0' }, svg);
      svg._bars = D.pvf.map((f, t) => {
        const xx = x0 + t * (bw + gap);
        const w = el('rect', { x: xx, width: bw, rx: 5, fill: C.bk }, svg);
        const c = el('rect', { x: xx, width: bw, rx: 5, fill: C.cheese }, svg);
        const lab = el('text', { x: xx + bw / 2, 'text-anchor': 'middle', class: 'vl' }, svg);
        el('text', { x: xx + bw / 2, y: base + 20, 'text-anchor': 'middle', class: 'tk' }, svg, 'N' + t);
        [w, c].forEach(n => { n.style.transition = 'y .6s cubic-bezier(.34,1.36,.64,1), height .6s cubic-bezier(.34,1.36,.64,1)'; });
        return { w, c, lab, t };
      });
      el('rect', { x: 30, y: 322, width: 14, height: 12, rx: 3, fill: C.cheese }, svg); el('text', { x: 50, y: 332, class: 'lb' }, svg, 'PV phô mai');
      el('rect', { x: 160, y: 322, width: 14, height: 12, rx: 3, fill: C.bk }, svg); el('text', { x: 180, y: 332, class: 'lb' }, svg, 'PV whey');
      el('text', { x: 300, y: 332, class: 'tk' }, svg, 'đơn vị: triệu đồng');
    }
    const base = 290, scale = 250 / 8580000;
    svg._bars.forEach(b => {
      const pc = D.gpCheese[b.t] * D.pvf[b.t], pw = D.gpWhey[b.t] * D.pvf[b.t];
      const hc = (mode === 'whey' ? 0 : pc) * scale, hw = (mode === 'cheese' ? 0 : pw) * scale;
      b.c.style.y = (base - hc) + 'px'; b.c.style.height = hc + 'px';
      b.w.style.y = (base - hc - hw) + 'px'; b.w.style.height = hw + 'px';
      const tot = (mode === 'whey' ? 0 : pc) + (mode === 'cheese' ? 0 : pw);
      b.lab.setAttribute('y', base - hc - hw - 8);
      b.lab.textContent = fmt(tot / 1e6, 2);
    });
  }
  drawLtvBars('both');

  // COCA khái niệm (theo hình bài giảng)
  (charts.cocaconcept || []).forEach(svg => {
    const x0 = 50, x1 = 620, top = 24, base = 330;
    el('line', { x1: x0, x2: x1, y1: base, y2: base, class: 'ax0' }, svg);
    el('line', { x1: x0, x2: x0, y1: top, y2: base, class: 'ax0' }, svg);
    el('text', { x: x0 - 8, y: top + 4, 'text-anchor': 'end', class: 'tk' }, svg, '$');
    el('text', { x: x1, y: base + 44, 'text-anchor': 'end', class: 'tk' }, svg, 'thời gian →');
    const ltv = t => base - 120 - t * 60;
    const coca = t => base - 40 - 250 * Math.exp(-3.2 * t);
    const pts = n => Array.from({ length: 61 }, (_, i) => i / 60).map(n);
    const X = t => x0 + t * (x1 - x0);
    // vùng đốt tiền: COCA > LTV
    let burn = '', tc = 0;
    for (let i = 0; i <= 200; i++) { const t = i / 200; if (coca(t) < ltv(t)) { if (!burn) burn = 'M' + X(t) + ' ' + ltv(t); burn += 'L' + X(t) + ' ' + coca(t); } else if (burn && !tc) tc = t; }
    let br = '';
    for (let i = 0; i <= 200; i++) { const t = i / 200 * tc; br += (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + coca(t).toFixed(1); }
    for (let i = 200; i >= 0; i--) { const t = i / 200 * tc; br += 'L' + X(t).toFixed(1) + ' ' + ltv(t).toFixed(1); }
    el('path', { d: br + 'Z', fill: C.negT }, svg);
    el('text', { x: X(tc * 0.35), y: base - 175, 'text-anchor': 'middle', class: 'lb', fill: C.neg }, svg, 'Đốt tiền');
    const pl = el('path', { d: pts(t => t).map((t, i) => (i ? 'L' : 'M') + X(t) + ' ' + ltv(t)).join(''), fill: 'none', stroke: C.bk, 'stroke-width': 3, class: 'draw' }, svg);
    pl.style.setProperty('--len', 700);
    const pc = el('path', { d: pts(t => t).map((t, i) => (i ? 'L' : 'M') + X(t) + ' ' + coca(t)).join(''), fill: 'none', stroke: C.bk2, 'stroke-width': 3, class: 'draw' }, svg);
    pc.style.setProperty('--len', 800);
    el('line', { x1: X(0.55), x2: x1, y1: base - 40, y2: base - 40, stroke: C.ink3, 'stroke-width': 1.5, 'stroke-dasharray': '3 5' }, svg);
    el('text', { x: x1, y: base - 24, 'text-anchor': 'end', class: 'tk' }, svg, 'X: đầu tư duy trì liên tục');
    el('text', { x: x1, y: ltv(1) - 10, 'text-anchor': 'end', class: 'lb', fill: C.bk }, svg, 'LTV');
    el('text', { x: X(0.05) + 14, y: coca(0.05), class: 'lb', fill: C.bk2 }, svg, 'COCA');
    [0.12, 0.5, 0.88].forEach((t, i) => { el('line', { x1: X(t), x2: X(t), y1: base, y2: base + 6, class: 'ax0' }, svg); el('text', { x: X(t), y: base + 22, 'text-anchor': 'middle', class: 'tk' }, svg, 'Thời điểm ' + (i + 1)); });
    el('text', { x: x0, y: 400, class: 'tk' }, svg, 'Giả sử LTV = $10,000/KH: COCA $1,000 thì bền vững; COCA $50,000 thì lỗ trên mỗi khách.');
  });

  // COCA stacked theo giai đoạn
  (charts.cocabars || []).forEach(svg => {
    const data = [['Thâm nhập', 600, 60, 150, '3,6 tr'], ['Tăng trưởng', 850, 180, 350, '1,91 tr'], ['Ổn định', 1100, 400, 500, '1,4 tr']];
    const base = 320, sc = 260 / 1100, bw = 92, gap = 52, x0 = 40;
    el('line', { x1: 20, x2: 460, y1: base, y2: base, class: 'ax0' }, svg);
    data.forEach((d, i) => {
      const xx = x0 + i * (bw + gap), hA = (d[1] - d[2]) * sc, hI = d[2] * sc;
      const a = el('rect', { x: xx, y: base - hA, width: bw, height: hA, rx: 6, fill: C.bk, class: 'bar-grow' }, svg); a.style.setProperty('--i', i);
      const b = el('rect', { x: xx, y: base - hA - hI, width: bw, height: hI, rx: 6, fill: C.tint2, class: 'bar-grow' }, svg); b.style.setProperty('--i', i + 0.5);
      el('text', { x: xx + bw / 2, y: base - hA + 20, 'text-anchor': 'middle', class: 'vl', fill: '#fff' }, svg, fmt(d[1] - d[2]));
      el('text', { x: xx + bw / 2, y: base - hA - hI - 8, 'text-anchor': 'middle', class: 'tk' }, svg, 'IBSE ' + d[2]);
      el('text', { x: xx + bw / 2, y: base + 20, 'text-anchor': 'middle', class: 'lb' }, svg, d[0]);
      el('text', { x: xx + bw / 2, y: base + 40, 'text-anchor': 'middle', class: 'tk' }, svg, '÷ ' + d[3] + ' KH mới');
      el('text', { x: xx + bw / 2, y: base + 66, 'text-anchor': 'middle', class: 'vl', fill: C.bk, 'font-size': 18 }, svg, d[4]);
    });
    el('text', { x: 20, y: 18, class: 'tk' }, svg, 'triệu đồng · phần đậm = TMSE − IBSE');
  });

  // LTV vs COCA theo thời gian (bài tập 4)
  (charts.ltvcoca || []).forEach(svg => {
    const x0 = 70, x1 = 660, top = 30, base = 400, max = 28;
    const Y = v => base - v / max * (base - top);
    const X = i => x0 + 60 + i * ((x1 - x0 - 120) / 2);
    [0, 5, 10, 15, 20, 25].forEach(v => { el('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), class: 'ax' }, svg); el('text', { x: x0 - 10, y: Y(v) + 4, 'text-anchor': 'end', class: 'tk' }, svg, v); });
    el('text', { x: x0 - 10, y: top - 12, 'text-anchor': 'end', class: 'tk' }, svg, 'triệu');
    const coca = [3.6, 1.914286, 1.4], ratio = ['6,94 : 1', '13,06 : 1', '17,86 : 1'];
    el('path', { d: 'M' + X(0) + ' ' + Y(25) + 'L' + X(2) + ' ' + Y(25) + 'L' + X(2) + ' ' + Y(coca[2]) + 'L' + X(1) + ' ' + Y(coca[1]) + 'L' + X(0) + ' ' + Y(coca[0]) + 'Z', fill: C.posT }, svg);
    el('line', { x1: x0, x2: x1, y1: Y(25 / 3), y2: Y(25 / 3), stroke: C.neg, 'stroke-width': 2, 'stroke-dasharray': '7 6' }, svg);
    el('text', { x: x1, y: Y(25 / 3) - 8, 'text-anchor': 'end', class: 'lb', fill: C.neg }, svg, 'COCA tối đa theo chuẩn 3 : 1 ≈ 8,33');
    const lp = el('path', { d: 'M' + X(0) + ' ' + Y(25) + 'L' + X(2) + ' ' + Y(25), stroke: C.bk, 'stroke-width': 3.5, fill: 'none', class: 'draw' }, svg); lp.style.setProperty('--len', 500);
    el('text', { x: X(0), y: Y(25) - 12, class: 'lb', fill: C.bk }, svg, 'LTV ≈ 25');
    const cp = el('path', { d: coca.map((v, i) => (i ? 'L' : 'M') + X(i) + ' ' + Y(v)).join(''), stroke: C.bk2, 'stroke-width': 3.5, fill: 'none', class: 'draw' }, svg); cp.style.setProperty('--len', 500);
    coca.forEach((v, i) => {
      el('circle', { cx: X(i), cy: Y(v), r: 6, fill: C.bk2, stroke: '#fff', 'stroke-width': 2 }, svg);
      el('text', { x: X(i) + (i === 2 ? -10 : 0), y: Y(v) - 14, 'text-anchor': i === 2 ? 'end' : 'middle', class: 'vl', fill: C.bk2 }, svg, 'COCA ' + fmt(v, 2).replace(/,?0+$/, '') + ' tr');
      el('rect', { x: X(i) - 50, y: Y(15) - 16, width: 100, height: 30, rx: 15, fill: '#fff', stroke: C.line }, svg);
      el('text', { x: X(i), y: Y(15) + 4, 'text-anchor': 'middle', class: 'vl', fill: C.pos }, svg, ratio[i]);
      el('text', { x: X(i), y: base + 24, 'text-anchor': 'middle', class: 'lb' }, svg, 'Thời điểm ' + (i + 1));
      el('text', { x: X(i), y: base + 42, 'text-anchor': 'middle', class: 'tk' }, svg, ['Năm 1', 'Năm 2–3', 'Năm 4–5'][i]);
    });
  });

  // Đường NPV (ví dụ bài giảng)
  (charts.npvprofile || []).forEach(svg => {
    const x0 = 70, x1 = 620, top = 20, base = 320, rMax = 1.0, vMin = -1000, vMax = 8000;
    const X = r => x0 + r / rMax * (x1 - x0), Y = v => base - (v - vMin) / (vMax - vMin) * (base - top);
    [0, 2000, 4000, 6000, 8000].forEach(v => { el('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), class: v === 0 ? 'ax0' : 'ax' }, svg); el('text', { x: x0 - 10, y: Y(v) + 4, 'text-anchor': 'end', class: 'tk' }, svg, fmt(v)); });
    [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(r => el('text', { x: X(r), y: base + 22, 'text-anchor': 'middle', class: 'tk' }, svg, (r * 100) + '%'));
    el('text', { x: x1, y: base + 44, 'text-anchor': 'end', class: 'tk' }, svg, 'suất chiết khấu r →');
    let d = ''; for (let i = 0; i <= 100; i++) { const r = i / 100 * rMax; d += (i ? 'L' : 'M') + X(r).toFixed(1) + ' ' + Y(npvFlows(D.lecFlows, r)).toFixed(1); }
    const p = el('path', { d, fill: 'none', stroke: C.bk, 'stroke-width': 3, class: 'draw' }, svg); p.style.setProperty('--len', 900);
    const n12 = npvFlows(D.lecFlows, 0.12);
    el('line', { x1: X(0.12), x2: X(0.12), y1: Y(0), y2: Y(n12), stroke: C.bk2, 'stroke-dasharray': '4 4' }, svg);
    el('circle', { cx: X(0.12), cy: Y(n12), r: 6, fill: C.bk2, stroke: '#fff', 'stroke-width': 2 }, svg);
    el('text', { x: X(0.12) + 12, y: Y(n12) - 8, class: 'vl', fill: C.bk2 }, svg, 'r = 12% → NPV = 4.208,2');
    el('circle', { cx: X(0.7377), cy: Y(0), r: 7, fill: C.pos, stroke: '#fff', 'stroke-width': 2 }, svg);
    el('text', { x: X(0.7377), y: Y(0) - 14, 'text-anchor': 'middle', class: 'vl', fill: C.pos }, svg, 'IRR = 73,77%');
    el('text', { x: X(0.9), y: Y(-600), 'text-anchor': 'middle', class: 'tk', fill: C.neg }, svg, 'NPV < 0');
  });

  // PP ví dụ bài giảng
  function cumChart(svg, vals, pp, ppText, labMin, labMax) {
    const W = vb(svg).width, x0 = 70, x1 = W - 20, top = 28, base = 320;
    const Y = v => top + (labMax - v) / (labMax - labMin) * (base - top);
    const n = vals.length, slot = (x1 - x0) / n, bw = slot * 0.56;
    const ticks = [];
    const st = (labMax - labMin) > 3000 ? 2000 : 250;
    for (let v = Math.ceil(labMin / st) * st; v <= labMax; v += st) ticks.push(v);
    ticks.forEach(v => { el('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), class: v === 0 ? 'ax0' : 'ax' }, svg); el('text', { x: x0 - 10, y: Y(v) + 4, 'text-anchor': 'end', class: 'tk' }, svg, fmt(v)); });
    vals.forEach((v, t) => {
      const xx = x0 + t * slot + (slot - bw) / 2, y0 = Y(0), yv = Y(v);
      const r = el('rect', { x: xx, y: Math.min(y0, yv), width: bw, height: Math.abs(yv - y0), rx: 5, fill: v < 0 ? C.neg : C.pos, opacity: 0.88 }, svg);
      el('text', { x: xx + bw / 2, y: v < 0 ? yv + 18 : yv - 8, 'text-anchor': 'middle', class: 'vl', fill: v < 0 ? C.neg : C.pos }, svg, (v > 0 ? '+' : '−') + fmt(Math.abs(v), 1));
      el('text', { x: xx + bw / 2, y: base + 22, 'text-anchor': 'middle', class: 'tk' }, svg, 'Năm ' + t);
    });
    const xp = x0 + (pp + 0.5) * slot;
    el('line', { x1: xp, x2: xp, y1: top - 6, y2: base, stroke: C.bk, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, svg);
    el('rect', { x: xp - 66, y: top - 26, width: 132, height: 26, rx: 13, fill: C.bk }, svg);
    el('text', { x: xp, y: top - 8, 'text-anchor': 'middle', class: 'vl', fill: '#fff' }, svg, ppText);
  }
  (charts.pplecture || []).forEach(svg => cumChart(svg, D.lecCum, 3.85, 'PP = 3,85 năm', -750, 250));
  (charts.ppours || []).forEach(svg => cumChart(svg, D.cum, 2.13, 'PP ≈ 2,13 năm', -1500, 6000));

  // Loại chi phí trên trục thời gian (số thật)
  (charts.costkinds || []).forEach(svg => {
    const base = 120, sc = 100 / 6500, x0 = 20, slot = 70;
    el('line', { x1: 10, x2: 440, y1: base, y2: base, class: 'ax0' }, svg);
    const h0 = D.inv * sc;
    el('rect', { x: x0, y: base - h0, width: 22, height: h0, rx: 3, fill: C.neg }, svg);
    el('text', { x: x0 + 11, y: base + 16, 'text-anchor': 'middle', class: 'tk' }, svg, 'N0');
    for (let t = 1; t <= 5; t++) {
      const xx = x0 + t * slot;
      const hc = D.cost[t - 1] * sc, hr = D.rev[t - 1] * sc;
      el('rect', { x: xx - 12, y: base - hc, width: 20, height: hc, rx: 3, fill: C.tint2 }, svg);
      el('rect', { x: xx + 10, y: base - hr, width: 20, height: hr, rx: 3, fill: C.pos }, svg);
      el('text', { x: xx + 9, y: base + 16, 'text-anchor': 'middle', class: 'tk' }, svg, 'N' + t);
    }
    const lg = (x, c, t) => { el('rect', { x, y: 2, width: 12, height: 12, rx: 3, fill: c }, svg); el('text', { x: x + 18, y: 12, class: 'tk' }, svg, t); };
    lg(10, C.neg, 'Đầu tư một lần'); lg(140, C.tint2, 'Chi phí định kỳ'); lg(278, C.pos, 'Doanh thu');
  });

  // Treemap chi phí năm 1
  (charts.treemap || []).forEach(svg => {
    const items = [['Nguyên liệu sữa & bao bì', 1100, C.bk], ['Lương nhân viên', 720, '#1C4FC8'], ['Lương quản lý & R&D', 420, C.bk2], ['Thuê xưởng & cửa hàng', 360, '#7FB8F0'], ['Tiện ích & tiếp thị', 100, C.tint2]];
    const W = 560, H = 340, tot = 2700;
    // chia lát xen kẽ đơn giản
    let x = 0, y = 0, w = W, h = H, rest = tot;
    items.forEach((it, i) => {
      const share = it[1] / rest;
      let r;
      if (i === items.length - 1) r = { x, y, w, h };
      else if (w >= h) { r = { x, y, w: w * share, h }; x += r.w; w -= r.w; }
      else { r = { x, y, w, h: h * share }; y += r.h; h -= r.h; }
      rest -= it[1];
      const g = el('g', {}, svg);
      el('rect', { x: r.x + 2, y: r.y + 2, width: Math.max(0, r.w - 4), height: Math.max(0, r.h - 4), rx: 10, fill: it[2] }, g);
      const dark = i < 3, fc = dark ? '#fff' : C.ink;
      if (r.h < 60) {
        el('text', { x: r.x + 12, y: r.y + r.h / 2 + 5, class: 'lb', fill: fc, 'font-size': 11.5 }, g, 'Tiện ích, tiếp thị · ' + fmt(it[1]) + ' · ' + fmt(it[1] / tot * 100, 1) + '%');
        return;
      }
      el('text', { x: r.x + 14, y: r.y + 28, class: 'lb', fill: fc, 'font-size': 14 }, g, it[0]);
      el('text', { x: r.x + 14, y: r.y + 56, class: 'vl', fill: fc, 'font-size': 22 }, g, fmt(it[1]));
      el('text', { x: r.x + 14, y: r.y + 78, class: 'tk', fill: dark ? '#C9D8F5' : C.ink2 }, g, fmt(it[1] / tot * 100, 1) + '%');
    });
  });

  // Doanh thu vs chi phí
  (charts.revcost || []).forEach(svg => {
    const x0 = 56, x1 = 460, top = 30, base = 330, max = 7000;
    const Y = v => base - v / max * (base - top);
    [0, 2000, 4000, 6000].forEach(v => { el('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), class: 'ax' }, svg); el('text', { x: x0 - 8, y: Y(v) + 4, 'text-anchor': 'end', class: 'tk' }, svg, fmt(v)); });
    const slot = (x1 - x0) / 5, bw = 26;
    D.rev.forEach((rv, t) => {
      const cx = x0 + t * slot + slot / 2;
      const a = el('rect', { x: cx - bw - 2, y: Y(rv), width: bw, height: base - Y(rv), rx: 4, fill: C.bk, class: 'bar-grow' }, svg); a.style.setProperty('--i', t);
      const b = el('rect', { x: cx + 2, y: Y(D.cost[t]), width: bw, height: base - Y(D.cost[t]), rx: 4, fill: C.tint2, class: 'bar-grow' }, svg); b.style.setProperty('--i', t + 0.3);
      el('line', { x1: cx + 2 + bw / 2, x2: cx + 2 + bw / 2, y1: Y(rv), y2: Y(D.cost[t]), stroke: C.pos, 'stroke-width': 2 }, svg);
      el('text', { x: cx, y: Y(rv) - 10, 'text-anchor': 'middle', class: 'vl', fill: C.pos }, svg, '+' + fmt(D.cf[t], 1));
      el('text', { x: cx, y: base + 20, 'text-anchor': 'middle', class: 'tk' }, svg, 'Năm ' + (t + 1));
    });
    const lg = (x, c, t) => { el('rect', { x, y: 364, width: 12, height: 12, rx: 3, fill: c }, svg); el('text', { x: x + 18, y: 374, class: 'tk' }, svg, t); };
    lg(56, C.bk, 'Doanh thu'); lg(150, C.tint2, 'Chi phí');
    el('line', { x1: 236, x2: 248, y1: 370, y2: 370, stroke: C.pos, 'stroke-width': 3 }, svg); el('text', { x: 254, y: 374, class: 'tk' }, svg, 'Dòng tiền hoạt động');
    el('text', { x: x0 - 8, y: 16, 'text-anchor': 'end', class: 'tk' }, svg, 'triệu');
  });

  // Giá trị sau cuối
  (charts.perpetuity || []).forEach(svg => {
    const x0 = 40, base = 330, top = 24, max = 38000;
    const Y = v => base - v / max * (base - top);
    const slot = 44, bw = 30;
    el('line', { x1: 20, x2: 630, y1: base, y2: base, class: 'ax0' }, svg);
    D.cf.forEach((c, i) => {
      const xx = x0 + i * slot;
      el('rect', { x: xx, y: Y(c), width: bw, height: base - Y(c), rx: 4, fill: C.bk }, svg);
      el('text', { x: xx + bw / 2, y: base + 20, 'text-anchor': 'middle', class: 'tk' }, svg, 'N' + (i + 1));
    });
    // CF_T chồng lên năm 5
    const x5 = x0 + 4 * slot;
    el('rect', { x: x5, y: Y(37929.6), width: bw, height: Y(2370.6) - Y(37929.6), rx: 4, fill: C.bk2, class: 'bar-grow' }, svg);
    el('text', { x: x5 + bw + 10, y: Y(37929.6) + 14, class: 'vl', fill: C.bk }, svg, '37.929,6 tại năm 5');
    el('text', { x: x5 + bw + 10, y: Y(37929.6) + 32, class: 'tk' }, svg, '= CF₅ 2.370,6 + CF_T 35.559,0');
    // đuôi vô hạn
    const tail = el('g', {}, svg);
    for (let k = 1; k <= 8; k++) {
      const v = D.cf[4] * Math.pow(1.05, k), xx = x0 + (4 + k) * slot + 28;
      el('rect', { x: xx, y: Y(v), width: bw, height: base - Y(v), rx: 4, fill: 'none', stroke: C.bk2, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, tail);
      if (k <= 3) el('text', { x: xx + bw / 2, y: Y(v) - 6, 'text-anchor': 'middle', class: 'tk' }, tail, fmt(v, 0));
      el('text', { x: xx + bw / 2, y: base + 20, 'text-anchor': 'middle', class: 'tk' }, tail, 'N' + (5 + k));
    }
    el('path', { d: 'M' + (x0 + 8 * slot + 44) + ' ' + (Y(4000)) + ' C ' + (x0 + 8 * slot) + ' ' + Y(16000) + ', ' + (x5 + 60) + ' ' + Y(20000) + ', ' + (x5 + bw + 8) + ' ' + Y(20000), fill: 'none', stroke: C.bk2, 'stroke-width': 2, 'marker-end': 'url(#arw)' }, svg);
    el('text', { x: x0 + 7 * slot + 10, y: Y(9000), class: 'lb', fill: C.bk2 }, svg, 'tăng 5%/năm mãi mãi');
    el('text', { x: x0 + 7 * slot + 10, y: Y(9000) + 18, class: 'tk' }, svg, 'gom về năm 5: CF₆ / (r − g)');
    // làm mờ dần đuôi bằng progressive blur
    const fo = el('foreignObject', { x: 470, y: Y(5000), width: 170, height: base - Y(5000) - 2 }, svg);
    const div = document.createElement('div'); div.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    fo.appendChild(div);
    [1, 2, 4, 8].forEach((b, i) => {
      const d = document.createElement('div');
      d.style.cssText = 'position:absolute;inset:0;backdrop-filter:blur(' + b + 'px);-webkit-backdrop-filter:blur(' + b + 'px);mask-image:linear-gradient(to right,transparent ' + (i * 25) + '%,black ' + ((i + 1) * 25) + '%);-webkit-mask-image:linear-gradient(to right,transparent ' + (i * 25) + '%,black ' + ((i + 1) * 25) + '%)';
      div.appendChild(d);
    });
    const fade = document.createElement('div'); fade.style.cssText = 'position:absolute;inset:0;background:linear-gradient(to right,rgba(245,247,252,0),' + C.paper + ')'; div.appendChild(fade);
    el('text', { x: 20, y: 14, class: 'tk' }, svg, 'triệu đồng');
  });

  // Dòng tiền phân tích + switch CF_T
  function drawCfBars(withT) {
    const svg = $('#cfBars'); if (!svg) return;
    const vals = [-1200, 300, 726, 1300.6, 1899.4, withT ? 37929.6 : 2370.6];
    const max = withT ? 40000 : 2600, min = withT ? -4000 : -1300;
    const x0 = 60, x1 = 460, top = 30, base = 300;
    const Y = v => top + (max - v) / (max - min) * (base - top);
    if (!svg._b) {
      svg._b = true; svg._grid = el('g', {}, svg);
      svg._bars = vals.map((_, t) => {
        const r = el('rect', { rx: 5 }, svg), l = el('text', { 'text-anchor': 'middle', class: 'vl' }, svg);
        el('text', { x: x0 + t * 66 + 22, y: base + 34, 'text-anchor': 'middle', class: 'tk' }, svg, 'Năm ' + t);
        r.style.transition = 'y .7s cubic-bezier(.34,1.2,.64,1), height .7s cubic-bezier(.34,1.2,.64,1)';
        return { r, l };
      });
      el('text', { x: 60, y: 350, class: 'tk' }, svg, 'CF phân tích, triệu đồng');
    }
    clear(svg._grid);
    const step = withT ? 10000 : 1000;
    for (let v = Math.ceil(min / step) * step; v <= max; v += step) { el('line', { x1: x0 - 10, x2: x1, y1: Y(v), y2: Y(v), class: v === 0 ? 'ax0' : 'ax' }, svg._grid); el('text', { x: x0 - 16, y: Y(v) + 4, 'text-anchor': 'end', class: 'tk' }, svg._grid, fmt(v)); }
    vals.forEach((v, t) => {
      const b = svg._bars[t], y0 = Y(0), yv = Y(v);
      b.r.setAttribute('x', x0 + t * 66); b.r.setAttribute('width', 44);
      b.r.style.y = Math.min(y0, yv) + 'px'; b.r.style.height = Math.max(1, Math.abs(yv - y0)) + 'px';
      b.r.setAttribute('fill', v < 0 ? C.neg : (t === 5 && withT ? C.bk2 : C.bk));
      b.l.setAttribute('x', x0 + t * 66 + 22); b.l.setAttribute('y', v < 0 ? yv + 18 : yv - 8);
      b.l.setAttribute('fill', v < 0 ? C.neg : C.ink);
      b.l.textContent = (v < 0 ? '−' : '+') + fmt(Math.abs(v), 0);
    });
    $$('[data-cmp] td[data-col]').forEach(c => { c.style.background = (c.dataset.col === 'with') === withT ? 'var(--bk-tint)' : ''; c.style.opacity = (c.dataset.col === 'with') === withT ? 1 : 0.6; });
  }
  drawCfBars(true);

  // Cơ cấu NPV theo r
  function drawNpvComp(r) {
    const svg = $('#npvComp'); if (!svg) return;
    const ops = npvOps(r), pt = pvCft(r), all = ops + pt;
    const atBase = Math.abs(r - 0.12) < 1e-9;
    const vAll = atBase ? 23302.0 : all, vOps = atBase ? 3124.7 : ops;
    if (!svg._b) {
      svg._b = true;
      svg._a = el('rect', { x: 0, y: 70, height: 56, rx: 8, fill: C.bk }, svg);
      svg._t = el('rect', { y: 70, height: 56, rx: 8, fill: C.bk2 }, svg);
      [svg._a, svg._t].forEach(n => { n.style.transition = 'width .35s cubic-bezier(.16,1,.3,1), x .35s cubic-bezier(.16,1,.3,1)'; });
      svg._la = el('text', { x: 10, y: 104, class: 'vl', fill: '#fff' }, svg);
      svg._lt = el('text', { y: 104, class: 'vl', fill: '#fff' }, svg);
      svg._big = el('text', { x: 0, y: 44, class: 'vl', 'font-size': 26, fill: C.ink }, svg);
      svg._sub = el('text', { x: 0, y: 156, class: 'tk' }, svg);
      el('rect', { x: 0, y: 186, width: 12, height: 12, rx: 3, fill: C.bk }, svg); svg._lgA = el('text', { x: 18, y: 197, class: 'lb' }, svg);
      el('rect', { x: 280, y: 186, width: 12, height: 12, rx: 3, fill: C.bk2 }, svg); svg._lgT = el('text', { x: 298, y: 197, class: 'lb' }, svg);
      el('text', { x: 0, y: 232, class: 'tk' }, svg, 'Công thức CF_T chỉ có nghĩa khi r > g = 5%.');
    }
    const W = 560, wa = Math.max(2, ops / all * W);
    svg._a.style.width = wa + 'px';
    svg._t.style.x = wa + 'px'; svg._t.style.width = (W - wa) + 'px';
    svg._la.textContent = wa > 90 ? fmt(vOps, 1) : '';
    svg._lt.setAttribute('x', Math.min(W - 120, wa + 12)); svg._lt.textContent = fmt(vAll - vOps, 1);
    svg._lgA.textContent = 'NPV 5 năm hoạt động: ' + fmt(vOps, 1);
    svg._lgT.textContent = 'PV của CF';
    const ts = svg._lgT.appendChild(document.createElementNS(NS, 'tspan')); ts.setAttribute('baseline-shift', 'sub'); ts.setAttribute('font-size', '75%'); ts.textContent = 'T';
    svg._lgT.appendChild(document.createTextNode(': ' + fmt(vAll - vOps, 1)));
    svg._big.textContent = ''; svg._big.appendChild(document.createTextNode('CF'));
    const bs = svg._big.appendChild(document.createElementNS(NS, 'tspan')); bs.setAttribute('baseline-shift', 'sub'); bs.setAttribute('font-size', '70%'); bs.textContent = 'T';
    svg._big.appendChild(document.createTextNode(' chiếm ' + fmt(pt / all * 100, 1) + '% NPV khi r = ' + fmt(r * 100, 1) + '%'));
    svg._sub.textContent = 'Đơn vị: triệu đồng. Tổng NPV = ' + fmt(vAll, 1);
    const oA = $('[data-out="npvAll"]'), oO = $('[data-out="npvOps"]');
    if (oA) oA.textContent = fmt(vAll, 1);
    if (oO) { oO.textContent = fmt(vOps, 1); oO.style.color = vOps < 0 ? C.neg : ''; }
  }
  drawNpvComp(0.12);

  /* =========================================================
     4. REVEAL + MORPH
     ========================================================= */
  Reveal.initialize({
    width: 1280, height: 720, margin: 0, minScale: 0.2, maxScale: 3,
    hash: true, center: false, transition: 'none', backgroundTransition: 'none',
    controls: true, controlsTutorial: false, progress: true, slideNumber: false,
    pdfSeparateFragments: false, pdfMaxPagesPerSlide: 1, viewDistance: 40,
    plugins: [RevealNotes]
  });

  function nameSlide(s, on) {
    if (!s) return;
    const set = (n, v) => { n.style.viewTransitionName = on ? v : ''; };
    $$('.s-title', s).forEach(n => set(n, 'vt-title'));
    $$('.s-logo', s).forEach(n => set(n, 'vt-logo'));
    $$('.s-foot', s).forEach(n => set(n, 'vt-foot'));
    const seen = {};
    $$('[data-id]', s).forEach(n => { const k = n.dataset.id; if (seen[k]) return; seen[k] = 1; set(n, 'vt-id-' + k); });
    let i = 0;
    $$('.blk', s).forEach(n => { if (n.dataset.id || n.querySelector('[data-id]') || n.closest('[data-id]') !== null && n.closest('[data-id]') !== n) return; set(n, 'vt-b' + (++i)); });
  }

  let pending = null;
  function morph(fn, changesSlide) {
    if (!document.startViewTransition || REDUCED || PRINT || !changesSlide) { fn(); return; }
    if (pending) { const p = pending; p.skipTransition(); p.updateCallbackDone.then(fn, fn); return; }
    const from = Reveal.getCurrentSlide();
    nameSlide(from, true);
    pending = document.startViewTransition(() => {
      nameSlide(from, false);
      fn();
      nameSlide(Reveal.getCurrentSlide(), true);
    });
    const vt = pending;
    const done = () => { nameSlide(Reveal.getCurrentSlide(), false); if (pending === vt) pending = null; };
    vt.ready.catch(() => {});
    vt.finished.then(done, done);
  }

  ['next', 'prev', 'right', 'left', 'slide', 'navigateNext', 'navigatePrev', 'navigateRight', 'navigateLeft'].forEach(name => {
    const orig = Reveal[name];
    if (typeof orig !== 'function') return;
    Reveal[name] = function () {
      const args = arguments;
      const opts = args[0] && typeof args[0] === 'object' ? args[0] : {};
      const fr = Reveal.availableFragments();
      let changes = true;
      if (name === 'slide') changes = typeof args[0] === 'number' && args[0] !== Reveal.getIndices().h;
      else if (/next|right/i.test(name)) changes = opts.skipFragments || !fr.next;
      else changes = opts.skipFragments || !fr.prev;
      morph(() => orig.apply(Reveal, args), changes);
    };
  });

  /* kích hoạt slide hiện tại */
  let active = null;
  function activate(s) {
    if (active && active !== s) { active.classList.remove('slide-on', 'sim-on'); rolls.forEach(r => { if (active.contains(r.host)) r.stop(); }); closeLayer(); }
    active = s;
    if (!s) return;
    s.classList.remove('slide-on'); void s.offsetWidth; s.classList.add('slide-on');
    if (s.hasAttribute('data-sim')) s.classList.add('sim-on');
    rolls.forEach(r => { if (s.contains(r.host)) r.start(); });
    $$('[data-wave]', s).forEach(w => { w.classList.remove('go'); void w.offsetWidth; if (!PRINT && !REDUCED) w.classList.add('go'); });
    $$('[data-dia]', s).forEach(diaRun);
    $$('[data-scramble]', s).forEach(n => { const f = n.closest('.fragment'); if (!f || f.classList.contains('visible')) scramble(n); });
    const sl = $('[data-eslider]', s); if (sl && sl._render) sl._render();
  }

  function onFragment(e, shown) {
    const f = e.fragment;
    if (!f) return;
    const s = f.closest('section');
    if (f.hasAttribute('data-acc-step')) { const acc = $('[data-acc]', s); const k = +f.dataset.accStep; acc._state = shown ? k : k - 1; acc._set(acc._state); }
    if (f.hasAttribute('data-fan-step')) { const fan = $('[data-fan]', s); const k = +f.dataset.fanStep; fan._set(shown ? k : k - 1); }
    if (f.hasAttribute('data-step-go')) { const st = $('[data-stepper]', s); const k = +f.dataset.stepGo; renderStepper(st, shown ? k : k - 1); }
    if (f.hasAttribute('data-cstroke') && f._on) f._on(shown);
    if (shown) $$('[data-scramble]', f).forEach(scramble);
  }

  Reveal.on('ready', e => {
    activate(e.currentSlide);
    $$('[data-goto]').forEach(a => a.addEventListener('click', () => {
      const t = document.getElementById(a.dataset.goto); if (!t) return;
      Reveal.slide(sections.indexOf(t));
    }));
    if (PRINT) {
      $$('[data-scramble]').forEach(n => { n.textContent = n.dataset.scramble; });
    }
  });
  Reveal.on('slidechanged', e => activate(e.currentSlide));
  Reveal.on('fragmentshown', e => onFragment(e, true));
  Reveal.on('fragmenthidden', e => onFragment(e, false));
})();
