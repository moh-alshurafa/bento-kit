/* Bento Kit behaviours for demo/index.html: the eight Latin styles, the shared header and the loop.
   Reference code: it expects the demo's markup and ids. */

(() => {
'use strict';
const KIT = document.getElementById('kit');
const $ = (s, r = KIT) => r.querySelector(s);
const $$ = (s, r = KIT) => Array.from(r.querySelectorAll(s));
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
const countUp = (el, to, ms, fmt, from = 0) => tween(ms, e => { el.textContent = fmt(from + (to - from) * e); });
const money = v => '$' + Math.round(v).toLocaleString('en-US');
const money2 = v => '$' + v.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
const SVGNS = 'http://www.w3.org/2000/svg';
const kit = KIT, grid = $('#grid'), root = document.documentElement;
const tiles = $$('.tile', grid);
const SKINS = ['glass', 'graphite', 'hardware', 'brutal', 'riso', 'bitmap', 'aero', 'blueprint', 'diwan'];
const SKIN_NAME = {glass: 'Glass', graphite: 'Graphite', hardware: 'Hardware', brutal: 'Brutal', riso: 'Riso', bitmap: 'Bitmap', aero: 'Aero', blueprint: 'Blueprint', diwan: 'ديوان'};
const SKIN_SUB = {
  glass: 'Liquid Glass · frosted cards over rolling hills',
  graphite: 'Graphite · hairlines, mono labels, one amber glow',
  hardware: 'Hardware · beveled keys, LCD readouts, signal orange',
  brutal: 'Neo-Brutal · thick outlines, hard shadows, candy colours',
  riso: 'Riso · two fluorescent inks, halftone photos, offset print',
  bitmap: 'Bitmap · 1-bit windows, dithered photos, pixel type',
  aero: 'Aero · glossy gel buttons, sky gradients and bubbles',
  blueprint: 'Blueprint · cyanotype photos, dimension labels, drafting grid',
  diwan: 'Diwan · Arabic, right to left · porcelain and lime'
};
const ICON = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 4h3.8v16H6.5zM13.7 4h3.8v16h-3.8z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 10 18 19.5 7"/></svg>'
};
const SI = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const CMD_ICON = {
  palette: SI('<path d="M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.5-1.1a1.7 1.7 0 0 1 1.2-2.9H16a5 5 0 0 0 5-5C21 6.3 17 3 12 3z"/><circle cx="7.5" cy="11.5" r="1" fill="currentColor"/><circle cx="10.5" cy="7.5" r="1" fill="currentColor"/><circle cx="15.5" cy="8" r="1" fill="currentColor"/>'),
  music: SI('<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>'),
  moon: SI('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
  bell: SI('<path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
  image: SI('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-8 8"/>'),
  user: SI('<circle cx="10" cy="8" r="4"/><path d="M3 20a7 7 0 0 1 14 0M19 8v6M16 11h6"/>'),
  chat: SI('<path d="M4 5h16v11H9l-5 4z"/>')
};

/* ---------- images per skin ---------- */
let skin = 'glass';
const srcFor = b => skin === 'bitmap' ? b.replace('img/', 'img/1bit/').replace(/\.jpg$/, '.png') : b;
function applyImgs(){ $$('img[data-base]').forEach(im => { const b = im.dataset.base; if (!b) return; const s = srcFor(b); if (im.getAttribute('src') !== s) im.src = s; }); }

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

/* ---------- skins ---------- */
let pendingSkin = null, started = false;
const skinSeg = seg($('#skinSeg'), 'aria-selected', b => requestSkin(b.dataset.skin));
function markSkinTab(s){
  const b = skinSeg.btns.find(x => x.dataset.skin === s); skinSeg.select(b);
  const sc = $('#skinSeg');
  if (sc.scrollWidth > sc.clientWidth + 2) sc.scrollTo({left: b.offsetLeft - (sc.clientWidth - b.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth'});
}
function setSkin(s){
  const was = skin;
  skin = s; kit.dataset.skin = s; root.dataset.skin = s;
  if (window.DW){ if (s === 'diwan') window.DW.show(); else if (was === 'diwan') window.DW.hide(); }
  $('#skinSub').textContent = SKIN_SUB[s];
  markSkinTab(s); applyImgs();
  requestAnimationFrame(() => { syncSegs(); updateDims(); });
  setTimeout(syncSegs, 400); setTimeout(() => { syncSegs(); updateDims(); }, 1200);
  loopProgress(0); renderCmd(); renderSwatchLabel();
  if (!reduce) $('#bar').animate([{opacity: .25, transform: 'translateY(-6px)'}, {opacity: 1, transform: 'none'}], {duration: 520, easing: 'cubic-bezier(.16,1,.3,1)'});
}
function requestSkin(s){
  if (reduce || !started){ setSkin(s); return; }
  if (s === skin){ pendingSkin = null; markSkinTab(s); return; }
  pendingSkin = s; markSkinTab(s);
}
function updateDims(){
  if (skin !== 'blueprint') return;
  tiles.forEach(t => {
    let d = t.querySelector(':scope > .dim');
    if (!d){ d = document.createElement('i'); d.className = 'dim noanim'; d.setAttribute('aria-hidden', 'true'); t.appendChild(d); }
    d.textContent = `${t.offsetWidth} × ${t.offsetHeight}`;
  });
}
let dimT = 0;
addEventListener('resize', () => { clearTimeout(dimT); dimT = setTimeout(updateDims, 200); });

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

/* ---------- player ---------- */
const tracks = [
  {t: 'Low Tide Signal', a: 'Marrow & Vale', art: 'img/art-tide.jpg', d: 228},
  {t: 'Rose City', a: 'Nour Atlas', art: 'img/art-petra.jpg', d: 201},
  {t: 'Sea Cave Sessions', a: 'The Hollow Coast', art: 'img/art-cave.jpg', d: 254},
  {t: 'Blue Hour', a: 'Dune Theory', art: 'img/art-blue.jpg', d: 187}
];
const fmtT = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const player = $('#player'), plBar = $('#plBar'), plPlay = $('#plPlay');
let ti = 0, pos = 72, playing = false, ptimer = 0;
const eqEl = $('#plEq');
for (let i = 0; i < 18; i++){ const b = document.createElement('i'); b.style.setProperty('--d', (-Math.random() * 1.2).toFixed(2) + 's'); b.style.height = Math.round(18 + Math.random() * 62) + '%'; eqEl.appendChild(b); }
function drawPos(){ const d = tracks[ti].d; plBar.style.setProperty('--p', (pos / d * 100).toFixed(2) + '%'); $('#plCur').textContent = fmtT(pos); $('#plDur').textContent = '-' + fmtT(d - pos); plBar.setAttribute('aria-valuenow', String(Math.round(pos))); plBar.setAttribute('aria-valuemax', String(d)); }
function setPlaying(on){
  playing = on; player.classList.toggle('playing', on);
  plPlay.innerHTML = on ? ICON.pause : ICON.play; plPlay.setAttribute('aria-label', on ? 'Pause' : 'Play');
  clearInterval(ptimer);
  if (on) ptimer = setInterval(() => { pos += 1; if (pos >= tracks[ti].d) loadTrack(ti + 1, 1); else drawPos(); }, 1000);
}
function loadTrack(i, dir){
  ti = (i + tracks.length) % tracks.length; pos = 0;
  const tr = tracks[ti], imgs = $$('#plArt img'), on = imgs.find(x => x.classList.contains('on')) || imgs[0], off = imgs.find(x => x !== on);
  off.dataset.base = tr.art; off.src = srcFor(tr.art); off.alt = 'Album art for ' + tr.t;
  const swap = () => { off.classList.add('on'); on.classList.remove('on'); on.alt = ''; };
  if (off.decode) off.decode().then(swap, swap); else swap();
  const meta = $('#plMeta');
  meta.animate([{opacity: 1, transform: 'none'}, {opacity: 0, transform: `translateX(${-16 * dir}px)`}], {duration: 170, easing: 'ease-in'}).finished.then(() => {
    $('#plTitle').textContent = tr.t; $('#plArtist').textContent = tr.a;
    meta.animate([{opacity: 0, transform: `translateX(${16 * dir}px)`}, {opacity: 1, transform: 'none'}], {duration: 420, easing: 'cubic-bezier(.16,1,.3,1)'});
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
  if (on && !reduce) b.animate([{transform: 'scale(1)'}, {transform: 'scale(1.35)'}, {transform: 'scale(1)'}], {duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)'});
});
const seekAt = x => { const r = plBar.getBoundingClientRect(); pos = clamp((x - r.left) / r.width, 0, 1) * (tracks[ti].d - 1); drawPos(); };
plBar.addEventListener('pointerdown', e => { plBar.setPointerCapture(e.pointerId); plBar.classList.add('drag'); seekAt(e.clientX); });
plBar.addEventListener('pointermove', e => { if (plBar.classList.contains('drag')) seekAt(e.clientX); });
['pointerup', 'pointercancel'].forEach(t => plBar.addEventListener(t, () => plBar.classList.remove('drag')));
plBar.addEventListener('keydown', e => { if (e.key === 'ArrowRight'){ pos = Math.min(tracks[ti].d - 1, pos + 5); drawPos(); } else if (e.key === 'ArrowLeft'){ pos = Math.max(0, pos - 5); drawPos(); } });
drawPos();

/* ---------- photos ---------- */
const photos = [
  {t: 'Reef, from above', m: 'Coast · 24 photos'},
  {t: 'The freight yard', m: 'Rail trip · 18 photos'},
  {t: 'Green room pool', m: 'Weekend away · 31 photos'},
  {t: 'Last light', m: 'Evening walk · 9 photos'}
];
const phImgs = $$('#phStack img'), phDots = $('#phDots'); let pi = 0;
photos.forEach((p, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show ' + p.t); b.addEventListener('click', () => showPhoto(i)); phDots.appendChild(b); });
function showPhoto(i){
  pi = (i + photos.length) % photos.length;
  phImgs.forEach((im, k) => im.classList.toggle('on', k === pi));
  $('#phTitle').textContent = photos[pi].t; $('#phMeta').textContent = photos[pi].m;
  if (!reduce) [$('#phTitle'), $('#phMeta')].forEach((el, k) => el.animate([{opacity: 0, transform: 'translateY(6px)'}, {opacity: 1, transform: 'none'}], {duration: 460, delay: k * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
  $$('button', phDots).forEach((d, k) => { d.classList.remove('on'); if (k === pi){ void d.offsetWidth; d.classList.add('on'); } });
}
phDots.addEventListener('animationend', e => { if (e.animationName === 'dotfill' && !reduce) showPhoto(pi + 1); });
$('#phPrev').addEventListener('click', () => showPhoto(pi - 1));
$('#phNext').addEventListener('click', () => showPhoto(pi + 1));
showPhoto(0);

/* ---------- week calendar ---------- */
const WEEK = [
  {d: 'Mon', n: 9, ev: null}, {d: 'Tue', n: 10, ev: ['10:00', 'Team standup']}, {d: 'Wed', n: 11, ev: ['14:30', 'Design review'], today: true},
  {d: 'Thu', n: 12, ev: ['09:30', 'Dentist']}, {d: 'Fri', n: 13, ev: ['18:00', 'Launch party']}, {d: 'Sat', n: 14, ev: null}, {d: 'Sun', n: 15, ev: ['11:00', 'Brunch with Lina']}
];
const wk = $('#wk'), wkPill = $('.wk-pill', wk); let calSel = 2;
WEEK.forEach((w, i) => {
  const b = document.createElement('button'); b.type = 'button';
  b.className = 'wk-d' + (w.ev ? ' has' : '') + (w.today ? ' today' : '');
  b.setAttribute('role', 'tab'); b.setAttribute('aria-label', `${w.d} ${w.n} November`);
  b.innerHTML = `<span>${w.d[0]}</span><b>${w.n}</b><i class="dot"></i>`;
  b.addEventListener('click', () => pickDay(i));
  wk.appendChild(b);
});
const wkDays = $$('.wk-d', wk);
function placeWk(){ const b = wkDays[calSel]; if (!b.offsetWidth) return; wkPill.style.width = b.offsetWidth + 'px'; wkPill.style.transform = `translateX(${b.offsetLeft}px)`; }
function pickDay(i){
  calSel = i; wkDays.forEach((b, k) => b.setAttribute('aria-selected', String(k === i))); placeWk();
  const w = WEEK[i], ev = $('#calEv');
  $('#calSel').textContent = `${w.d} ${w.n}`;
  ev.classList.toggle('none', !w.ev);
  ev.innerHTML = w.ev ? `<i></i><b>${w.ev[0]}</b><span>${w.ev[1]}</span>` : '<i></i><span>Nothing planned</span>';
  if (!reduce) ev.animate([{opacity: 0, transform: 'translateY(6px)'}, {opacity: 1, transform: 'none'}], {duration: 380, easing: 'cubic-bezier(.16,1,.3,1)'});
}
segPlacers.push(placeWk);
if ('ResizeObserver' in window) new ResizeObserver(placeWk).observe(wk);
pickDay(2);

/* ---------- weather ---------- */
let wxC = true; const wxT = $('#wxT');
$('#wxTemp').addEventListener('click', () => {
  wxC = !wxC; const from = parseInt(wxT.textContent, 10) || 0;
  countUp(wxT, wxC ? 21 : 70, 650, v => Math.round(v), from);
  $('#wxU').textContent = wxC ? '°C' : '°F';
  $('#wxMeta').textContent = wxC ? 'Windy · H 24° L 16°' : 'Windy · H 75° L 61°';
});

/* ---------- clock ---------- */
const clkH = $('#clkH'), clkM = $('#clkM'), clkS = $('#clkS'), ticksG = $('#clkTicks'), clkDig = $('#clkDig');
for (let i = 0; i < 12; i++){
  const a = i * Math.PI / 6, q = i % 3 === 0, r1 = q ? 35 : 38.5, r2 = 42.5;
  const l = document.createElementNS(SVGNS, 'line');
  l.setAttribute('x1', (50 + Math.sin(a) * r1).toFixed(2)); l.setAttribute('y1', (50 - Math.cos(a) * r1).toFixed(2));
  l.setAttribute('x2', (50 + Math.sin(a) * r2).toFixed(2)); l.setAttribute('y2', (50 - Math.cos(a) * r2).toFixed(2));
  if (q) l.setAttribute('class', 'q');
  ticksG.appendChild(l);
}
let sweepAt = 0, h24 = true, lastDig = '';
const clockSweep = () => { sweepAt = performance.now(); };
function clockFrame(now){
  const d = new Date(), s = d.getSeconds() + d.getMilliseconds() / 1000, m = d.getMinutes() + s / 60, h = d.getHours() % 12 + m / 60;
  let k = 1;
  if (sweepAt){ const t = (now - sweepAt) / 1500; if (t >= 1) sweepAt = 0; else k = 1 - Math.pow(1 - clamp(t, 0, 1), 4); }
  clkH.style.transform = `rotate(${(h * 30 * k).toFixed(2)}deg)`;
  clkM.style.transform = `rotate(${(m * 6 * k).toFixed(2)}deg)`;
  clkS.style.transform = `rotate(${((reduce ? Math.floor(s) : s) * 6 * k).toFixed(2)}deg)`;
  const hr = d.getHours(), hh = h24 ? hr : (hr % 12 || 12);
  const dig = `${String(hh).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}${h24 ? '' : (hr < 12 ? ' AM' : ' PM')}`;
  if (dig !== lastDig){ clkDig.textContent = dig; lastDig = dig; }
  requestAnimationFrame(clockFrame);
}
requestAnimationFrame(clockFrame);
clkDig.addEventListener('click', () => { h24 = !h24; lastDig = ''; });

/* ---------- controls ---------- */
$$('.cc-btn').forEach(b => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', String(on));
  $('small', b).textContent = on ? b.dataset.on : 'Off';
  if (!reduce) $('.cc-ic', b).animate([{transform: 'scale(.78)', offset: .3}, {transform: 'scale(1.14)', offset: .65}], {duration: 480, easing: 'ease-out'});
}));
$$('.switch').forEach(s => s.addEventListener('click', () => s.setAttribute('aria-checked', String(s.getAttribute('aria-checked') !== 'true'))));

/* ---------- sliders ---------- */
const vsLbl = $('#vsLbl'), vsRead = $('#vsRead');
function vslider(el, v0, name, extra){
  let v = v0, dragging = false;
  const set = (nv, quiet) => {
    v = clamp(nv, 0, 1); el.style.setProperty('--v', v.toFixed(3)); el.classList.toggle('low', v < .16);
    el.setAttribute('aria-valuenow', String(Math.round(v * 100)));
    if (extra) extra(v);
    if (!quiet){ vsLbl.textContent = name; vsRead.textContent = Math.round(v * 100) + '%'; }
  };
  const raw = e => { const r = el.getBoundingClientRect(); return 1 - (e.clientY - r.top) / r.height; };
  const move = e => {
    if (!dragging) return;
    const rv = raw(e); set(rv);
    const over = rv > 1 ? rv - 1 : rv < 0 ? rv : 0;
    if (over){ const o = Math.min(.5, Math.abs(over)); el.style.transformOrigin = over > 0 ? '50% 100%' : '50% 0%'; el.style.transform = `scaleY(${(1 + o * .16).toFixed(3)}) scaleX(${(1 - o * .08).toFixed(3)})`; }
    else el.style.transform = '';
  };
  el.addEventListener('pointerdown', e => { dragging = true; el.setPointerCapture(e.pointerId); el.classList.add('drag'); move(e); });
  el.addEventListener('pointermove', move);
  const up = () => { dragging = false; el.classList.remove('drag'); el.style.transform = ''; };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  el.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight'){ e.preventDefault(); set(v + .05); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft'){ e.preventDefault(); set(v - .05); }
  });
  set(v0, true);
  return {
    set, el, get: () => v,
    intro(){ const t = v; el.classList.add('drag'); set(0, true); void el.offsetHeight; el.classList.remove('drag'); requestAnimationFrame(() => set(t, true)); setTimeout(() => { if (!dragging && v === 0) set(t, true); }, 140); }
  };
}
const vsB = vslider($('#vsB'), .64, 'Brightness');
const vsV = vslider($('#vsV'), .42, 'Volume', v => { $('#vsV').dataset.lvl = v < .02 ? '0' : v < .45 ? '1' : '2'; });

/* ---------- notifications ---------- */
const people = [
  {n: 'Lina Haddad', av: 'img/av-owl.jpg', m: 'Can we ship the yearly toggle today?'},
  {n: 'Omar Saleh', av: 'img/av-parrot.jpg', m: 'Left 3 comments on Pricing v4'},
  {n: 'Deploy bot', av: 'img/av-penguin.jpg', m: 'harbour-web is live on production · 42s'},
  {n: 'Maya Chen', av: 'img/av-zebra.jpg', m: 'Shared 24 photos with you'},
  {n: 'Sami Nasser', av: 'img/av-eagle.jpg', m: 'Booked the studio for Thursday 10:00'}
];
const nfList = $('#nfList'), nfEmpty = $('#nfEmpty'); let np = 0;
const liveNf = () => $$('.nf', nfList).filter(x => !x.dataset.gone);
function nfEl(p, time){
  const el = document.createElement('div'); el.className = 'nf';
  el.innerHTML = '<img class="nf-av" alt=""><div class="nf-body"><div class="nf-top"><b></b><time></time></div><p></p></div><button type="button" class="nf-x" aria-label="Dismiss">' + SI('<path d="M7 7l10 10M17 7 7 17"/>') + '</button>';
  const im = $('img', el); im.dataset.base = p.av; im.src = srcFor(p.av);
  $('b', el).textContent = p.n; $('time', el).textContent = time; $('p', el).textContent = p.m;
  $('.nf-x', el).addEventListener('click', ev => { ev.stopPropagation(); dismissNf(el, 1); });
  swipeable(el);
  return el;
}
function addNf(animate){
  const p = people[np++ % people.length];
  $$('.nf time', nfList).forEach(t => { if (t.textContent === 'now') t.textContent = '1m'; });
  const el = nfEl(p, 'now'); nfList.prepend(el); nfEmpty.hidden = true;
  if (animate && !reduce) el.animate([{opacity: 0, transform: 'translateY(-18px) scale(.95)'}, {opacity: 1, transform: 'none'}], {duration: 560, easing: 'cubic-bezier(.34,1.56,.64,1)'});
  liveNf().slice(4).forEach(x => dismissNf(x, 0));
}
function dismissNf(el, dir){
  if (el.dataset.gone) return; el.dataset.gone = '1';
  const cs = getComputedStyle(el), h = el.offsetHeight, pt = cs.paddingTop, pb = cs.paddingBottom;
  el.style.transition = 'none';
  const out = dir ? [{transform: cs.transform === 'none' ? 'none' : cs.transform, opacity: cs.opacity}, {transform: `translateX(${dir * 115}%) rotate(${dir * 5}deg)`, opacity: 0}] : [{opacity: 1}, {opacity: 0}];
  const finish = () => { el.remove(); if (!liveNf().length) nfEmpty.hidden = false; };
  if (reduce){ finish(); return; }
  el.animate(out, {duration: dir ? 320 : 220, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards'}).finished
    .then(() => el.animate([{height: h + 'px', paddingTop: pt, paddingBottom: pb, marginBottom: '0px'}, {height: '0px', paddingTop: '0px', paddingBottom: '0px', marginBottom: '-8px'}], {duration: 280, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards'}).finished)
    .then(finish, finish);
}
function swipeable(el){
  let x0 = null, dx = 0;
  el.addEventListener('pointerdown', e => { if (e.target.closest('.nf-x') || el.dataset.gone) return; x0 = e.clientX; dx = 0; el.setPointerCapture(e.pointerId); el.style.transition = 'none'; el.classList.add('grab'); });
  el.addEventListener('pointermove', e => { if (x0 === null) return; dx = e.clientX - x0; el.style.transform = `translateX(${dx}px) rotate(${(dx * .025).toFixed(2)}deg)`; el.style.opacity = String(1 - Math.min(.6, Math.abs(dx) / 320)); });
  const end = () => { if (x0 === null) return; x0 = null; el.classList.remove('grab'); el.style.transition = ''; if (Math.abs(dx) > 80) dismissNf(el, Math.sign(dx)); else { el.style.transform = ''; el.style.opacity = ''; } };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}
$('#nfClear').addEventListener('click', () => liveNf().forEach((el, i) => setTimeout(() => dismissNf(el, 1), i * 70)));
function ensureNf(n){ for (let i = liveNf().length; i < n; i++) addNf(false); }
[['now', 0], ['4m', 1], ['12m', 2], ['1h', 3]].forEach(([t, k]) => nfList.insertBefore(nfEl(people[k], t), nfEmpty));
np = 4;

/* ---------- search ---------- */
const cmdIn = $('#cmdIn'), cmdList = $('#cmdList'); let cmdSel = 0, cmdShown = [];
function cmds(){
  const next = SKINS[(SKINS.indexOf(skin) + 1) % SKINS.length];
  const skinCmd = s => ({t: 'Switch style to ' + SKIN_NAME[s], i: 'palette', k: 'S', run: () => requestSkin(s)});
  return [
    {t: 'Play “' + tracks[0].t + '”', i: 'music', k: 'P', run: () => { if (ti !== 0) loadTrack(0, 1); setPlaying(true); }},
    skinCmd(next),
    {t: 'Turn on Focus', i: 'moon', k: 'F', run: () => { const b = $('#ccFocus'); if (b.getAttribute('aria-pressed') !== 'true') b.click(); }},
    {t: 'Message Lina', i: 'chat', k: 'M', run: () => msgIn.focus()},
    {t: 'Clear notifications', i: 'bell', k: 'C', run: () => $('#nfClear').click()},
    {t: 'Next memory', i: 'image', k: 'N', run: () => showPhoto(pi + 1)},
    {t: 'Invite a teammate', i: 'user', k: 'I', run: () => $('#inviteBtn').click()},
    ...SKINS.filter(s => s !== skin && s !== next).map(skinCmd)
  ];
}
function markSel(){ $$('li[data-i]', cmdList).forEach(li => li.setAttribute('aria-selected', String(+li.dataset.i === cmdSel))); }
function renderCmd(){
  const q = cmdIn.value.trim().toLowerCase();
  cmdShown = cmds().filter(c => c.t.toLowerCase().includes(q));
  cmdSel = clamp(cmdSel, 0, Math.max(0, cmdShown.length - 1));
  cmdList.innerHTML = cmdShown.length ? cmdShown.map((c, i) => `<li role="option" aria-selected="${i === cmdSel}" data-i="${i}"><span class="ci">${CMD_ICON[c.i]}</span><span class="ct"></span><kbd>⌘${c.k}</kbd></li>`).join('') : '<li class="empty">No matches</li>';
  $$('li[data-i]', cmdList).forEach((li, i) => { $('.ct', li).textContent = cmdShown[i].t; });
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

/* ---------- todo ---------- */
const tds = $$('.td'), todoTile = $('#todoTile');
function tdSync(){ const d = tds.filter(t => t.classList.contains('done')).length; $('#tdCount').textContent = `${d}/${tds.length}`; $('#tdBar').style.width = (d / tds.length * 100) + '%'; return d; }
tds.forEach(t => t.addEventListener('click', () => {
  const on = !t.classList.contains('done');
  t.classList.toggle('done', on); t.setAttribute('aria-checked', String(on));
  if (on){ t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop'); }
  if (tdSync() === tds.length){ const b = $('.td-bar', todoTile), r = b.getBoundingClientRect(), tr = todoTile.getBoundingClientRect(); particles(todoTile, r.left - tr.left + r.width / 2, r.top - tr.top, 22, ['#FF6A3D', '#13A35B', '#F4A11C', '#3C9BE0'], 90, 6); }
}));
function resetTodos(){ tds.forEach((t, i) => { const on = i < 2; t.classList.toggle('done', on); t.setAttribute('aria-checked', String(on)); }); tdSync(); }
tdSync();

/* ---------- chart ---------- */
const DATA = {
  7: {lab: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], v: [5.8, 6.4, 6.1, 7.6, 8.2, 6.9, 7.2], total: 48210, d: '+12.4%'},
  30: {lab: ['Oct 12', 'Oct 17', 'Oct 22', 'Oct 27', 'Nov 1', 'Nov 6', 'Nov 11'], v: [24.1, 27.9, 26.2, 29.8, 31.4, 28.6, 28.9], total: 196880, d: '+8.1%'},
  90: {lab: ['Aug 13', 'Aug 28', 'Sep 12', 'Sep 27', 'Oct 12', 'Oct 27', 'Nov 11'], v: [68.2, 71.5, 74.9, 79.3, 77.6, 83.4, 86.4], total: 541300, d: '+21.7%'}
};
const CW = 600, CH = 120; let range = 7, pts = [];
function smooth(p){
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++){
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
function buildChart(){
  const ds = DATA[range], mn = Math.min(...ds.v) * .86, mx = Math.max(...ds.v) * 1.05;
  pts = ds.v.map((v, i) => [i * CW / (ds.v.length - 1), 8 + (1 - (v - mn) / (mx - mn)) * (CH - 12)]);
  const d = smooth(pts);
  $('#chLine').setAttribute('d', d); $('#chArea').setAttribute('d', d + ` L${CW},${CH} L0,${CH} Z`);
  $('#chDelta').textContent = ds.d;
}
const ch = $('#ch'), chX = $('#chX'), chDot = $('#chDot'), chTip = $('#chTip');
function chartHover(clientX){
  const r = ch.getBoundingClientRect(), x = clamp((clientX - r.left) / r.width, 0, 1) * CW;
  const i = clamp(Math.round(x / (CW / (pts.length - 1))), 0, pts.length - 1), [px, py] = pts[i];
  const lx = px / CW * r.width, ly = py / CH * r.height;
  ch.classList.add('hov');
  chX.style.left = lx + 'px'; chDot.style.left = lx + 'px'; chDot.style.top = ly + 'px';
  chTip.textContent = `${DATA[range].lab[i]} · $${DATA[range].v[i].toFixed(1)}k`;
  chTip.style.left = clamp(lx, 46, r.width - 46) + 'px'; chTip.style.top = Math.max(ly, 18) + 'px';
}
ch.addEventListener('pointermove', e => chartHover(e.clientX));
ch.addEventListener('pointerleave', () => ch.classList.remove('hov'));
seg($('#chSeg'), 'aria-pressed', b => {
  const from = parseInt($('#chNum').textContent.replace(/\D/g, ''), 10) || 0;
  range = +b.dataset.r; buildChart();
  countUp($('#chNum'), DATA[range].total, 700, money, from);
});
const revealChart = () => $('#chSvg').animate([{clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0% 0 0)'}], {duration: 1300, easing: 'cubic-bezier(.65,0,.35,1)'});
buildChart();

/* ---------- price + busy buttons ---------- */
const PR = {m: {p: '$18', per: '/ month'}, y: {p: '$173', per: '/ year'}};
function roll(box, text, dir){
  const old = box.lastElementChild, nu = document.createElement('b'); nu.textContent = text; box.appendChild(nu);
  if (reduce){ old.remove(); return; }
  nu.animate([{transform: `translateY(${dir * 100}%)`, opacity: 0}, {transform: 'none', opacity: 1}], {duration: 480, easing: 'cubic-bezier(.34,1.56,.64,1)'});
  old.animate([{transform: 'none', opacity: 1}, {transform: `translateY(${-dir * 100}%)`, opacity: 0}], {duration: 320, easing: 'ease-in', fill: 'forwards'}).finished.then(() => old.remove(), () => old.remove());
}
seg($('#prSeg'), 'aria-pressed', b => { const k = b.dataset.b; roll($('#prRoll'), PR[k].p, k === 'y' ? 1 : -1); $('#prPer').textContent = PR[k].per; $('#prSave').classList.toggle('show', k === 'y'); });
async function busy(btn, idle, working, done, after){
  if (btn.dataset.busy) return; btn.dataset.busy = '1';
  btn.style.minWidth = btn.offsetWidth + 'px';
  btn.innerHTML = `<span class="spin"></span><span>${working}</span>`;
  await sleep(1050);
  btn.classList.add('ok'); btn.innerHTML = ICON.check + `<span>${done}</span>`;
  if (!reduce) btn.animate([{transform: 'scale(.94)'}, {transform: 'scale(1.04)'}, {transform: 'none'}], {duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)'});
  if (after) after();
  await sleep(1900);
  btn.classList.remove('ok'); btn.textContent = idle; btn.style.minWidth = ''; delete btn.dataset.busy;
}
$('#prBtn').addEventListener('click', e => busy(e.currentTarget, 'Upgrade', 'Processing', 'Upgraded'));
let teamMore = 5;
$('#inviteBtn').addEventListener('click', e => busy(e.currentTarget, 'Invite', 'Sending', 'Sent', () => {
  const m = $('#avMore'); teamMore++; m.textContent = '+' + teamMore;
  if (!reduce) m.animate([{transform: 'scale(.6)'}, {transform: 'scale(1.2)'}, {transform: 'none'}], {duration: 450, easing: 'cubic-bezier(.34,1.56,.64,1)'});
}));

/* ---------- chat ---------- */
const msgs = $('#msgs'), msgIn = $('#msgIn'), sendBtn = $('#sendBtn'), LINA = 'img/av-owl.jpg';
const REPLIES = ['Looks amazing on my screen', 'Hardware is my favourite so far', 'Can we ship it tonight?', 'That poppy photo is so good', 'Riso would make a great poster', 'Okay, I’m sold on Aero'];
const CHAT_DEMO = ['Link is up, check the loop', 'Try the Bitmap style', 'Recording the demo now'];
let rq = 0, replyT = 0, demoChat = 0;
function avatarImg(cls){ const im = document.createElement('img'); im.className = cls; im.alt = ''; im.dataset.base = LINA; im.src = srcFor(LINA); return im; }
function bubble(kind, text, animate){
  const el = document.createElement('div'); el.className = 'msg ' + kind;
  if (kind === 'in') el.appendChild(avatarImg('msg-av'));
  const p = document.createElement('p'); p.textContent = text; el.appendChild(p);
  msgs.appendChild(el);
  if (animate && !reduce) el.animate([{opacity: 0, transform: 'translateY(10px) scale(.9)', transformOrigin: kind === 'out' ? '100% 100%' : '0 100%'}, {opacity: 1, transform: 'none', transformOrigin: kind === 'out' ? '100% 100%' : '0 100%'}], {duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)'});
  const all = $$('.msg', msgs); all.slice(0, Math.max(0, all.length - 7)).forEach(m => m.remove());
  return el;
}
function typing(){ const el = document.createElement('div'); el.className = 'msg in typing'; el.appendChild(avatarImg('msg-av')); const p = document.createElement('p'); p.innerHTML = '<i></i><i></i><i></i>'; el.appendChild(p); msgs.appendChild(el); if (!reduce) el.animate([{opacity: 0, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}], {duration: 300, easing: 'ease-out'}); return el; }
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
bubble('in', 'Are we still on for the launch tonight?', false);
bubble('out', 'Yes! The loop is recording now', false);
bubble('in', 'Send me the bento link when it’s up', false);

/* ---------- ride ---------- */
const rdRoute = $('#rdRoute'), rdCar = $('#rdCar'), rdEta = $('#rdEta'), rdStatus = $('#rdStatus'), rdLbl = $('#rdLbl'), rdMin = $('#rdMin');
const rdLen = rdRoute.getTotalLength();
let rdT = .16, rdLast = performance.now(), lastEta = -1, rdAng = 0, rdHold = '';
const RIDE_MS = 42000;
function rideFrame(now){
  const dt = Math.min(64, now - rdLast); rdLast = now;
  if (!reduce) rdT += dt / RIDE_MS;
  if (rdT > 1.12) rdT = 0;
  const t = Math.min(1, rdT), at = t * rdLen, p = rdRoute.getPointAtLength(at);
  if (t < 1){ const p2 = rdRoute.getPointAtLength(Math.min(rdLen, at + 1)); rdAng = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI + 90; }
  rdCar.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${rdAng.toFixed(0)})`);
  const eta = Math.max(0, Math.ceil((1 - t) * 8));
  if (eta !== lastEta){ lastEta = eta; rdEta.textContent = eta; rdLbl.textContent = eta ? 'Arriving in' : 'Arrived'; rdEta.hidden = !eta; rdMin.hidden = !eta; if (!rdHold) rdStatus.textContent = eta ? 'On the way to Harbour St' : 'Sami has arrived'; }
  requestAnimationFrame(rideFrame);
}
requestAnimationFrame(rideFrame);
function rideStatus(text, ms){ rdHold = text; rdStatus.textContent = text; setTimeout(() => { if (rdHold === text){ rdHold = ''; rdStatus.textContent = lastEta ? 'On the way to Harbour St' : 'Sami has arrived'; } }, ms); }
$('#rdCall').addEventListener('click', e => {
  const b = e.currentTarget, on = !b.classList.contains('on');
  b.classList.toggle('on', on); b.setAttribute('aria-label', on ? 'End call' : 'Call driver');
  if (on){ rideStatus('Calling Sami…', 2600); setTimeout(() => { b.classList.remove('on'); b.setAttribute('aria-label', 'Call driver'); }, 2600); }
  else rideStatus('Call ended', 1200);
});
$('#rdMsg').addEventListener('click', e => { rideStatus('Message sent: “I’m outside”', 2000); if (!reduce) e.currentTarget.animate([{transform: 'rotate(0)'}, {transform: 'rotate(-12deg)'}, {transform: 'rotate(10deg)'}, {transform: 'none'}], {duration: 420}); });

/* ---------- flip countdown ---------- */
const flipEl = $('#flip'), fds = [];
for (let i = 0; i < 6; i++){
  if (i === 2 || i === 4){ const c = document.createElement('span'); c.className = 'fsep'; c.textContent = ':'; flipEl.appendChild(c); }
  const d = document.createElement('span'); d.className = 'fd';
  d.innerHTML = '<span class="fd-h fd-u"><b>0</b></span><span class="fd-h fd-l"><b>0</b></span><span class="fd-h fd-fu"><b>0</b></span><span class="fd-h fd-fl"><b>0</b></span>';
  flipEl.appendChild(d);
  fds.push({el: d, v: '0', u: $('.fd-u b', d), l: $('.fd-l b', d), fu: $('.fd-fu b', d), fl: $('.fd-fl b', d), FU: $('.fd-fu', d), FL: $('.fd-fl', d)});
}
function setDigit(o, nv, animate){
  if (o.v === nv) return;
  const old = o.v; o.v = nv;
  o.FU.getAnimations().forEach(a => a.cancel()); o.FL.getAnimations().forEach(a => a.cancel());
  if (!animate || reduce){ o.u.textContent = o.l.textContent = o.fu.textContent = o.fl.textContent = nv; return; }
  o.u.textContent = nv; o.fu.textContent = old; o.l.textContent = old; o.fl.textContent = nv;
  o.FU.animate([{transform: 'rotateX(0deg)'}, {transform: 'rotateX(-90deg)'}], {duration: 230, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards'}).finished.then(() =>
    o.FL.animate([{transform: 'rotateX(90deg)'}, {transform: 'rotateX(0deg)'}], {duration: 260, easing: 'cubic-bezier(0,.55,.45,1)', fill: 'forwards'}).finished
  ).then(() => { if (o.v !== nv) return; o.l.textContent = nv; o.fu.textContent = nv; o.FU.getAnimations().forEach(a => a.cancel()); o.FL.getAnimations().forEach(a => a.cancel()); }, () => {});
}
let flipEnd = Date.now() + (2 * 3600 + 14 * 60 + 9) * 1000;
function flipTick(animate){
  let s = Math.max(0, Math.round((flipEnd - Date.now()) / 1000));
  if (s === 0){ flipEnd = Date.now() + 8049000; s = 8049; }
  const str = String(Math.floor(s / 3600)).padStart(2, '0') + String(Math.floor(s % 3600 / 60)).padStart(2, '0') + String(s % 60).padStart(2, '0');
  [...str].forEach((c, i) => setDigit(fds[i], c, animate));
}
flipTick(false); setInterval(() => flipTick(true), 1000);
$('#flipRemind').addEventListener('click', e => {
  const b = e.currentTarget, on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Reminder on' : 'Remind me';
  if (on && !reduce) b.animate([{transform: 'rotate(0)'}, {transform: 'rotate(-8deg)'}, {transform: 'rotate(7deg)'}, {transform: 'rotate(-4deg)'}, {transform: 'none'}], {duration: 520});
});

/* ---------- wallet ---------- */
const wlCard = $('#wlCard'); let wlFlipped = false, wlBal = 2480.15;
function tilt(px, py){
  wlCard.style.setProperty('--ry', ((px - .5) * 22).toFixed(1) + 'deg'); wlCard.style.setProperty('--rx', ((.5 - py) * 18).toFixed(1) + 'deg');
  wlCard.style.setProperty('--gx', (px * 100).toFixed(0) + '%'); wlCard.style.setProperty('--gy', (py * 100).toFixed(0) + '%');
  wlCard.classList.add('tilt');
}
function untilt(){ wlCard.classList.remove('tilt'); wlCard.style.setProperty('--rx', '0deg'); wlCard.style.setProperty('--ry', '0deg'); }
wlCard.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = wlCard.getBoundingClientRect(); tilt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); });
wlCard.addEventListener('pointerleave', untilt);
function flipCard(){ wlFlipped = !wlFlipped; wlCard.classList.add('flipping'); wlCard.classList.toggle('flipped', wlFlipped); wlCard.setAttribute('aria-label', wlFlipped ? 'Show card front' : 'Flip card'); setTimeout(() => wlCard.classList.remove('flipping'), 750); }
wlCard.addEventListener('click', flipCard);
wlCard.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); flipCard(); } });
$('#wlPay').addEventListener('click', e => busy(e.currentTarget, 'Pay $4.50', 'Paying', 'Paid', () => {
  const from = wlBal; wlBal = Math.round((wlBal - 4.5) * 100) / 100;
  countUp($('#wlAmt'), wlBal, 700, money2, from);
  $('#wlLast').textContent = '−$4.50 · Corner Coffee';
  if (!reduce) wlCard.animate([{transform: 'scale(1)'}, {transform: 'scale(.93)'}, {transform: 'scale(1)'}], {duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)'});
}));

/* ---------- knob ---------- */
const kn = $('#kn'), knArc = $('#knArc'), knBody = $('.kn-body', kn), knTicks = $('#knTicks');
for (let i = 0; i <= 10; i++){
  const a = (135 + i * 27) * Math.PI / 180, l = document.createElementNS(SVGNS, 'line');
  l.setAttribute('x1', (50 + Math.cos(a) * 45).toFixed(2)); l.setAttribute('y1', (50 + Math.sin(a) * 45).toFixed(2));
  l.setAttribute('x2', (50 + Math.cos(a) * 48.5).toFixed(2)); l.setAttribute('y2', (50 + Math.sin(a) * 48.5).toFixed(2));
  knTicks.appendChild(l);
}
let knV = 62, knDet = 6, knY = null, knStart = 0, knGen = 0;
function setKnob(v, quiet){
  if (!quiet) knGen++;
  knV = clamp(v, 0, 100);
  knArc.style.strokeDashoffset = String(100 - knV);
  knBody.style.setProperty('--ka', (-135 + knV * 2.7).toFixed(1) + 'deg');
  kn.setAttribute('aria-valuenow', String(Math.round(knV))); $('#knVal').textContent = Math.round(knV);
  const det = Math.floor(knV / 10);
  if (!quiet && det !== knDet && !reduce) knBody.animate([{scale: '1'}, {scale: '1.07'}, {scale: '1'}], {duration: 160});
  knDet = det;
}
kn.addEventListener('pointerdown', e => { kn.setPointerCapture(e.pointerId); knY = e.clientY; knStart = knV; kn.classList.add('drag'); });
kn.addEventListener('pointermove', e => { if (knY !== null) setKnob(knStart + (knY - e.clientY) * .6); });
const knUp = () => { knY = null; kn.classList.remove('drag'); };
kn.addEventListener('pointerup', knUp); kn.addEventListener('pointercancel', knUp);
kn.addEventListener('wheel', e => { e.preventDefault(); setKnob(knV - Math.sign(e.deltaY) * 3); }, {passive: false});
kn.addEventListener('keydown', e => { if (e.key === 'ArrowUp' || e.key === 'ArrowRight'){ e.preventDefault(); setKnob(knV + 5); } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft'){ e.preventDefault(); setKnob(knV - 5); } });
setKnob(62, true);
function knobIntro(){
  const t = knV, gen = ++knGen;
  kn.classList.add('drag'); setKnob(0, true); void kn.offsetWidth; kn.classList.remove('drag');
  tween(1000, e => { if (gen === knGen) setKnob(t * e, true); }, eOut);
  setTimeout(() => { if (gen === knGen) setKnob(t, true); }, 1150);
}

/* ---------- activity rings ---------- */
const RG = [{label: 'Today', v: [.82, .64, .88], l: ['8.2k', '42m', '7h']}, {label: 'Yesterday', v: [1, .38, .7], l: ['10.4k', '23m', '5.6h']}];
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
  if (RG[rgI].v[0] >= 1){ const t = $('.t-rings'), svg = $('.rg', t), r = svg.getBoundingClientRect(), tr = t.getBoundingClientRect(); setTimeout(() => particles(t, r.left - tr.left + r.width / 2, r.top - tr.top + r.height / 2, 14, ['#FF4F6D', '#F7B500', '#38BDF8'], 44, 5), 900); }
});
drawRings(false);

/* ---------- keycaps ---------- */
const keyCmd = $('#keyCmd'), keyK = $('#keyK');
const pressKey = (k, on) => k.classList.toggle('down', on);
function tapKey(k){ pressKey(k, true); setTimeout(() => pressKey(k, false), 150); }
function pulseSearch(){ const t = $('.t-search'); t.classList.remove('pulse'); void t.offsetWidth; t.classList.add('pulse'); }
keyCmd.addEventListener('click', () => tapKey(keyCmd));
keyK.addEventListener('click', () => { tapKey(keyK); pulseSearch(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Meta' || e.key === 'Control') pressKey(keyCmd, true);
  if (e.key && e.key.toLowerCase() === 'k') pressKey(keyK, true);
  if ((e.metaKey || e.ctrlKey) && e.key && e.key.toLowerCase() === 'k'){ e.preventDefault(); cmdIn.focus(); pulseSearch(); }
});
document.addEventListener('keyup', e => {
  if (e.key === 'Meta' || e.key === 'Control') pressKey(keyCmd, false);
  if (e.key && e.key.toLowerCase() === 'k') pressKey(keyK, false);
});
addEventListener('blur', () => { pressKey(keyCmd, false); pressKey(keyK, false); });

/* ---------- swatches ---------- */
const SW_NAMES = {bitmap: ['Black', 'White', 'Gray 50%', 'Gray 25%', 'Gray 75%', 'Stripes']};
const sws = $('#sws'); let swI = 0, swT = 0;
for (let i = 1; i <= 6; i++){ const b = document.createElement('button'); b.type = 'button'; b.className = 'sw'; b.style.background = `var(--sw${i})`; b.setAttribute('aria-label', 'Colour ' + i); b.addEventListener('click', () => pickSwatch(i - 1, true)); sws.appendChild(b); }
const swBtns = $$('.sw', sws);
function swLabel(i){ const names = SW_NAMES[skin]; return names ? names[i] : getComputedStyle(kit).getPropertyValue('--sw' + (i + 1)).trim().toUpperCase(); }
function renderSwatchLabel(){ $('#swHex').textContent = swLabel(swI); }
async function pickSwatch(i, copy){
  swI = i; swBtns.forEach((b, k) => b.classList.toggle('on', k === i));
  const label = swLabel(i); $('#swHex').textContent = label;
  if (copy && !SW_NAMES[skin]){
    try { await navigator.clipboard.writeText(label); $('#swHex').textContent = 'Copied'; clearTimeout(swT); swT = setTimeout(renderSwatchLabel, 900); } catch (err) { /* clipboard refused; keep the hex visible */ }
  }
}
pickSwatch(0, false);

/* ---------- otp ---------- */
const otp = $('#otp'), otpMsg = $('#otpMsg'), DEFMSG = 'Enter the 6-digit code sent to •• 42';
for (let i = 0; i < 6; i++){
  const inp = document.createElement('input');
  inp.type = 'text'; inp.inputMode = 'numeric'; inp.maxLength = 1; inp.autocomplete = i ? 'off' : 'one-time-code';
  inp.id = 'otp' + i; inp.setAttribute('aria-label', 'Digit ' + (i + 1)); inp.style.setProperty('--i', i);
  otp.appendChild(inp);
}
const boxes = $$('input', otp); let otpReset = 0;
function otpCheck(){
  boxes.forEach(b => b.classList.toggle('filled', !!b.value));
  const code = boxes.map(b => b.value).join('');
  otp.classList.remove('ok');
  if (code.length < 6){ otpMsg.textContent = DEFMSG; otpMsg.className = 'otp-msg'; return; }
  if (code === '000000'){ otp.classList.remove('bad'); void otp.offsetWidth; otp.classList.add('bad'); otpMsg.textContent = 'That code has expired. Tap Resend for a new one.'; otpMsg.className = 'otp-msg'; return; }
  otp.classList.add('ok'); otpMsg.textContent = 'Verified. Signing you in…'; otpMsg.className = 'otp-msg ok';
  clearTimeout(otpReset); otpReset = setTimeout(() => { boxes.forEach(b => { b.value = ''; }); otpCheck(); }, 3200);
}
boxes.forEach((b, i) => {
  b.addEventListener('input', () => { b.value = b.value.replace(/\D/g, '').slice(-1); if (b.value && boxes[i + 1]) boxes[i + 1].focus(); otpCheck(); });
  b.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !b.value && boxes[i - 1]){ boxes[i - 1].value = ''; boxes[i - 1].focus(); otpCheck(); }
    else if (e.key === 'ArrowLeft' && boxes[i - 1]) boxes[i - 1].focus();
    else if (e.key === 'ArrowRight' && boxes[i + 1]) boxes[i + 1].focus();
  });
  b.addEventListener('paste', e => {
    const t = ((e.clipboardData && e.clipboardData.getData('text')) || '').replace(/\D/g, '').slice(0, 6);
    if (!t) return; e.preventDefault();
    [...t].forEach((c, j) => { if (boxes[j]) boxes[j].value = c; });
    boxes[Math.min(5, t.length)].focus(); otpCheck();
  });
});
$('#otpResend').addEventListener('click', () => { clearTimeout(otpReset); boxes.forEach(b => { b.value = ''; }); otpCheck(); otpMsg.textContent = 'New code sent to •• 42'; });
async function otpType(code){ clearTimeout(otpReset); boxes.forEach(b => { b.value = ''; }); otpCheck(); for (let j = 0; j < code.length; j++){ await sleep(120); boxes[j].value = code[j]; otpCheck(); } }

/* ---------- timer ---------- */
const TM = 300; let tmLeft = 252, tmOn = false, tmInt = 0;
const tmArc = $('#tmArc'), tmBtn = $('#tmBtn');
function tmDraw(){ $('#tmTime').textContent = `${String(Math.floor(tmLeft / 60)).padStart(2, '0')}:${String(tmLeft % 60).padStart(2, '0')}`; tmArc.style.strokeDashoffset = String(100 - 100 * tmLeft / TM); }
function tmSet(on){
  tmOn = on; tmBtn.innerHTML = on ? ICON.pause : ICON.play; tmBtn.setAttribute('aria-label', on ? 'Pause timer' : 'Start timer');
  $('#tmState').textContent = on ? 'Running' : 'Paused';
  clearInterval(tmInt);
  if (on) tmInt = setInterval(() => { tmLeft = tmLeft > 0 ? tmLeft - 1 : TM; tmDraw(); }, 1000);
}
tmBtn.addEventListener('click', () => tmSet(!tmOn));
function tmIntro(){ tmArc.style.transition = 'none'; tmArc.style.strokeDashoffset = '100'; void tmArc.getBoundingClientRect(); tmArc.style.transition = ''; requestAnimationFrame(tmDraw); }
tmDraw(); tmSet(true);

/* ---------- rating ---------- */
const WORDS = ['Poor', 'Okay', 'Good', 'Great', 'Superb'];
const starsEl = $('#stars'); let rating = 4;
for (let i = 1; i <= 5; i++){
  const b = document.createElement('button'); b.type = 'button'; b.className = 'star'; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', i + (i > 1 ? ' stars' : ' star'));
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
  likeN.textContent = likes.toLocaleString('en-US');
  if (reduce) return;
  likeN.animate([{transform: `translateY(${on ? 8 : -8}px)`, opacity: 0}, {transform: 'none', opacity: 1}], {duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)'});
  if (on){ const r = likeBtn.getBoundingClientRect(), t = likeTile.getBoundingClientRect(); particles(likeTile, r.left - t.left + 18, r.top - t.top + r.height / 2, 12, ['#E8364A', '#FF8A5B', '#FFC94D'], 32, 5); }
}
likeBtn.addEventListener('click', () => setLike(!liked));
function bigHeart(){
  if (reduce) return;
  lkBig.getAnimations().forEach(a => a.cancel());
  lkBig.animate([{opacity: 0, transform: 'scale(.3)'}, {opacity: 1, transform: 'scale(1.18)', offset: .35}, {opacity: 1, transform: 'scale(1)', offset: .6}, {opacity: 0, transform: 'scale(1.08) translateY(-10px)'}], {duration: 900, easing: 'ease-out'});
}
$('#lkImg').addEventListener('dblclick', () => { bigHeart(); setLike(true); });

/* ---------- loop state ---------- */
let paused = false, userHover = false, hoverT = 0, ghostOn = !reduce, demoI = 0;
const HOLD = 9500, dotsWrap = $('#loopDots');
SKINS.forEach(() => dotsWrap.appendChild(document.createElement('i')));
const dots = $$('i', dotsWrap);
function loopProgress(k){ const idx = SKINS.indexOf(skin); dots.forEach((d, i) => d.style.setProperty('--k', i < idx ? '1' : i === idx ? k.toFixed(3) : '0')); }
function loopUI(){ const btn = $('#loopBtn'); $('#loopIc').innerHTML = paused ? ICON.play : ICON.pause; btn.setAttribute('aria-label', paused ? 'Resume loop' : 'Pause loop'); btn.classList.toggle('held', userHover && !paused); }
$('#loopBtn').addEventListener('click', () => { paused = !paused; loopUI(); });
$('#ghostBtn').addEventListener('click', e => { ghostOn = !ghostOn; e.currentTarget.setAttribute('aria-pressed', String(ghostOn)); if (!ghostOn) gHide(); });
const hoverGrids = [grid, document.querySelector('#dw #grid')].filter(Boolean);   // hovering either grid pauses the loop
hoverGrids.forEach(g => g.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; clearTimeout(hoverT); userHover = true; gHide(); loopUI(); }));
hoverGrids.forEach(g => g.addEventListener('pointerleave', e => { if (e.pointerType !== 'mouse') return; clearTimeout(hoverT); hoverT = setTimeout(() => { userHover = false; loopUI(); }, 800); }));
hoverGrids.forEach(g => g.addEventListener('touchstart', () => { clearTimeout(hoverT); userHover = true; gHide(); loopUI(); hoverT = setTimeout(() => { userHover = false; loopUI(); }, 6000); }, {passive: true}));
grid.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  const t = e.target.closest && e.target.closest('.tile'); if (!t) return;
  const r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
});
document.addEventListener('keydown', e => { if (e.code === 'Space' && !(e.target.closest && e.target.closest('input, button, textarea, [role="slider"], [tabindex]'))){ e.preventDefault(); paused = !paused; loopUI(); } });

/* ---------- ghost cursor ---------- */
const ghost = document.getElementById('ghost'); let gx = 0, gy = 0, ghostVisible = false;
function gPlace(x, y){ gx = x; gy = y; ghost.style.transform = `translate(${(x - 4).toFixed(1)}px, ${(y - 3).toFixed(1)}px)`; }
gPlace(innerWidth - 60, innerHeight - 40);
function gShow(){ if (!ghostVisible){ ghostVisible = true; ghost.classList.add('show'); } }
function gHide(){ if (ghostVisible){ ghostVisible = false; ghost.classList.remove('show', 'press'); } tiles.forEach(t => t.classList.remove('gh')); if (window.DW) window.DW.gHide(); }
function hoverAt(x, y){
  const el = document.elementFromPoint(x, y), t = el && el.closest ? el.closest('.tile') : null;
  tiles.forEach(tt => tt.classList.toggle('gh', tt === t));
  if (t){ const r = t.getBoundingClientRect(); t.style.setProperty('--mx', (x - r.left) + 'px'); t.style.setProperty('--my', (y - r.top) + 'px'); }
}
function gMove(x, y, ms){
  const x0 = gx, y0 = gy, dx = x - x0, dy = y - y0, dist = Math.hypot(dx, dy) || 1;
  ms = ms || clamp(320 + dist * .55, 380, 950);
  const bend = Math.min(80, dist * .2) * (demoI % 2 ? 1 : -1), cx = x0 + dx / 2 - dy / dist * bend, cy = y0 + dy / 2 + dx / dist * bend;
  return tween(ms, e => { const u = 1 - e; gPlace(u * u * x0 + 2 * u * e * cx + e * e * x, u * u * y0 + 2 * u * e * cy + e * e * y); }, eInOut).then(() => hoverAt(x, y));
}
function center(el, fx = .5, fy = .5){ const r = el.getBoundingClientRect(); return [r.left + r.width * fx, r.top + r.height * fy]; }
function onScreen(el){ if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top > 10 && r.bottom < innerHeight - 10 && r.left >= 0 && r.right <= innerWidth; }
const gTo = (el, fx, fy) => { const [x, y] = center(el, fx, fy); return gMove(x, y); };
async function gClick(el){ ghost.classList.add('press'); await sleep(110); ghost.classList.remove('press', 'click'); void ghost.offsetWidth; ghost.classList.add('click'); if (el) el.click(); await sleep(240); }
const clickDemo = get => ({ el: get, run: async el => { await gTo(el); await gClick(el); } });
const DEMOS = [
  clickDemo(() => $('#ccFocus')),
  clickDemo(() => wkDays[(calSel + 2) % 7]),
  clickDemo(() => plPlay),
  { el: () => kn, run: async el => {
      const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y0 = r.top + r.height / 2, from = knV, to = knV > 50 ? 18 : 86;
      await gMove(x, y0); ghost.classList.add('press'); kn.classList.add('drag');
      await tween(900, e => { setKnob(from + (to - from) * e); gPlace(x, y0 - (to - from) * e * .5); }, eInOut);
      kn.classList.remove('drag'); ghost.classList.remove('press'); } },
  { el: () => vsB.el, run: async el => {
      const r = el.getBoundingClientRect(), x = r.left + r.width / 2, from = vsB.get(), to = from > .5 ? .24 : .86;
      await gMove(x, r.bottom - from * r.height); ghost.classList.add('press'); el.classList.add('drag');
      await tween(800, e => { const v = from + (to - from) * e; vsB.set(v); gPlace(x, r.bottom - v * r.height); }, eInOut);
      el.classList.remove('drag'); ghost.classList.remove('press'); await sleep(120); } },
  { el: () => msgIn, run: async el => {
      await gTo(el, .3, .5); await gClick();
      const text = CHAT_DEMO[demoChat++ % CHAT_DEMO.length]; msgIn.value = '';
      for (const c of text){ await sleep(40); msgIn.value += c; }
      await sleep(220); await gTo(sendBtn); await gClick(); send(msgIn.value); msgIn.value = ''; } },
  { el: () => $('.td:not(.done)') || (resetTodos(), $('.td:not(.done)')), run: async el => { await gTo($('.box', el)); await gClick(el); } },
  { el: () => wlCard, run: async el => {
      const r = el.getBoundingClientRect();
      await gMove(r.left + r.width * .25, r.top + r.height * .3);
      await tween(900, e => { const px = .25 + e * .5, py = .3 + Math.sin(e * Math.PI) * .4; gPlace(r.left + r.width * px, r.top + r.height * py); tilt(px, py); }, eInOut);
      untilt(); const p = $('#wlPay'); if (!p.dataset.busy){ await gTo(p); await gClick(p); } } },
  { el: () => liked ? likeBtn : $('#lkImg'), run: async el => {
      if (liked){ await gTo(el); await gClick(el); return; }
      await gTo(el, .5, .4); await gClick(); await sleep(50); await gClick(); bigHeart(); setLike(true); } },
  clickDemo(() => $('#rgDay')),
  { el: () => stars[rating === 5 ? 2 : 4], run: async el => {
      const n = stars.indexOf(el) + 1; await gTo(stars[0]);
      for (let k = 0; k < n; k++){ const [x, y] = center(stars[k]); await gMove(x, y, 130); paintStars(k + 1); }
      await gClick(); rateTo(n); } },
  clickDemo(() => $('#rdCall')),
  { el: () => ch, run: async el => {
      const r = el.getBoundingClientRect(), y = r.top + r.height * .45;
      await gMove(r.left + 12, y);
      await tween(1200, e => { const x = r.left + 12 + e * (r.width - 24); gPlace(x, y); chartHover(x); }, eInOut);
      await sleep(250); ch.classList.remove('hov'); } },
  { el: () => keyCmd, run: async () => { await gTo(keyCmd); await gClick(keyCmd); await sleep(80); await gTo(keyK); await gClick(keyK); } },
  { el: () => liveNf()[0], run: async el => {
      const r = el.getBoundingClientRect(), x0 = r.left + r.width * .3, y = r.top + r.height / 2;
      await gMove(x0, y); ghost.classList.add('press'); el.style.transition = 'none';
      await tween(380, e => { const dx = e * 160; el.style.transform = `translateX(${dx}px) rotate(${(dx * .025).toFixed(2)}deg)`; el.style.opacity = String(1 - e * .45); gPlace(x0 + dx, y); }, t => t * t);
      ghost.classList.remove('press'); dismissNf(el, 1); setTimeout(() => addNf(true), 900); } },
  clickDemo(() => swBtns[(swI + 2) % 6]),
  clickDemo(() => $('#prSeg button[aria-pressed="false"]')),
  clickDemo(() => $('#flipRemind')),
  { el: () => $('#phNext'), run: async el => { await gTo($('#photos'), .72, .5); await sleep(260); await gTo(el); await gClick(el); } },
  { el: () => boxes[0], run: async el => { await gTo(el); await gClick(); await otpType('428913'); await sleep(250); } },
  clickDemo(() => $('#plNext')),
  { el: () => cmdIn, run: async el => {
      await gTo(el, .25, .5); await gClick(); cmdIn.value = '';
      for (const c of 'focus'){ await sleep(110); cmdIn.value += c; cmdSel = 0; renderCmd(); }
      await sleep(800); cmdIn.value = ''; renderCmd(); } },
  { el: () => $('#inviteBtn').dataset.busy ? null : $('#inviteBtn'), run: async el => { await gTo(el); await gClick(el); } },
  clickDemo(() => $('#swLock')),
  clickDemo(() => $('#wxTemp')),
  clickDemo(() => $('#chSeg button[aria-pressed="false"]')),
  clickDemo(() => tmBtn)
];
async function ghostRun(alive){
  if (skin === 'diwan') return window.DW.ghostRun(alive, () => !ghostOn || paused || userHover);
  while (alive()){
    if (!ghostOn || paused || userHover){ gHide(); await sleep(200); continue; }
    const d = DEMOS[demoI % DEMOS.length]; demoI++;
    let el = null; try { el = d.el(); } catch (err) { el = null; }
    if (!onScreen(el)){ await sleep(40); continue; }
    if (!ghostVisible){ const [sx, sy] = center(el); gPlace(clamp(sx + 150, 8, innerWidth - 8), clamp(sy + 110, 8, innerHeight - 8)); gShow(); await sleep(160); }
    try { await d.run(el); } catch (err) { /* keep looping */ }
    await sleep(420);
  }
  gHide();
}

/* ---------- entrance / exit ---------- */
let live = [];
function delays(scale){
  const g = grid.getBoundingClientRect();
  return tiles.map(t => { const r = t.getBoundingClientRect(); return (((r.left - g.left) / Math.max(1, g.width)) * .55 + ((r.top - g.top) / Math.max(1, g.height)) * .45) * scale; });
}
const settle = list => Promise.all(list.map(a => a.finished.catch(() => {})));
const skipKid = c => c.classList.contains('noanim') || c.classList.contains('pt');
function animIn(){
  if (skin === 'diwan') return window.DW.animIn();
  live.forEach(a => a.cancel()); live = [];
  if (reduce) return Promise.resolve();
  const ds = delays(620), all = [];
  tiles.forEach((t, i) => {
    const d = ds[i];
    all.push(t.animate([{opacity: 0, transform: 'translateY(36px) scale(.9) rotateX(10deg)', filter: 'blur(12px)'}, {opacity: 1, transform: 'none', filter: 'blur(0px)'}], {duration: 1050, delay: d, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
    let j = 0;
    for (const c of Array.from(t.children)){
      if (skipKid(c)) continue;
      if (c.classList.contains('bleed')) all.push(c.animate([{transform: 'scale(1.22)'}, {transform: 'none'}], {duration: 1600, delay: d, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
      else all.push(c.animate([{opacity: 0, transform: 'translateY(14px)'}, {opacity: 1, transform: 'none'}], {duration: 760, delay: d + 170 + j++ * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
    }
  });
  return settle(all);
}
function animOut(){
  if (skin === 'diwan') return window.DW.animOut();
  if (reduce) return Promise.resolve();
  const ds = delays(420), all = [];
  tiles.forEach((t, i) => {
    const d = ds[i];
    for (const c of Array.from(t.children)){ if (skipKid(c) || c.classList.contains('bleed')) continue; all.push(c.animate([{opacity: 1}, {opacity: 0}], {duration: 240, delay: d, easing: 'ease-in', fill: 'forwards'})); }
    all.push(t.animate([{opacity: 1, transform: 'none', filter: 'blur(0px)'}, {opacity: 0, transform: 'translateY(-22px) scale(.94) rotateX(-8deg)', filter: 'blur(10px)'}], {duration: 650, delay: d + 70, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards'}));
  });
  live = all;
  return settle(all);
}
function onEnter(){
  if (skin === 'diwan') return window.DW.onEnter();
  if (reduce) return;
  ensureNf(3);
  setTimeout(() => {
    countUp($('#chNum'), DATA[range].total, 1200, money);
    countUp($('#wlAmt'), wlBal, 1200, money2, wlBal * .6);
    revealChart();
    countUp(wxT, wxC ? 21 : 70, 1000, v => Math.round(v));
    clockSweep(); vsB.intro(); vsV.intro(); tmIntro(); drawRings(true); knobIntro(); placeWk();
    const bar = $('#tdBar'); bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth; bar.style.transition = ''; tdSync();
  }, 380);
  setTimeout(() => addNf(true), 2600);
  setTimeout(() => incoming(0), 4200);
}
function preloadFonts(){
  if (!document.fonts || !document.fonts.load) return;
  ['600 16px "Geist"', '500 12px "Geist Mono"', '700 16px "Archivo"', '600 16px "IBM Plex Mono"', '800 16px "Bricolage Grotesque"', '800 16px "Syne"', '500 14px "DM Sans"', '500 12px "DM Mono"', '500 14px "Pixelify Sans"', '400 20px "VT323"', '700 14px "Nunito"', '500 12px "JetBrains Mono"', '500 14px "IBM Plex Sans Arabic"', '600 14px "IBM Plex Sans Arabic"', '600 20px "Reem Kufi"', '400 20px "Amiri"']
    .forEach(f => document.fonts.load(f).catch(() => {}));
}

/* ---------- main loop ---------- */
async function main(){
  root.dataset.skin = skin; loopUI(); loopProgress(0); renderCmd();
  started = true;
  if (reduce) return;
  await animIn(); onEnter(); preloadFonts();
  for (;;){
    let t = 0, holdDone = false;
    const gp = ghostRun(() => !holdDone && !pendingSkin);
    while (t < HOLD && !pendingSkin){ await sleep(100); if (!paused && !userHover) t += 100; loopProgress(t / HOLD); }
    holdDone = true;
    await Promise.race([gp, sleep(700)]); gHide();
    const next = pendingSkin || SKINS[(SKINS.indexOf(skin) + 1) % SKINS.length]; pendingSkin = null;
    await animOut();
    setSkin(next);
    await sleep(140);
    await animIn(); onEnter();
  }
}
main();
})();
