/* Diwan (Arabic, right to left) behaviours for demo/index.html. Driven by js/bento-kit.js through window.DW. */

(() => {
'use strict';
const DWROOT = document.getElementById('dw');
const $ = (s, r = DWROOT) => r.querySelector(s);
const $$ = (s, r = DWROOT) => Array.from(r.querySelectorAll(s));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const eOut = t => 1 - Math.pow(1 - t, 3);
const eInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function tween(ms, fn, ez = eOut){
  return new Promise(res => {
    const t0 = performance.now();
    const step = now => { const k = clamp((now - t0) / ms, 0, 1); fn(ez(k), k); if (k < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });
}
const SVGNS = 'http://www.w3.org/2000/svg';
const DIG = '٠١٢٣٤٥٦٧٨٩';
const ar = s => String(s).replace(/[0-9]/g, d => DIG[d]);
const toLatin = s => String(s).replace(/[٠-٩]/g, d => String(DIG.indexOf(d)));
const NF = new Intl.NumberFormat('ar-EG');
const NF1 = new Intl.NumberFormat('ar-EG', {minimumFractionDigits: 1, maximumFractionDigits: 1});
const NF2 = new Intl.NumberFormat('ar-EG', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const NFC = new Intl.NumberFormat('ar-EG', {notation: 'compact', maximumFractionDigits: 1});
const sar = v => NF.format(Math.round(v)) + ' ر.س';
const sar2 = v => NF2.format(v) + ' ر.س';
const countUp = (el, to, ms, fmt, from = 0) => tween(ms, e => { el.textContent = fmt(from + (to - from) * e); });
const kit = DWROOT, grid = $('#grid');
const tiles = $$('.tile', grid);
const ICON = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 4h3.8v16H6.5zM13.7 4h3.8v16h-3.8z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 10 18 19.5 7"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
  bellOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16v-5a6 6 0 0 1 9.5-4.9M18 11v5l1.5 2H8"/><path d="M10 20.5a2 2 0 0 0 4 0M4 4l16 16"/></svg>'
};
const SI = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const CMD_ICON = {
  music: SI('<path d="M15 18V5L4 3v13"/><circle cx="17.5" cy="18" r="2.5"/><circle cx="6.5" cy="16" r="2.5"/>'),
  palette: SI('<path d="M12 3a9 9 0 1 1 0 18c-1 0-1.7-.8-1.7-1.7 0-.4.2-.8.5-1.1a1.7 1.7 0 0 0-1.2-2.9H8a5 5 0 0 1-5-5C3 6.3 7 3 12 3z"/><circle cx="16.5" cy="11.5" r="1" fill="currentColor"/><circle cx="13.5" cy="7.5" r="1" fill="currentColor"/><circle cx="8.5" cy="8" r="1" fill="currentColor"/>'),
  moon: SI('<path d="M4 14.5A8 8 0 1 0 14.5 4 6.5 6.5 0 0 1 4 14.5z"/>'),
  chat: SI('<path d="M20 5H4v11h11l5 4z"/>'),
  bell: SI('<path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
  image: SI('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="15" cy="10" r="1.8"/><path d="m3 16 5-5 8 8"/>'),
  user: SI('<circle cx="14" cy="8" r="4"/><path d="M21 20a7 7 0 0 0-14 0M5 8v6M2 11h6"/>'),
  quote: SI('<path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6"/>')
};

/* ---------- segmented controls ---------- */
const segPlacers = [];
function seg(el, attr, onPick){
  const pill = $('.seg-pill', el), btns = $$('button', el);
  const place = () => { const b = btns.find(x => x.getAttribute(attr) === 'true') || btns[0]; if (!b.offsetWidth) return; pill.style.width = b.offsetWidth + 'px'; pill.style.transform = `translateX(${b.offsetLeft}px)`; };
  const select = b => { btns.forEach(x => x.setAttribute(attr, String(x === b))); place(); };
  btns.forEach(b => b.addEventListener('click', () => { if (b.getAttribute(attr) === 'true') return; select(b); if (onPick) onPick(b); }));
  segPlacers.push(place);
  if ('ResizeObserver' in window) new ResizeObserver(place).observe(el);
  place();
  return { select, btns };
}
const syncSegs = () => segPlacers.forEach(f => f());
if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncSegs);


/* ---------- particles ---------- */
function particles(host, x, y, n, colors, spread, size){
  if (reduce) return;
  for (let i = 0; i < n; i++){
    const p = document.createElement('i'); p.className = 'pt';
    const a = Math.random() * Math.PI * 2, d = spread * (.55 + Math.random() * .7);
    p.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${colors[i % colors.length]}`;
    host.appendChild(p);
    p.animate([{transform: 'translate(-50%,-50%) scale(1)', opacity: 1}, {transform: `translate(calc(-50% + ${(Math.cos(a) * d).toFixed(1)}px), calc(-50% + ${(Math.sin(a) * d).toFixed(1)}px)) scale(.2) rotate(${Math.round(Math.random() * 360)}deg)`, opacity: 0}], {duration: 650 + Math.random() * 350, easing: 'cubic-bezier(.16,1,.3,1)'}).finished.then(() => p.remove());
  }
}
const cssVar = name => getComputedStyle(kit).getPropertyValue(name).trim();

/* ---------- player ---------- */
const tracks = [
  {t: 'مدّ وجزر', a: 'فرقة الساحل', art: 'img/art-tide.jpg', d: 228},
  {t: 'المدينة الوردية', a: 'نور أطلس', art: 'img/art-petra.jpg', d: 201},
  {t: 'جلسات المغارة', a: 'رمال', art: 'img/art-cave.jpg', d: 254},
  {t: 'الساعة الزرقاء', a: 'نظرية الكثبان', art: 'img/art-blue.jpg', d: 187}
];
const fmtT = s => ar(`${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`);
const player = $('#player'), plBar = $('#plBar'), plPlay = $('#plPlay');
let ti = 0, pos = 72, playing = false, ptimer = 0;
const eqEl = $('#plEq');
for (let i = 0; i < 18; i++){ const b = document.createElement('i'); b.style.setProperty('--d', (-Math.random() * 1.2).toFixed(2) + 's'); b.style.height = Math.round(18 + Math.random() * 62) + '%'; eqEl.appendChild(b); }
function drawPos(){ const d = tracks[ti].d; plBar.style.setProperty('--p', (pos / d * 100).toFixed(2) + '%'); $('#plCur').textContent = fmtT(pos); $('#plDur').textContent = '-' + fmtT(d - pos); plBar.setAttribute('aria-valuenow', String(Math.round(pos))); plBar.setAttribute('aria-valuemax', String(d)); plBar.setAttribute('aria-valuetext', fmtT(pos)); }
function setPlaying(on){
  playing = on; player.classList.toggle('playing', on);
  plPlay.innerHTML = on ? ICON.pause : ICON.play; plPlay.setAttribute('aria-label', on ? 'إيقاف مؤقت' : 'تشغيل');
  clearInterval(ptimer);
  if (on) ptimer = setInterval(() => { pos += 1; if (pos >= tracks[ti].d) loadTrack(ti + 1, 1); else drawPos(); }, 1000);
}
function loadTrack(i, dir){
  ti = (i + tracks.length) % tracks.length; pos = 0;
  const tr = tracks[ti], imgs = $$('#plArt img'), on = imgs.find(x => x.classList.contains('on')) || imgs[0], off = imgs.find(x => x !== on);
  off.src = tr.art; off.alt = 'غلاف «' + tr.t + '»';
  const swap = () => { off.classList.add('on'); on.classList.remove('on'); on.alt = ''; };
  if (off.decode) off.decode().then(swap, swap); else swap();
  const meta = $('#plMeta');
  meta.animate([{opacity: 1, transform: 'none'}, {opacity: 0, transform: `translateX(${16 * dir}px)`}], {duration: 170, easing: 'ease-in'}).finished.then(() => {
    $('#plTitle').textContent = tr.t; $('#plArtist').textContent = tr.a;
    meta.animate([{opacity: 0, transform: `translateX(${-16 * dir}px)`}, {opacity: 1, transform: 'none'}], {duration: 420, easing: 'cubic-bezier(.16,1,.3,1)'});
  });
  drawPos();
}
plPlay.addEventListener('click', () => setPlaying(!playing));
$('#plPrev').addEventListener('click', () => { if (pos > 3){ pos = 0; drawPos(); } else loadTrack(ti - 1, -1); });
$('#plNext').addEventListener('click', () => loadTrack(ti + 1, 1));
$('#plShuf').addEventListener('click', e => { const b = e.currentTarget; b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); });
$('#plHeart').addEventListener('click', e => {
  const b = e.currentTarget, on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', String(on));
  if (on && !reduce) b.animate([{transform: 'scale(1)'}, {transform: 'scale(1.28)'}, {transform: 'scale(1)'}], {duration: 420, easing: 'cubic-bezier(.34,1.28,.64,1)'});
});
const seekAt = x => { const r = plBar.getBoundingClientRect(); pos = clamp((x - r.left) / r.width, 0, 1) * (tracks[ti].d - 1); drawPos(); };
plBar.addEventListener('pointerdown', e => { plBar.setPointerCapture(e.pointerId); plBar.classList.add('drag'); seekAt(e.clientX); });
plBar.addEventListener('pointermove', e => { if (plBar.classList.contains('drag')) seekAt(e.clientX); });
['pointerup', 'pointercancel'].forEach(t => plBar.addEventListener(t, () => plBar.classList.remove('drag')));
plBar.addEventListener('keydown', e => { if (e.key === 'ArrowRight'){ pos = Math.min(tracks[ti].d - 1, pos + 5); drawPos(); } else if (e.key === 'ArrowLeft'){ pos = Math.max(0, pos - 5); drawPos(); } });
drawPos();

/* ---------- prayer times (astronomical, Umm al-Qura angles) ---------- */
const PRAYERS = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
const RIYADH = {lat: 24.7136, lng: 46.6753, tz: 3};
const prayTimes = (() => {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const fixA = a => ((a % 360) + 360) % 360, fixH = h => ((h % 24) + 24) % 24;
  const sin = d => Math.sin(d * D2R), cos = d => Math.cos(d * D2R), tan = d => Math.tan(d * D2R);
  const asin = x => Math.asin(x) * R2D, acos = x => Math.acos(clamp(x, -1, 1)) * R2D, atan2 = (y, x) => Math.atan2(y, x) * R2D, acot = x => Math.atan(1 / x) * R2D;
  function julian(y, m, d){ if (m <= 2){ y -= 1; m += 12; } const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5; }
  function sunPos(jd){ const D = jd - 2451545.0, g = fixA(357.529 + .98560028 * D), q = fixA(280.459 + .98564736 * D), L = fixA(q + 1.915 * sin(g) + .020 * sin(2 * g)), e = 23.439 - .00000036 * D; return {decl: asin(sin(e) * sin(L)), eqt: q / 15 - fixH(atan2(cos(e) * sin(L), cos(L)) / 15)}; }
  return (y, m, d, {lat, lng, tz}) => {
    const jd = julian(y, m, d) - lng / (15 * 24);
    const mid = t => fixH(12 - sunPos(jd + t).eqt);
    const angleTime = (ang, t, ccw) => { const decl = sunPos(jd + t).decl, T = acos((-sin(ang) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat))) / 15; return mid(t) + (ccw ? -T : T); };
    const asr = (f, t) => { const decl = sunPos(jd + t).decl; return angleTime(-acot(f + tan(Math.abs(lat - decl))), t); };
    const adj = tz - lng / 15;
    const maghrib = angleTime(.833, 18 / 24) + adj;
    return [angleTime(18.5, 5 / 24, true) + adj, mid(12 / 24) + adj, asr(1, 13 / 24) + adj, maghrib, maghrib + 1.5];
  };
})();
const t12 = hours => { let h = Math.floor(hours), m = Math.round((hours - h) * 60); if (m === 60){ h += 1; m = 0; } const suf = (h % 24) < 12 ? 'ص' : 'م'; return ar(`${(h % 12) || 12}:${String(m).padStart(2, '0')}`) + ' ' + suf; };
const prList = $('#prList'), prArc = $('#prArc');
const bells = [false, true, true, false, true];
PRAYERS.forEach((n, i) => {
  const li = document.createElement('li'); li.className = 'pr-row';
  li.innerHTML = `<b></b><time></time><button type="button" class="pr-bell"></button>`;
  $('b', li).textContent = n;
  const bell = $('.pr-bell', li);
  bell.addEventListener('click', () => { bells[i] = !bells[i]; paintBell(i); bell.classList.remove('ring'); void bell.offsetWidth; if (bells[i]) bell.classList.add('ring'); });
  prList.appendChild(li);
});
const prRows = $$('.pr-row', prList);
function paintBell(i){ const b = $('.pr-bell', prRows[i]); b.setAttribute('aria-pressed', String(bells[i])); b.setAttribute('aria-label', (bells[i] ? 'إلغاء تنبيه ' : 'تفعيل تنبيه ') + PRAYERS[i]); b.innerHTML = bells[i] ? ICON.bell : ICON.bellOff; }
PRAYERS.forEach((_, i) => paintBell(i));
function riyadhNow(){ const d = new Date(Date.now() + RIYADH.tz * 3600e3); return {y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600}; }
let prNextIdx = 2, prLastName = '';
function prayerTick(){
  const n = riyadhNow();
  const today = prayTimes(n.y, n.m, n.d, RIYADH);
  let list = today, idx = today.findIndex(t => t > n.h), next, prev, afterIsha = false;
  if (idx === -1){
    const tm = new Date(Date.UTC(n.y, n.m - 1, n.d + 1));
    list = prayTimes(tm.getUTCFullYear(), tm.getUTCMonth() + 1, tm.getUTCDate(), RIYADH);
    idx = 0; next = list[0] + 24; prev = today[4]; afterIsha = true;
  } else { next = today[idx]; prev = idx > 0 ? today[idx - 1] : today[4] - 24; }
  prNextIdx = idx;
  prRows.forEach((li, i) => { $('time', li).textContent = t12(list[i]); li.classList.toggle('next', i === idx); li.classList.toggle('past', !afterIsha && i < idx); });
  const left = Math.max(0, Math.round((next - n.h) * 3600));
  const hh = Math.floor(left / 3600), mm2 = String(Math.floor(left % 3600 / 60)).padStart(2, '0'), ss2 = String(left % 60).padStart(2, '0');
  $('#prCd').textContent = ar(hh ? `${hh}:${mm2}:${ss2}` : `${mm2}:${ss2}`);
  if (PRAYERS[idx] !== prLastName){ prLastName = PRAYERS[idx]; $('#prName').textContent = prLastName; }
  prArc.style.strokeDashoffset = String(100 - clamp((n.h - prev) / (next - prev), 0, 1) * 100);
}
prayerTick(); setInterval(prayerTick, 1000);
function prayerIntro(){ prArc.style.transition = 'none'; prArc.style.strokeDashoffset = '100'; void prArc.getBoundingClientRect(); prArc.style.transition = ''; requestAnimationFrame(prayerTick); setTimeout(prayerTick, 60); }

/* ---------- photos ---------- */
const photos = [
  {t: 'الشعاب المرجانية من الأعلى', m: 'الساحل · ٢٤ صورة'},
  {t: 'ساحة الشحن', m: 'رحلة القطار · ١٨ صورة'},
  {t: 'مسبح القاعة الخضراء', m: 'عطلة نهاية الأسبوع · ٣١ صورة'},
  {t: 'آخر الضوء', m: 'نزهة المساء · ٩ صور'}
];
const phImgs = $$('#phStack img'), phDots = $('#phDots'); let pi = 0;
photos.forEach((p, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'عرض ' + p.t); b.addEventListener('click', () => showPhoto(i)); phDots.appendChild(b); });
function showPhoto(i){
  pi = (i + photos.length) % photos.length;
  phImgs.forEach((im, k) => im.classList.toggle('on', k === pi));
  $('#phTitle').textContent = photos[pi].t; $('#phMeta').textContent = photos[pi].m;
  if (!reduce) [$('#phTitle'), $('#phMeta')].forEach((el, k) => el.animate([{opacity: 0, transform: 'translateY(6px)'}, {opacity: 1, transform: 'none'}], {duration: 460, delay: k * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
  $$('button', phDots).forEach((d, k) => { d.classList.remove('on'); if (k === pi){ void d.offsetWidth; d.classList.add('on'); } });
}
phDots.addEventListener('animationend', e => { if (e.animationName === 'dw-dotfill' && !reduce) showPhoto(pi + 1); });
$('#phPrev').addEventListener('click', () => showPhoto(pi - 1));
$('#phNext').addEventListener('click', () => showPhoto(pi + 1));
showPhoto(0);

/* ---------- weather ---------- */
let wxC = true; const wxT = $('#wxT'); let wxVal = 29;
$('#wxTemp').addEventListener('click', () => {
  wxC = !wxC; const from = wxVal; wxVal = wxC ? 29 : 84;
  countUp(wxT, wxVal, 650, v => ar(Math.round(v)), from);
  $('#wxU').textContent = wxC ? '°م' : '°ف';
  $('#wxMeta').textContent = wxC ? 'رياح نشطة · العظمى ٣١° الصغرى ١٨°' : 'رياح نشطة · العظمى ٨٨° الصغرى ٦٤°';
});

/* ---------- clock ---------- */
const clkH = $('#clkH'), clkM = $('#clkM'), clkS = $('#clkS'), clkDig = $('#clkDig');
for (let i = 0; i < 12; i++){
  if (i % 3 === 0) continue;
  const a = i * Math.PI / 6, l = document.createElementNS(SVGNS, 'line');
  l.setAttribute('x1', (50 + Math.sin(a) * 38).toFixed(2)); l.setAttribute('y1', (50 - Math.cos(a) * 38).toFixed(2));
  l.setAttribute('x2', (50 + Math.sin(a) * 42).toFixed(2)); l.setAttribute('y2', (50 - Math.cos(a) * 42).toFixed(2));
  $('#clkTicks').appendChild(l);
}
[['١٢', 50, 17], ['٣', 84, 51], ['٦', 50, 85], ['٩', 16, 51]].forEach(([t, x, y]) => {
  const tx = document.createElementNS(SVGNS, 'text'); tx.setAttribute('x', x); tx.setAttribute('y', y); tx.setAttribute('class', 'clk-num'); tx.setAttribute('text-anchor', 'middle'); tx.setAttribute('dominant-baseline', 'middle'); tx.textContent = t; $('#clkNums').appendChild(tx);
});
let sweepAt = 0, h24 = true, lastDig = '';
const clockSweep = () => { sweepAt = performance.now(); };
function clockFrame(now){
  const d = new Date(), s = d.getSeconds() + d.getMilliseconds() / 1000, m = d.getMinutes() + s / 60, h = d.getHours() % 12 + m / 60;
  let k = 1;
  if (sweepAt){ const t = (now - sweepAt) / 1500; if (t >= 1) sweepAt = 0; else k = 1 - Math.pow(1 - clamp(t, 0, 1), 4); }
  clkH.style.transform = `rotate(${(h * 30 * k).toFixed(2)}deg)`;
  clkM.style.transform = `rotate(${(m * 6 * k).toFixed(2)}deg)`;
  clkS.style.transform = `rotate(${((reduce ? Math.floor(s) : s) * 6 * k).toFixed(2)}deg)`;
  const hr = d.getHours(), mm = String(d.getMinutes()).padStart(2, '0');
  const dig = h24 ? ar(`${String(hr).padStart(2, '0')}:${mm}`) : ar(`${(hr % 12) || 12}:${mm}`) + (hr < 12 ? ' ص' : ' م');
  if (dig !== lastDig){ clkDig.textContent = dig; lastDig = dig; }
  requestAnimationFrame(clockFrame);
}
requestAnimationFrame(clockFrame);
clkDig.addEventListener('click', () => { h24 = !h24; lastDig = ''; });

/* ---------- controls ---------- */
$$('.cc-btn').forEach(b => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', String(on));
  $('small', b).textContent = on ? b.dataset.on : 'متوقف';
  if (!reduce) $('.cc-ic', b).animate([{transform: 'scale(.82)', offset: .3}, {transform: 'scale(1.1)', offset: .65}], {duration: 480, easing: 'ease-out'});
}));
$$('.switch').forEach(s => s.addEventListener('click', () => s.setAttribute('aria-checked', String(s.getAttribute('aria-checked') !== 'true'))));

/* ---------- sliders ---------- */
const vsLbl = $('#vsLbl'), vsRead = $('#vsRead');
function vslider(el, v0, name, extra){
  let v = v0, dragging = false;
  const set = (nv, quiet) => {
    v = clamp(nv, 0, 1); el.style.setProperty('--v', v.toFixed(3)); el.classList.toggle('low', v < .16);
    el.setAttribute('aria-valuenow', String(Math.round(v * 100))); el.setAttribute('aria-valuetext', ar(Math.round(v * 100)) + '٪');
    if (extra) extra(v);
    if (!quiet){ vsLbl.textContent = name; vsRead.textContent = ar(Math.round(v * 100)) + '٪'; }
  };
  const raw = e => { const r = el.getBoundingClientRect(); return 1 - (e.clientY - r.top) / r.height; };
  const move = e => {
    if (!dragging) return;
    const rv = raw(e); set(rv);
    const over = rv > 1 ? rv - 1 : rv < 0 ? rv : 0;
    if (over){ const o = Math.min(.5, Math.abs(over)); el.style.transformOrigin = over > 0 ? '50% 100%' : '50% 0%'; el.style.transform = `scaleY(${(1 + o * .14).toFixed(3)}) scaleX(${(1 - o * .07).toFixed(3)})`; }
    else el.style.transform = '';
  };
  el.addEventListener('pointerdown', e => { dragging = true; el.setPointerCapture(e.pointerId); el.classList.add('drag'); move(e); });
  el.addEventListener('pointermove', move);
  const up = () => { dragging = false; el.classList.remove('drag'); el.style.transform = ''; };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  el.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft'){ e.preventDefault(); set(v + .05); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight'){ e.preventDefault(); set(v - .05); }
  });
  set(v0, true);
  return {
    set, el, get: () => v,
    intro(){ const t = v; el.classList.add('drag'); set(0, true); void el.offsetHeight; el.classList.remove('drag'); requestAnimationFrame(() => set(t, true)); setTimeout(() => { if (!dragging && v === 0) set(t, true); }, 140); }
  };
}
const vsB = vslider($('#vsB'), .64, 'السطوع');
const vsV = vslider($('#vsV'), .42, 'الصوت', v => { $('#vsV').dataset.lvl = v < .02 ? '0' : v < .45 ? '1' : '2'; });

/* ---------- notifications ---------- */
const people = [
  {n: 'لينا حدّاد', av: 'img/av-owl.jpg', m: 'هل نطلق خيار الاشتراك السنوي اليوم؟'},
  {n: 'عمر صالح', av: 'img/av-parrot.jpg', m: 'أضاف ٣ تعليقات على صفحة الأسعار'},
  {n: 'روبوت النشر', av: 'img/av-penguin.jpg', m: 'نُشر الموقع بنجاح خلال ٤٢ ثانية'},
  {n: 'مايا خوري', av: 'img/av-zebra.jpg', m: 'شاركت معك ٢٤ صورة'},
  {n: 'سامي ناصر', av: 'img/av-eagle.jpg', m: 'حجزتُ الاستوديو يوم الخميس الساعة ١٠ ص'}
];
const nfList = $('#nfList'), nfEmpty = $('#nfEmpty'); let np = 0;
const liveNf = () => $$('.nf', nfList).filter(x => !x.dataset.gone);
function nfEl(p, time){
  const el = document.createElement('div'); el.className = 'nf';
  el.innerHTML = '<img class="nf-av" alt=""><div class="nf-body"><div class="nf-top"><b></b><time></time></div><p></p></div><button type="button" class="nf-x" aria-label="تجاهل">' + SI('<path d="M7 7l10 10M17 7 7 17"/>') + '</button>';
  $('img', el).src = p.av; $('b', el).textContent = p.n; $('time', el).textContent = time; $('p', el).textContent = p.m;
  $('.nf-x', el).addEventListener('click', ev => { ev.stopPropagation(); dismissNf(el, -1); });
  swipeable(el);
  return el;
}
function addNf(animate){
  const p = people[np++ % people.length];
  $$('.nf time', nfList).forEach(t => { if (t.textContent === 'الآن') t.textContent = 'منذ دقيقة'; });
  const el = nfEl(p, 'الآن'); nfList.prepend(el); nfEmpty.hidden = true;
  if (animate && !reduce) el.animate([{opacity: 0, transform: 'translateY(-16px) scale(.96)'}, {opacity: 1, transform: 'none'}], {duration: 560, easing: 'cubic-bezier(.16,1,.3,1)'});
  liveNf().slice(4).forEach(x => dismissNf(x, 0));
}
function dismissNf(el, dir){
  if (el.dataset.gone) return; el.dataset.gone = '1';
  const cs = getComputedStyle(el), h = el.offsetHeight, pt = cs.paddingTop, pb = cs.paddingBottom;
  el.style.transition = 'none';
  const out = dir ? [{transform: cs.transform === 'none' ? 'none' : cs.transform, opacity: cs.opacity}, {transform: `translateX(${dir * 115}%) rotate(${dir * 4}deg)`, opacity: 0}] : [{opacity: 1}, {opacity: 0}];
  const finish = () => { el.remove(); if (!liveNf().length) nfEmpty.hidden = false; };
  if (reduce){ finish(); return; }
  el.animate(out, {duration: dir ? 320 : 220, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards'}).finished
    .then(() => el.animate([{height: h + 'px', paddingTop: pt, paddingBottom: pb, marginBottom: '0px'}, {height: '0px', paddingTop: '0px', paddingBottom: '0px', marginBottom: '-7px'}], {duration: 280, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards'}).finished)
    .then(finish, finish);
}
function swipeable(el){
  let x0 = null, dx = 0;
  el.addEventListener('pointerdown', e => { if (e.target.closest('.nf-x') || el.dataset.gone) return; x0 = e.clientX; dx = 0; el.setPointerCapture(e.pointerId); el.style.transition = 'none'; el.classList.add('grab'); });
  el.addEventListener('pointermove', e => { if (x0 === null) return; dx = e.clientX - x0; el.style.transform = `translateX(${dx}px) rotate(${(dx * .02).toFixed(2)}deg)`; el.style.opacity = String(1 - Math.min(.6, Math.abs(dx) / 320)); });
  const end = () => { if (x0 === null) return; x0 = null; el.classList.remove('grab'); el.style.transition = ''; if (Math.abs(dx) > 80) dismissNf(el, Math.sign(dx)); else { el.style.transform = ''; el.style.opacity = ''; } };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}
$('#nfClear').addEventListener('click', () => liveNf().forEach((el, i) => setTimeout(() => dismissNf(el, -1), i * 70)));
function ensureNf(n){ for (let i = liveNf().length; i < n; i++) addNf(false); }
[['الآن', 0], ['منذ ٤ د', 1], ['منذ ١٢ د', 2], ['منذ ساعة', 3]].forEach(([t, k]) => nfList.insertBefore(nfEl(people[k], t), nfEmpty));
np = 4;

/* ---------- verse of the day ---------- */
const VERSES = [
  {a: 'عَلى قَدْرِ أهْلِ العَزْمِ تأتي العَزائِمُ', b: 'وَتأتي عَلى قَدْرِ الكِرامِ المَكارِمُ', p: 'المتنبي'},
  {a: 'الخَيْلُ وَاللّيْلُ وَالبَيْداءُ تَعرِفُني', b: 'وَالسّيفُ وَالرّمحُ وَالقِرْطاسُ وَالقَلَمُ', p: 'المتنبي'},
  {a: 'السَّيْفُ أَصْدَقُ أَنْبَاءً مِنَ الكُتُبِ', b: 'فِي حَدِّهِ الحَدُّ بَيْنَ الجِدِّ وَاللَّعِبِ', p: 'أبو تمّام'},
  {a: 'دَعِ الأَيَّامَ تَفْعَلُ مَا تَشَاءُ', b: 'وَطِبْ نَفْسًا إِذَا حَكَمَ القَضَاءُ', p: 'الشافعي'}
];
let vi = 0, vBusy = false;
async function nextVerse(){
  if (vBusy) return; vBusy = true;
  const A = $('#vrA'), B = $('#vrB'), P = $('#vrPoet');
  vi = (vi + 1) % VERSES.length; const v = VERSES[vi];
  if (!reduce) await Promise.all([A, B].map(el => el.animate([{opacity: 1}, {opacity: 0}], {duration: 200, fill: 'forwards'}).finished));
  A.textContent = v.a; B.textContent = v.b; P.textContent = v.p;
  [A, B].forEach(el => el.getAnimations().forEach(a => a.cancel()));
  if (!reduce) await Promise.all([A, B].map((el, k) => el.animate([{clipPath: 'inset(0 0 0 100%)', opacity: 1}, {clipPath: 'inset(0 0 0 0%)', opacity: 1}], {duration: 900, delay: k * 520, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards'}).finished));
  vBusy = false;
}
$('#vrNext').addEventListener('click', nextVerse);

/* ---------- week calendar (with Hijri date) ---------- */
const TODAY = new Date();
const WEEK_START = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - TODAY.getDay(), 12);
const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'], DAY_LETTERS = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
const SAMPLE_EVENTS = [['١١:٠٠ ص', 'فطور مع لينا'], ['١٠:٠٠ ص', 'اجتماع الفريق'], null, ['٢:٣٠ م', 'مراجعة التصميم'], ['٩:٣٠ ص', 'موعد طبيب الأسنان'], ['١:٠٠ م', 'غداء العائلة'], null];
const WEEK = DAY_NAMES.map((d, i) => { const date = new Date(WEEK_START); date.setDate(WEEK_START.getDate() + i); return {d, s: DAY_LETTERS[i], n: date.getDate(), date, ev: SAMPLE_EVENTS[i], today: date.toDateString() === TODAY.toDateString()}; });
const DAY_FMT = new Intl.DateTimeFormat('ar-EG', {weekday: 'long', day: 'numeric', month: 'long'});
$('#calMonth').textContent = new Intl.DateTimeFormat('ar-EG', {month: 'long', year: 'numeric'}).format(TODAY);
let HIJRI = null;
try { HIJRI = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', {day: 'numeric', month: 'long', year: 'numeric'}); } catch (err) { HIJRI = null; }
const wk = $('#wk'), wkPill = $('.wk-pill', wk); let calSel = TODAY.getDay();
WEEK.forEach((w, i) => {
  const b = document.createElement('button'); b.type = 'button';
  b.className = 'wk-d' + (w.ev ? ' has' : '') + (w.today ? ' today' : '');
  b.setAttribute('role', 'tab'); b.setAttribute('aria-label', DAY_FMT.format(w.date));
  b.innerHTML = `<span>${w.s}</span><b>${ar(w.n)}</b><i class="dot"></i>`;
  b.addEventListener('click', () => pickDay(i));
  wk.appendChild(b);
});
const wkDays = $$('.wk-d', wk);
function placeWk(){ const b = wkDays[calSel]; if (!b.offsetWidth) return; wkPill.style.width = b.offsetWidth + 'px'; wkPill.style.transform = `translateX(${b.offsetLeft}px)`; }
function pickDay(i){
  calSel = i; wkDays.forEach((b, k) => b.setAttribute('aria-selected', String(k === i))); placeWk();
  const w = WEEK[i], ev = $('#calEv');
  let hj = `${w.d} ${ar(w.n)}`;
  if (HIJRI){ try { hj = HIJRI.format(w.date); } catch (err) { /* keep weekday label */ } }
  $('#calHijri').textContent = hj;
  ev.classList.toggle('none', !w.ev);
  ev.textContent = '';
  const bar = document.createElement('i'); ev.appendChild(bar);
  if (w.ev){ const t = document.createElement('b'); t.textContent = w.ev[0]; const s = document.createElement('span'); s.textContent = w.ev[1]; ev.append(t, s); }
  else { const s = document.createElement('span'); s.textContent = 'لا مواعيد في ' + w.d; ev.appendChild(s); }
  if (!reduce) ev.animate([{opacity: 0, transform: 'translateY(6px)'}, {opacity: 1, transform: 'none'}], {duration: 380, easing: 'cubic-bezier(.16,1,.3,1)'});
}
segPlacers.push(placeWk);
if ('ResizeObserver' in window) new ResizeObserver(placeWk).observe(wk);
pickDay(calSel);

/* ---------- chat ---------- */
const msgs = $('#msgs'), msgIn = $('#msgIn'), sendBtn = $('#sendBtn'), LINA = 'img/av-owl.jpg';
const REPLIES = ['تبدو رائعة على شاشتي', 'النسخة العربية أجمل بكثير', 'الخط العربي هنا فخم جدًا', 'هل نطلقها الليلة؟', 'صورة الخشخاش مذهلة', 'أحببت تشطيب العقيق'];
const CHAT_DEMO = ['الرابط جاهز، شاهدي العرض', 'جرّبي تشطيب اللازورد', 'أسجّل العرض التوضيحي الآن'];
let rq = 0, replyT = 0, demoChat = 0;
function avatar(){ const im = document.createElement('img'); im.className = 'msg-av'; im.alt = ''; im.src = LINA; return im; }
function bubble(kind, text, animate){
  const el = document.createElement('div'); el.className = 'msg ' + kind;
  if (kind === 'in') el.appendChild(avatar());
  const p = document.createElement('p'); p.textContent = text; el.appendChild(p);
  msgs.appendChild(el);
  if (animate && !reduce){ const o = kind === 'out' ? '0 100%' : '100% 100%'; el.animate([{opacity: 0, transform: 'translateY(10px) scale(.92)', transformOrigin: o}, {opacity: 1, transform: 'none', transformOrigin: o}], {duration: 420, easing: 'cubic-bezier(.16,1,.3,1)'}); }
  const all = $$('.msg', msgs); all.slice(0, Math.max(0, all.length - 7)).forEach(m => m.remove());
  return el;
}
function typing(){ const el = document.createElement('div'); el.className = 'msg in typing'; el.appendChild(avatar()); const p = document.createElement('p'); p.innerHTML = '<i></i><i></i><i></i>'; el.appendChild(p); msgs.appendChild(el); if (!reduce) el.animate([{opacity: 0, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}], {duration: 300, easing: 'ease-out'}); return el; }
let typingEl = null;
const clearTyping = () => { if (typingEl){ typingEl.remove(); typingEl = null; } };
function incoming(delay = 500){
  clearTimeout(replyT); clearTyping();
  replyT = setTimeout(() => { typingEl = typing(); replyT = setTimeout(() => { clearTyping(); bubble('in', REPLIES[rq++ % REPLIES.length], true); }, 1400); }, delay);
}
function send(text){
  text = text.trim(); if (!text) return;
  bubble('out', text, true);
  sendBtn.classList.remove('fly'); void sendBtn.offsetWidth; sendBtn.classList.add('fly');
  incoming(600);
}
$('#compose').addEventListener('submit', e => { e.preventDefault(); send(msgIn.value); msgIn.value = ''; });
bubble('in', 'هل ما زلنا على موعد الإطلاق الليلة؟', false);
bubble('out', 'طبعًا! العرض يُسجَّل الآن', false);
bubble('in', 'أرسل لي رابط اللوحة حين تجهز', false);

/* ---------- chart (time runs right to left) ---------- */
const DATA = {
  7: {lab: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'], v: [5800, 6400, 6100, 7600, 8200, 6900, 7210], d: '+١٢٫٤٪'},
  30: {lab: ['١٢ أكتوبر', '١٧ أكتوبر', '٢٢ أكتوبر', '٢٧ أكتوبر', '١ نوفمبر', '٦ نوفمبر', '١١ نوفمبر'], v: [24100, 27900, 26200, 29800, 31400, 28600, 28880], d: '+٨٫١٪'},
  90: {lab: ['١٣ أغسطس', '٢٨ أغسطس', '١٢ سبتمبر', '٢٧ سبتمبر', '١٢ أكتوبر', '٢٧ أكتوبر', '١١ نوفمبر'], v: [68200, 71500, 74900, 79300, 77600, 83400, 86400], d: '+٢١٫٧٪'}
};
const CW = 600, CH = 120; let range = 7, pts = [], dom = [0, 1], chIdx = -1;
const total = r => DATA[r].v.reduce((a, b) => a + b, 0);
function niceStep(span){ const raw = span / 2, p = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / p; return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * p; }
const tickFmt = v => v >= 10000 ? NFC.format(v) : NF.format(v);
function smooth(p){
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++){
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
const yAt = v => 8 + (1 - (v - dom[0]) / (dom[1] - dom[0])) * (CH - 16);
function buildChart(){
  const ds = DATA[range], mn = Math.min(...ds.v), mx = Math.max(...ds.v), pad = (mx - mn) * .18;
  dom = [mn - pad, mx + pad];
  const step = niceStep(dom[1] - dom[0]), ticks = [];
  for (let t = Math.ceil(dom[0] / step) * step; t <= dom[1]; t += step) ticks.push(t);
  pts = ds.v.map((v, i) => [CW - i * CW / (ds.v.length - 1), yAt(v)]);
  const d = smooth(pts);
  $('#chLine').setAttribute('d', d); $('#chArea').setAttribute('d', d + ` L0,${CH} L${CW},${CH} Z`);
  const g = $('#chGrid'); g.textContent = '';
  const tk = $('#chTicks'); tk.textContent = '';
  ticks.forEach(t => {
    const y = yAt(t), l = document.createElementNS(SVGNS, 'line');
    l.setAttribute('class', 'grid-l'); l.setAttribute('x1', 0); l.setAttribute('x2', CW); l.setAttribute('y1', y.toFixed(1)); l.setAttribute('y2', y.toFixed(1)); g.appendChild(l);
    const s = document.createElement('span'); s.style.top = (y / CH * 100).toFixed(2) + '%'; s.textContent = tickFmt(t); tk.appendChild(s);
  });
  $('#chDelta').textContent = ds.d;
  const tb = $('#chTable tbody'); tb.textContent = '';
  ds.v.forEach((v, i) => { const tr = document.createElement('tr'), a = document.createElement('td'), b = document.createElement('td'); a.textContent = ds.lab[i]; b.textContent = NF.format(v); tr.append(a, b); tb.appendChild(tr); });
  placeEnd();
}
const ch = $('#ch'), chPlot = $('#chPlot'), chX = $('#chX'), chDot = $('#chDot'), chEnd = $('#chEnd'), chEndLbl = $('#chEndLbl'), chTip = $('#chTip');
function placeEnd(){
  const r = chPlot.getBoundingClientRect(); if (!r.width) return;
  const last = pts[pts.length - 1], lx = last[0] / CW * r.width, ly = last[1] / CH * r.height, ds = DATA[range];
  chEnd.style.left = lx + 'px'; chEnd.style.top = ly + 'px';
  chEndLbl.textContent = NF1.format(ds.v[ds.v.length - 1] / 1000) + ' ألف';
  chEndLbl.style.left = clamp(lx, 22, r.width - 22) + 'px'; chEndLbl.style.top = ly + 'px';
}
function showPoint(i){
  const r = chPlot.getBoundingClientRect(), ds = DATA[range];
  i = clamp(i, 0, pts.length - 1); chIdx = i;
  const [px, py] = pts[i], lx = px / CW * r.width, ly = py / CH * r.height;
  ch.classList.add('hov');
  chX.style.left = lx + 'px'; chDot.style.left = lx + 'px'; chDot.style.top = ly + 'px';
  $('#chTipV').textContent = NF.format(ds.v[i]) + ' ر.س'; $('#chTipL').textContent = ds.lab[i];
  chTip.style.left = clamp(lx, 50, r.width - 50) + 'px'; chTip.style.top = Math.max(ly, 26) + 'px';
}
function chartHover(clientX){ const r = chPlot.getBoundingClientRect(), x = clamp((clientX - r.left) / r.width, 0, 1) * CW; showPoint(Math.round((CW - x) / (CW / (pts.length - 1)))); }
const hideChart = () => { ch.classList.remove('hov'); chIdx = -1; };
chPlot.addEventListener('pointermove', e => chartHover(e.clientX));
chPlot.addEventListener('pointerleave', hideChart);
ch.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft'){ e.preventDefault(); showPoint(chIdx < 0 ? pts.length - 1 : chIdx + 1); }
  else if (e.key === 'ArrowRight'){ e.preventDefault(); showPoint(chIdx < 0 ? pts.length - 1 : chIdx - 1); }
  else if (e.key === 'Escape') hideChart();
});
ch.addEventListener('focus', () => showPoint(pts.length - 1));
ch.addEventListener('blur', hideChart);
seg($('#chSeg'), 'aria-pressed', b => {
  const from = total(range); range = +b.dataset.r; buildChart();
  countUp($('#chNum'), total(range), 700, sar, from);
});
if ('ResizeObserver' in window) new ResizeObserver(placeEnd).observe(chPlot);
const revealChart = () => $('#chSvg').animate([{clipPath: 'inset(0 0 0 100%)'}, {clipPath: 'inset(0 0 0 0%)'}], {duration: 1300, easing: 'cubic-bezier(.65,0,.35,1)'});
buildChart();

/* ---------- todo ---------- */
const tds = $$('.td'), todoTile = $('#todoTile');
function tdSync(){ const d = tds.filter(t => t.classList.contains('done')).length; $('#tdCount').textContent = `${ar(d)} من ${ar(tds.length)}`; $('#tdBar').style.width = (d / tds.length * 100) + '%'; return d; }
tds.forEach(t => t.addEventListener('click', () => {
  const on = !t.classList.contains('done');
  t.classList.toggle('done', on); t.setAttribute('aria-checked', String(on));
  if (on){ t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop'); }
  if (tdSync() === tds.length){ const b = $('.td-bar', todoTile), r = b.getBoundingClientRect(), tr = todoTile.getBoundingClientRect(); particles(todoTile, r.left - tr.left + r.width / 2, r.top - tr.top, 20, [cssVar('--accent-line'), cssVar('--brass'), cssVar('--ring3')], 80, 6); }
}));
function resetTodos(){ tds.forEach((t, i) => { const on = i < 2; t.classList.toggle('done', on); t.setAttribute('aria-checked', String(on)); }); tdSync(); }
tdSync();

/* ---------- price + busy buttons ---------- */
const PR = {m: {p: '٦٩', per: 'ر.س / شهريًا'}, y: {p: '٦٦٠', per: 'ر.س / سنويًا'}};
function roll(box, text, dir){
  const old = box.lastElementChild, nu = document.createElement('b'); nu.textContent = text; box.appendChild(nu);
  if (reduce){ old.remove(); return; }
  nu.animate([{transform: `translateY(${dir * 100}%)`, opacity: 0}, {transform: 'none', opacity: 1}], {duration: 480, easing: 'cubic-bezier(.16,1,.3,1)'});
  old.animate([{transform: 'none', opacity: 1}, {transform: `translateY(${-dir * 100}%)`, opacity: 0}], {duration: 320, easing: 'ease-in', fill: 'forwards'}).finished.then(() => old.remove(), () => old.remove());
}
seg($('#prSeg'), 'aria-pressed', b => { const k = b.dataset.b; roll($('#prRoll'), PR[k].p, k === 'y' ? 1 : -1); $('#prPer').textContent = PR[k].per; $('#prSave').classList.toggle('show', k === 'y'); });
async function busy(btn, idle, working, done, after){
  if (btn.dataset.busy) return; btn.dataset.busy = '1';
  btn.style.minWidth = btn.offsetWidth + 'px';
  btn.innerHTML = `<span class="spin"></span><span>${working}</span>`;
  await sleep(1050);
  btn.classList.add('ok'); btn.innerHTML = ICON.check + `<span>${done}</span>`;
  if (!reduce) btn.animate([{transform: 'scale(.95)'}, {transform: 'scale(1.03)'}, {transform: 'none'}], {duration: 420, easing: 'cubic-bezier(.16,1,.3,1)'});
  if (after) after();
  await sleep(1900);
  btn.classList.remove('ok'); btn.textContent = idle; btn.style.minWidth = ''; delete btn.dataset.busy;
}
$('#prBtn').addEventListener('click', e => busy(e.currentTarget, 'ترقية', 'جارٍ الترقية', 'تمّت الترقية'));
let teamMore = 5;
$('#inviteBtn').addEventListener('click', e => busy(e.currentTarget, 'دعوة', 'جارٍ الإرسال', 'أُرسلت', () => {
  const m = $('#avMore'); teamMore++; m.textContent = '+' + ar(teamMore);
  if (!reduce) m.animate([{transform: 'scale(.6)'}, {transform: 'scale(1.15)'}, {transform: 'none'}], {duration: 450, easing: 'cubic-bezier(.16,1,.3,1)'});
}));

/* ---------- wallet ---------- */
const wlCard = $('#wlCard'); let wlFlipped = false, wlBal = 9300.5;
function tilt(px, py){
  wlCard.style.setProperty('--ry', ((px - .5) * 20).toFixed(1) + 'deg'); wlCard.style.setProperty('--rx', ((.5 - py) * 16).toFixed(1) + 'deg');
  wlCard.style.setProperty('--gx', (px * 100).toFixed(0) + '%'); wlCard.style.setProperty('--gy', (py * 100).toFixed(0) + '%');
  wlCard.classList.add('tilt');
}
function untilt(){ wlCard.classList.remove('tilt'); wlCard.style.setProperty('--rx', '0deg'); wlCard.style.setProperty('--ry', '0deg'); }
wlCard.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = wlCard.getBoundingClientRect(); tilt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); });
wlCard.addEventListener('pointerleave', untilt);
function flipCard(){ wlFlipped = !wlFlipped; wlCard.classList.add('flipping'); wlCard.classList.toggle('flipped', wlFlipped); wlCard.setAttribute('aria-label', wlFlipped ? 'اعرض وجه البطاقة' : 'اقلب البطاقة'); setTimeout(() => wlCard.classList.remove('flipping'), 800); }
wlCard.addEventListener('click', flipCard);
wlCard.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); flipCard(); } });
$('#wlPay').addEventListener('click', e => busy(e.currentTarget, 'ادفع ١٨ ر.س', 'جارٍ الدفع', 'تمّ الدفع', () => {
  const from = wlBal; wlBal = Math.round((wlBal - 18) * 100) / 100;
  countUp($('#wlAmt'), wlBal, 700, sar2, from);
  const last = $('#wlLast'); last.textContent = '';
  const amt = document.createElement('bdi'); amt.dir = 'ltr'; amt.textContent = '−' + NF2.format(18);
  last.append(amt, ' ر.س · مقهى الزاوية');
  if (!reduce) wlCard.animate([{transform: 'scale(1)'}, {transform: 'scale(.95)'}, {transform: 'scale(1)'}], {duration: 380, easing: 'cubic-bezier(.16,1,.3,1)'});
}));

/* ---------- search ---------- */
const cmdIn = $('#cmdIn'), cmdList = $('#cmdList'); let cmdSel = 0, cmdShown = [];
function cmds(){
  return [
    {t: 'تشغيل «' + tracks[0].t + '»', i: 'music', k: 'P', run: () => { if (ti !== 0) loadTrack(0, 1); setPlaying(true); }},
    {t: 'تفعيل وضع التركيز', i: 'moon', k: 'F', run: () => { const b = $('#ccFocus'); if (b.getAttribute('aria-pressed') !== 'true') b.click(); }},
    {t: 'مراسلة لينا', i: 'chat', k: 'M', run: () => msgIn.focus()},
    {t: 'مسح الإشعارات', i: 'bell', k: 'C', run: () => $('#nfClear').click()},
    {t: 'البيت التالي', i: 'quote', k: 'B', run: () => nextVerse()},
    {t: 'الذكرى التالية', i: 'image', k: 'N', run: () => showPhoto(pi + 1)},
    {t: 'دعوة زميل', i: 'user', k: 'I', run: () => $('#inviteBtn').click()}
  ];
}
function markSel(){ $$('li[data-i]', cmdList).forEach(li => li.setAttribute('aria-selected', String(+li.dataset.i === cmdSel))); }
function renderCmd(){
  const q = cmdIn.value.trim();
  cmdShown = cmds().filter(c => c.t.includes(q));
  cmdSel = clamp(cmdSel, 0, Math.max(0, cmdShown.length - 1));
  cmdList.textContent = '';
  if (!cmdShown.length){ const li = document.createElement('li'); li.className = 'empty'; li.textContent = 'لا نتائج مطابقة'; cmdList.appendChild(li); return; }
  cmdShown.forEach((c, i) => {
    const li = document.createElement('li'); li.setAttribute('role', 'option'); li.dataset.i = i; li.setAttribute('aria-selected', String(i === cmdSel));
    li.innerHTML = `<span class="ci">${CMD_ICON[c.i]}</span><span class="ct"></span><kbd>⌘${c.k}</kbd>`;
    $('.ct', li).textContent = c.t; cmdList.appendChild(li);
  });
}
function runCmd(){
  const c = cmdShown[cmdSel]; if (!c) return;
  const li = $(`li[data-i="${cmdSel}"]`, cmdList); if (li){ li.classList.remove('run'); void li.offsetWidth; li.classList.add('run'); }
  c.run();
  setTimeout(() => { cmdIn.value = ''; cmdSel = 0; renderCmd(); }, 320);
}
cmdIn.addEventListener('input', () => { cmdSel = 0; renderCmd(); });
cmdIn.addEventListener('keydown', e => {
  const n = Math.max(1, cmdShown.length);
  if (e.key === 'ArrowDown'){ e.preventDefault(); cmdSel = (cmdSel + 1) % n; markSel(); }
  else if (e.key === 'ArrowUp'){ e.preventDefault(); cmdSel = (cmdSel - 1 + n) % n; markSel(); }
  else if (e.key === 'Enter'){ e.preventDefault(); runCmd(); }
  else if (e.key === 'Escape'){ cmdIn.value = ''; renderCmd(); cmdIn.blur(); }
});
cmdList.addEventListener('mousemove', e => { const li = e.target.closest('li[data-i]'); if (li && +li.dataset.i !== cmdSel){ cmdSel = +li.dataset.i; markSel(); } });
cmdList.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li){ cmdSel = +li.dataset.i; runCmd(); } });
document.addEventListener('keydown', e => { if (kit.hidden) return; if ((e.metaKey || e.ctrlKey) && e.key && e.key.toLowerCase() === 'k'){ e.preventDefault(); cmdIn.focus(); const t = $('.t-search'); t.classList.remove('pulse'); void t.offsetWidth; t.classList.add('pulse'); } });

/* ---------- knob ---------- */
const kn = $('#kn'), knArc = $('#knArc'), knBody = $('.kn-body', kn);
for (let i = 0; i <= 10; i++){
  const a = (135 + i * 27) * Math.PI / 180, l = document.createElementNS(SVGNS, 'line');
  l.setAttribute('x1', (50 + Math.cos(a) * 45).toFixed(2)); l.setAttribute('y1', (50 + Math.sin(a) * 45).toFixed(2));
  l.setAttribute('x2', (50 + Math.cos(a) * 48.5).toFixed(2)); l.setAttribute('y2', (50 + Math.sin(a) * 48.5).toFixed(2));
  $('#knTicks').appendChild(l);
}
let knV = 62, knDet = 6, knY = null, knStart = 0, knGen = 0;
function setKnob(v, quiet){
  if (!quiet) knGen++;
  knV = clamp(v, 0, 100);
  knArc.style.strokeDashoffset = String(100 - knV);
  knBody.style.setProperty('--ka', (135 - knV * 2.7).toFixed(1) + 'deg');
  kn.setAttribute('aria-valuenow', String(Math.round(knV))); kn.setAttribute('aria-valuetext', ar(Math.round(knV)) + '٪');
  $('#knVal').textContent = ar(Math.round(knV)) + '٪';
  const det = Math.floor(knV / 10);
  if (!quiet && det !== knDet && !reduce) knBody.animate([{scale: '1'}, {scale: '1.05'}, {scale: '1'}], {duration: 160});
  knDet = det;
}
kn.addEventListener('pointerdown', e => { kn.setPointerCapture(e.pointerId); knY = e.clientY; knStart = knV; kn.classList.add('drag'); });
kn.addEventListener('pointermove', e => { if (knY !== null) setKnob(knStart + (knY - e.clientY) * .6); });
const knUp = () => { knY = null; kn.classList.remove('drag'); };
kn.addEventListener('pointerup', knUp); kn.addEventListener('pointercancel', knUp);
kn.addEventListener('wheel', e => { e.preventDefault(); setKnob(knV - Math.sign(e.deltaY) * 3); }, {passive: false});
kn.addEventListener('keydown', e => { if (e.key === 'ArrowUp' || e.key === 'ArrowLeft'){ e.preventDefault(); setKnob(knV + 5); } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight'){ e.preventDefault(); setKnob(knV - 5); } });
setKnob(62, true);
function knobIntro(){
  const t = knV, gen = ++knGen;
  kn.classList.add('drag'); setKnob(0, true); void kn.offsetWidth; kn.classList.remove('drag');
  tween(1000, e => { if (gen === knGen) setKnob(t * e, true); }, eOut);
  setTimeout(() => { if (gen === knGen) setKnob(t, true); }, 1150);
}

/* ---------- activity rings ---------- */
const RG = [{label: 'اليوم', v: [.82, .64, .88], l: ['٨٫٢ ألف', '٤٢ د', '٧ س']}, {label: 'أمس', v: [1, .38, .7], l: ['١٠٫٤ ألف', '٢٣ د', '٥٫٦ س']}];
let rgI = 0;
function drawRings(intro){
  const d = RG[rgI];
  ['rg1', 'rg2', 'rg3'].forEach((id, k) => {
    const c = $('#' + id);
    if (intro){ c.style.transition = 'none'; c.style.strokeDashoffset = '100'; void c.getBoundingClientRect(); c.style.transition = ''; }
    c.style.transitionDelay = (k * 120) + 'ms';
    c.style.strokeDashoffset = String(100 - d.v[k] * 100);
    $('#rgL' + (k + 1)).textContent = d.l[k];
  });
  $('#rgDay').textContent = d.label;
}
$('#rgDay').addEventListener('click', () => {
  rgI = (rgI + 1) % RG.length; drawRings(false);
  if (RG[rgI].v[0] >= 1){ const t = $('.t-rings'), svg = $('.rg', t), r = svg.getBoundingClientRect(), tr = t.getBoundingClientRect(); setTimeout(() => particles(t, r.left - tr.left + r.width / 2, r.top - tr.top + r.height / 2, 14, [cssVar('--ring1'), cssVar('--ring2'), cssVar('--ring3')], 42, 5), 900); }
});
drawRings(false);

/* ---------- palette ---------- */
const SW = [{v: '--accent', n: () => 'ليمون'}, {v: '--brass', n: () => 'نحاس'}, {v: '--ink', n: () => 'حبر'}, {v: '--bg', n: () => 'حجر'}, {v: '--surface', n: () => 'خزف'}, {v: '--ring3', n: () => 'نيلي'}];
const sws = $('#sws'); let swI = 0, swT = 0;
SW.forEach((s, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'sw'; b.style.background = `var(${s.v})`; b.setAttribute('aria-label', s.n()); b.addEventListener('click', () => pickSwatch(i, true)); sws.appendChild(b); });
const swBtns = $$('.sw', sws);
function renderSwatchName(){ $('#swName').textContent = SW[swI].n(); swBtns[0].setAttribute('aria-label', SW[0].n()); }
async function pickSwatch(i, copy){
  swI = i; swBtns.forEach((b, k) => b.classList.toggle('on', k === i)); renderSwatchName();
  if (copy){
    const hex = cssVar(SW[i].v).toUpperCase();
    try { await navigator.clipboard.writeText(hex); $('#swName').textContent = 'نُسخ ' + hex; clearTimeout(swT); swT = setTimeout(renderSwatchName, 1100); } catch (err) { $('#swName').textContent = hex; clearTimeout(swT); swT = setTimeout(renderSwatchName, 1400); }
  }
}
pickSwatch(0, false);

/* ---------- otp ---------- */
const otp = $('#otp'), otpMsg = $('#otpMsg'), DEFMSG = 'أدخل الرمز المرسل إلى الرقم المنتهي بـ ٤٢';
for (let i = 0; i < 6; i++){
  const inp = document.createElement('input');
  inp.type = 'text'; inp.inputMode = 'numeric'; inp.maxLength = 1; inp.autocomplete = i ? 'off' : 'one-time-code';
  inp.id = 'otp' + i; inp.setAttribute('aria-label', 'الرقم ' + ar(i + 1)); inp.style.setProperty('--i', i);
  otp.appendChild(inp);
}
const boxes = $$('input', otp); let otpReset = 0;
function otpCheck(){
  boxes.forEach(b => b.classList.toggle('filled', !!b.value));
  const code = toLatin(boxes.map(b => b.value).join(''));
  otp.classList.remove('ok');
  if (code.length < 6){ otpMsg.textContent = DEFMSG; otpMsg.className = 'otp-msg'; return; }
  if (code === '000000'){ otp.classList.remove('bad'); void otp.offsetWidth; otp.classList.add('bad'); otpMsg.textContent = 'انتهت صلاحية الرمز. اطلب رمزًا جديدًا من «إعادة الإرسال».'; otpMsg.className = 'otp-msg'; return; }
  otp.classList.add('ok'); otpMsg.textContent = 'تمّ التحقق. جارٍ تسجيل الدخول…'; otpMsg.className = 'otp-msg ok';
  clearTimeout(otpReset); otpReset = setTimeout(() => { boxes.forEach(b => { b.value = ''; }); otpCheck(); }, 3200);
}
boxes.forEach((b, i) => {
  b.addEventListener('input', () => { const d = toLatin(b.value).replace(/\D/g, '').slice(-1); b.value = d ? ar(d) : ''; if (b.value && boxes[i + 1]) boxes[i + 1].focus(); otpCheck(); });
  b.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !b.value && boxes[i - 1]){ boxes[i - 1].value = ''; boxes[i - 1].focus(); otpCheck(); }
    else if (e.key === 'ArrowLeft' && boxes[i - 1]) boxes[i - 1].focus();
    else if (e.key === 'ArrowRight' && boxes[i + 1]) boxes[i + 1].focus();
  });
  b.addEventListener('paste', e => {
    const t = toLatin((e.clipboardData && e.clipboardData.getData('text')) || '').replace(/\D/g, '').slice(0, 6);
    if (!t) return; e.preventDefault();
    [...t].forEach((c, j) => { if (boxes[j]) boxes[j].value = ar(c); });
    boxes[Math.min(5, t.length)].focus(); otpCheck();
  });
});
$('#otpResend').addEventListener('click', () => { clearTimeout(otpReset); boxes.forEach(b => { b.value = ''; }); otpCheck(); otpMsg.textContent = 'أرسلنا رمزًا جديدًا إلى الرقم المنتهي بـ ٤٢'; });
async function otpType(code){ clearTimeout(otpReset); boxes.forEach(b => { b.value = ''; }); otpCheck(); for (let j = 0; j < code.length; j++){ await sleep(120); boxes[j].value = ar(code[j]); otpCheck(); } }

/* ---------- timer ---------- */
const TM = 300; let tmLeft = 252, tmOn = false, tmInt = 0;
const tmArc = $('#tmArc'), tmBtn = $('#tmBtn');
function tmDraw(){ $('#tmTime').textContent = ar(`${String(Math.floor(tmLeft / 60)).padStart(2, '0')}:${String(tmLeft % 60).padStart(2, '0')}`); tmArc.style.strokeDashoffset = String(100 - 100 * tmLeft / TM); }
function tmSet(on){
  tmOn = on; tmBtn.innerHTML = on ? ICON.pause : ICON.play; tmBtn.setAttribute('aria-label', on ? 'إيقاف المؤقت' : 'تشغيل المؤقت');
  $('#tmState').textContent = on ? 'قيد التشغيل' : 'متوقف';
  clearInterval(tmInt);
  if (on) tmInt = setInterval(() => { tmLeft = tmLeft > 0 ? tmLeft - 1 : TM; tmDraw(); }, 1000);
}
tmBtn.addEventListener('click', () => tmSet(!tmOn));
function tmIntro(){ tmArc.style.transition = 'none'; tmArc.style.strokeDashoffset = '100'; void tmArc.getBoundingClientRect(); tmArc.style.transition = ''; requestAnimationFrame(tmDraw); setTimeout(tmDraw, 60); }
tmDraw(); tmSet(true);

/* ---------- rating ---------- */
const WORDS = ['سيئة', 'مقبولة', 'جيدة', 'رائعة', 'استثنائية'];
const starsEl = $('#stars'); let rating = 4;
for (let i = 1; i <= 5; i++){
  const b = document.createElement('button'); b.type = 'button'; b.className = 'star'; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', ar(i) + (i === 1 ? ' نجمة' : i === 2 ? ' نجمتان' : ' نجوم'));
  b.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.9l2.75 5.6 6.15.9-4.45 4.35 1.05 6.1L12 17l-5.5 2.85 1.05-6.1L3.1 9.4l6.15-.9z"/></svg>';
  starsEl.appendChild(b);
}
const stars = $$('.star', starsEl);
function paintStars(n){ stars.forEach((s, i) => { s.classList.toggle('on', i < n); s.setAttribute('aria-checked', String(i + 1 === rating)); }); $('#rtWord').textContent = WORDS[n - 1]; }
function rateTo(n){ rating = n; paintStars(n); stars.forEach((x, j) => { if (j < n){ x.classList.remove('pop'); void x.offsetWidth; x.style.animationDelay = (j * 45) + 'ms'; x.classList.add('pop'); } }); }
stars.forEach((s, i) => { s.addEventListener('mouseenter', () => paintStars(i + 1)); s.addEventListener('click', () => rateTo(i + 1)); });
starsEl.addEventListener('mouseleave', () => paintStars(rating));
paintStars(rating);

/* ---------- like ---------- */
let liked = false, likes = 1284;
const likeBtn = $('#likeBtn'), likeN = $('#likeN'), likeTile = $('#likeTile'), lkBig = $('#lkBig');
function setLike(on){
  if (liked === on) return;
  liked = on; likes += on ? 1 : -1;
  likeBtn.classList.toggle('on', on); likeBtn.setAttribute('aria-pressed', String(on));
  likeN.textContent = NF.format(likes);
  if (reduce) return;
  likeN.animate([{transform: `translateY(${on ? 8 : -8}px)`, opacity: 0}, {transform: 'none', opacity: 1}], {duration: 320, easing: 'cubic-bezier(.16,1,.3,1)'});
  if (on){ const r = likeBtn.getBoundingClientRect(), t = likeTile.getBoundingClientRect(); particles(likeTile, r.right - t.left - 18, r.top - t.top + r.height / 2, 12, ['#B4483B', '#D9895E', '#E2B65E'], 30, 5); }
}
likeBtn.addEventListener('click', () => setLike(!liked));
function bigHeart(){
  if (reduce) return;
  lkBig.getAnimations().forEach(a => a.cancel());
  lkBig.animate([{opacity: 0, transform: 'scale(.3)'}, {opacity: 1, transform: 'scale(1.12)', offset: .35}, {opacity: 1, transform: 'scale(1)', offset: .6}, {opacity: 0, transform: 'scale(1.06) translateY(-10px)'}], {duration: 900, easing: 'ease-out'});
}
$('#lkImg').addEventListener('dblclick', () => { bigHeart(); setLike(true); });

/* ---------- demo cursor state (the Bento loop owns pause, hover and the ghost toggle) ---------- */
let demoI = 0;

/* ---------- ghost cursor ---------- */
const ghost = document.getElementById('dwGhost'); let gx = 0, gy = 0, ghostVisible = false;
function gPlace(x, y){ gx = x; gy = y; ghost.style.transform = `translate(${(x - 4).toFixed(1)}px, ${(y - 3).toFixed(1)}px)`; }
gPlace(innerWidth - 60, innerHeight - 40);
function gShow(){ if (!ghostVisible){ ghostVisible = true; ghost.classList.add('show'); } }
function gHide(){ if (ghostVisible){ ghostVisible = false; ghost.classList.remove('show', 'press'); } tiles.forEach(t => t.classList.remove('gh')); }
function hoverAt(x, y){ const el = document.elementFromPoint(x, y), t = el && el.closest ? el.closest('.tile') : null; tiles.forEach(tt => tt.classList.toggle('gh', tt === t)); }
function gMove(x, y, ms){
  const x0 = gx, y0 = gy, dx = x - x0, dy = y - y0, dist = Math.hypot(dx, dy) || 1;
  ms = ms || clamp(340 + dist * .55, 400, 980);
  const bend = Math.min(80, dist * .2) * (demoI % 2 ? 1 : -1), cx = x0 + dx / 2 - dy / dist * bend, cy = y0 + dy / 2 + dx / dist * bend;
  return tween(ms, e => { const u = 1 - e; gPlace(u * u * x0 + 2 * u * e * cx + e * e * x, u * u * y0 + 2 * u * e * cy + e * e * y); }, eInOut).then(() => hoverAt(x, y));
}
function center(el, fx = .5, fy = .5){ const r = el.getBoundingClientRect(); return [r.left + r.width * fx, r.top + r.height * fy]; }
function onScreen(el){ if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top > 10 && r.bottom < innerHeight - 10 && r.left >= 0 && r.right <= innerWidth; }
const gTo = (el, fx, fy) => { const [x, y] = center(el, fx, fy); return gMove(x, y); };
async function gClick(el){ ghost.classList.add('press'); await sleep(110); ghost.classList.remove('press', 'click'); void ghost.offsetWidth; ghost.classList.add('click'); if (el) el.click(); await sleep(240); }
const clickDemo = get => ({ el: get, run: async el => { await gTo(el); await gClick(el); } });
const DEMOS = [
  clickDemo(() => $('.pr-bell', prRows[prNextIdx])),
  clickDemo(() => plPlay),
  { el: () => kn, run: async el => {
      const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y0 = r.top + r.height / 2, from = knV, to = knV > 50 ? 20 : 84;
      await gMove(x, y0); ghost.classList.add('press'); kn.classList.add('drag');
      await tween(900, e => { setKnob(from + (to - from) * e); gPlace(x, y0 - (to - from) * e * .5); }, eInOut);
      kn.classList.remove('drag'); ghost.classList.remove('press'); } },
  { el: () => $('#vrNext'), run: async el => { await gTo(el); await gClick(el); await sleep(1300); } },
  { el: () => vsB.el, run: async el => {
      const r = el.getBoundingClientRect(), x = r.left + r.width / 2, from = vsB.get(), to = from > .5 ? .26 : .86;
      await gMove(x, r.bottom - from * r.height); ghost.classList.add('press'); el.classList.add('drag');
      await tween(800, e => { const v = from + (to - from) * e; vsB.set(v); gPlace(x, r.bottom - v * r.height); }, eInOut);
      el.classList.remove('drag'); ghost.classList.remove('press'); await sleep(120); } },
  { el: () => msgIn, run: async el => {
      await gTo(el, .7, .5); await gClick();
      const text = CHAT_DEMO[demoChat++ % CHAT_DEMO.length]; msgIn.value = '';
      for (const c of text){ await sleep(45); msgIn.value += c; }
      await sleep(220); await gTo(sendBtn); await gClick(); send(msgIn.value); msgIn.value = ''; } },
  { el: () => $('.td:not(.done)') || (resetTodos(), $('.td:not(.done)')), run: async el => { await gTo($('.box', el)); await gClick(el); } },
  { el: () => wlCard, run: async el => {
      const r = el.getBoundingClientRect();
      await gMove(r.left + r.width * .75, r.top + r.height * .3);
      await tween(900, e => { const px = .75 - e * .5, py = .3 + Math.sin(e * Math.PI) * .4; gPlace(r.left + r.width * px, r.top + r.height * py); tilt(px, py); }, eInOut);
      untilt(); const p = $('#wlPay'); if (!p.dataset.busy){ await gTo(p); await gClick(p); } } },
  { el: () => liked ? likeBtn : $('#lkImg'), run: async el => {
      if (liked){ await gTo(el); await gClick(el); return; }
      await gTo(el, .5, .4); await gClick(); await sleep(50); await gClick(); bigHeart(); setLike(true); } },
  clickDemo(() => $('#rgDay')),
  { el: () => stars[rating === 5 ? 2 : 4], run: async el => {
      const n = stars.indexOf(el) + 1; await gTo(stars[0]);
      for (let k = 0; k < n; k++){ const [x, y] = center(stars[k]); await gMove(x, y, 130); paintStars(k + 1); }
      await gClick(); rateTo(n); } },
  { el: () => chPlot, run: async el => {
      const r = el.getBoundingClientRect(), y = r.top + r.height * .5;
      await gMove(r.right - 10, y);
      await tween(1200, e => { const x = r.right - 10 - e * (r.width - 20); gPlace(x, y); chartHover(x); }, eInOut);
      await sleep(250); hideChart(); } },
  { el: () => liveNf()[0], run: async el => {
      const r = el.getBoundingClientRect(), x0 = r.left + r.width * .7, y = r.top + r.height / 2;
      await gMove(x0, y); ghost.classList.add('press'); el.style.transition = 'none';
      await tween(380, e => { const dx = -e * 160; el.style.transform = `translateX(${dx}px) rotate(${(dx * .02).toFixed(2)}deg)`; el.style.opacity = String(1 - e * .45); gPlace(x0 + dx, y); }, t => t * t);
      ghost.classList.remove('press'); dismissNf(el, -1); setTimeout(() => addNf(true), 900); } },
  clickDemo(() => swBtns[(swI + 2) % SW.length]),
  clickDemo(() => $('#prSeg button[aria-pressed="false"]')),
  clickDemo(() => wkDays[(calSel + 2) % 7]),
  { el: () => $('#phNext'), run: async el => { await gTo($('#photos'), .3, .5); await sleep(260); await gTo(el); await gClick(el); } },
  { el: () => boxes[0], run: async el => { await gTo(el); await gClick(); await otpType('428913'); await sleep(250); } },
  clickDemo(() => $('#plNext')),
  { el: () => cmdIn, run: async el => {
      await gTo(el, .75, .5); await gClick(); cmdIn.value = '';
      for (const c of 'التركيز'){ await sleep(110); cmdIn.value += c; cmdSel = 0; renderCmd(); }
      await sleep(800); cmdIn.value = ''; renderCmd(); } },
  { el: () => $('#inviteBtn').dataset.busy ? null : $('#inviteBtn'), run: async el => { await gTo(el); await gClick(el); } },
  clickDemo(() => $('#ccFocus')),
  clickDemo(() => $('#wxTemp')),
  clickDemo(() => $('#chSeg button[aria-pressed="false"]')),
  clickDemo(() => $('#swLock')),
  clickDemo(() => tmBtn)
];
async function ghostRun(alive, blocked = () => false){
  while (alive()){
    if (blocked()){ gHide(); await sleep(200); continue; }
    const d = DEMOS[demoI % DEMOS.length]; demoI++;
    let el = null; try { el = d.el(); } catch (err) { el = null; }
    if (!onScreen(el)){ await sleep(40); continue; }
    if (!ghostVisible){ const [sx, sy] = center(el); gPlace(clamp(sx - 150, 8, innerWidth - 8), clamp(sy + 110, 8, innerHeight - 8)); gShow(); await sleep(160); }
    try { await d.run(el); } catch (err) { /* keep looping */ }
    await sleep(420);
  }
  gHide();
}

/* ---------- entrance / exit (sweeps from the right, the start side) ---------- */
let live = [];
function delays(scale){
  const g = grid.getBoundingClientRect();
  return tiles.map(t => { const r = t.getBoundingClientRect(); return (((g.right - r.right) / Math.max(1, g.width)) * .55 + ((r.top - g.top) / Math.max(1, g.height)) * .45) * scale; });
}
const settle = list => Promise.all(list.map(a => a.finished.catch(() => {})));
const skipKid = c => c.classList.contains('noanim') || c.classList.contains('pt');
function animIn(){
  live.forEach(a => a.cancel()); live = [];
  if (reduce) return Promise.resolve();
  const ds = delays(640), all = [];
  tiles.forEach((t, i) => {
    const d = ds[i];
    all.push(t.animate([{opacity: 0, transform: 'translateY(22px) scale(.96)', filter: 'blur(6px)'}, {opacity: 1, transform: 'none', filter: 'blur(0px)'}], {duration: 1100, delay: d, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
    let j = 0;
    for (const c of Array.from(t.children)){
      if (skipKid(c)) continue;
      if (c.classList.contains('bleed')) all.push(c.animate([{transform: 'scale(1.14)'}, {transform: 'none'}], {duration: 1700, delay: d, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
      else all.push(c.animate([{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], {duration: 800, delay: d + 180 + j++ * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
    }
  });
  return settle(all);
}
function animOut(){
  if (reduce) return Promise.resolve();
  const ds = delays(420), all = [];
  tiles.forEach((t, i) => {
    const d = ds[i];
    for (const c of Array.from(t.children)){ if (skipKid(c) || c.classList.contains('bleed')) continue; all.push(c.animate([{opacity: 1}, {opacity: 0}], {duration: 260, delay: d, easing: 'ease-in', fill: 'forwards'})); }
    all.push(t.animate([{opacity: 1, transform: 'none', filter: 'blur(0px)'}, {opacity: 0, transform: 'translateY(-14px) scale(.97)', filter: 'blur(6px)'}], {duration: 680, delay: d + 70, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards'}));
  });
  live = all;
  return settle(all);
}
function onEnter(){
  if (reduce) return;
  ensureNf(3);
  setTimeout(() => {
    countUp($('#chNum'), total(range), 1200, sar);
    countUp($('#wlAmt'), wlBal, 1200, sar2, wlBal * .6);
    revealChart(); placeEnd();
    countUp(wxT, wxVal, 1000, v => ar(Math.round(v)));
    clockSweep(); vsB.intro(); vsV.intro(); tmIntro(); prayerIntro(); drawRings(true); knobIntro(); placeWk();
    const bar = $('#tdBar'); bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth; bar.style.transition = ''; tdSync();
  }, 380);
  setTimeout(() => addNf(true), 2600);
  setTimeout(() => incoming(0), 4200);
}

/* ---------- driven by the Bento Kit header and loop: Diwan is one style among nine ---------- */
const dwBackdrop = $('.backdrop');
renderCmd();
function relayout(){ syncSegs(); placeWk(); placeEnd(); }
function show(){
  dwBackdrop.getAnimations().forEach(a => a.cancel());
  kit.classList.remove('leaving'); kit.hidden = false;
  if (!reduce){ grid.style.visibility = 'hidden'; dwBackdrop.animate([{opacity: 0}, {opacity: 1}], {duration: 700, easing: 'ease'}); }
  relayout(); requestAnimationFrame(relayout); setTimeout(relayout, 320);
}
function hide(){
  gHide();
  if (kit.hidden) return;
  grid.style.visibility = '';
  if (reduce){ kit.hidden = true; return; }
  kit.classList.add('leaving');                 // the grid leaves the flow at once; only the fixed backdrop fades out
  const a = dwBackdrop.animate([{opacity: 1}, {opacity: 0}], {duration: 700, easing: 'ease', fill: 'forwards'});
  a.finished.then(() => { if (kit.classList.contains('leaving')){ kit.hidden = true; kit.classList.remove('leaving'); } a.cancel(); }, () => {});
}
window.DW = { show, hide, animIn(){ grid.style.visibility = ''; return animIn(); }, animOut, onEnter, ghostRun, gHide };
})();
