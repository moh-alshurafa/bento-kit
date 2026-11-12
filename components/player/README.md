# Music player

A now-playing card: album art, track and artist, an equalizer, a scrub bar and transport controls.

**Use it for:** Media apps, smart-home audio, podcasts, any now-playing surface.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Play toggles the icon, starts the equalizer bars and lifts the album art.
- Previous restarts the track after 3 seconds, otherwise it goes back a track; tracks swap with a slide of the art.
- Drag the scrub bar (pointer capture) or use the arrow keys to seek in 5-second steps.
- Shuffle and the heart are toggle buttons; the heart pops when liked.

## Accessibility

- Every control has an accessible name; toggles expose `aria-pressed`.
- The scrub bar works from the keyboard.
- Attributes in use: `aria-label`, `aria-pressed`, `aria-pressed="false"`, `aria-valuemax`, `aria-valuemax="228"`, `aria-valuemin="0"`, `aria-valuenow`, `role="slider"`.

## Tokens it reads

`--accent`, `--bad`, `--btn-bg`, `--btn-border`, `--btn-fg`, `--btn-shadow`, `--d`, `--expo`, `--font-num`, `--img-radius`, `--muted`, `--spring`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-player a-player c2 r2" id="player" data-pop="1" aria-label="Music player">
      <div class="tl"><span class="lbl lead">Now playing</span><span class="lbl2">Living room</span></div>
      <div class="pl-body">
        <div class="pl-art" id="plArt"><img class="on" data-base="img/art-tide.jpg" src="img/art-tide.jpg" alt="Album art for Low Tide Signal"><img alt=""></div>
        <div class="pl-info">
          <div class="pl-meta" id="plMeta"><div class="pl-title" id="plTitle">Low Tide Signal</div><div class="pl-artist" id="plArtist">Marrow &amp; Vale</div></div>
          <div class="pl-eq" id="plEq" aria-hidden="true"></div>
        </div>
      </div>
      <div class="pl-scrub">
        <div class="track" id="plBar" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="228" style="--p:31%"><div class="fill"></div><div class="knob"></div></div>
        <div class="pl-times"><span id="plCur">1:12</span><span id="plDur">-2:36</span></div>
      </div>
      <div class="pl-ctrl">
        <button type="button" class="ib" id="plShuf" aria-label="Shuffle" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg></button>
        <button type="button" class="ib" id="plPrev" aria-label="Previous track"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h2.2v14H6zM19.5 5.3v13.4L9.6 12z"/></svg></button>
        <button type="button" class="pl-play" id="plPlay" aria-label="Play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg></button>
        <button type="button" class="ib" id="plNext" aria-label="Next track"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.8 5H18v14h-2.2zM4.5 5.3v13.4L14.4 12z"/></svg></button>
        <button type="button" class="ib pl-heart" id="plHeart" aria-label="Love this track" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20.3s-7.6-4.6-9.5-9.4C1.2 7.4 3.5 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.5 0 5.8 3.4 4.5 6.9-1.9 4.8-9.5 9.4-9.5 9.4z"/></svg></button>
      </div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .t-player`).

```css
/* 1 player */
.t-player{gap:11px}
.pl-body{flex:1;min-height:0;display:flex;gap:14px;align-items:center}
.pl-art{position:relative;height:100%;max-height:150px;aspect-ratio:1;flex:none;border-radius:var(--img-radius);overflow:hidden;transform:scale(.93);box-shadow:0 14px 30px -16px rgba(0,0,0,.55);transition:transform .7s var(--spring),box-shadow .7s,border-radius .6s}
.playing .pl-art{transform:scale(1)}
.pl-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.1);transition:opacity .6s ease,transform .9s var(--expo)}
.pl-art img.on{opacity:1;transform:none}
.pl-info{min-width:0;flex:1;display:flex;flex-direction:column;gap:10px}
.pl-meta{min-width:0}
.pl-title{font-size:18px;font-weight:700;letter-spacing:-.015em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2}
.pl-artist{margin-top:2px;font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl-eq{display:flex;align-items:flex-end;gap:3px;height:22px}
.pl-eq i{width:3px;border-radius:2px;background:var(--accent);opacity:.85;transition:height .4s}
.playing .pl-eq i{animation:eq .9s var(--d) ease-in-out infinite alternate}
@keyframes eq{0%{height:14%}100%{height:100%}}
.pl-scrub{display:flex;flex-direction:column;gap:7px;flex:none}
.pl-times{display:flex;justify-content:space-between;font-family:var(--font-num);font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums}
.pl-ctrl{display:flex;align-items:center;justify-content:space-between;flex:none}
.pl-play{width:50px;height:50px;border-radius:50%;display:grid;place-items:center;background:var(--btn-bg);color:var(--btn-fg);border:var(--btn-border);box-shadow:var(--btn-shadow);transition:transform .3s var(--spring)}
.pl-play:active{transform:scale(.88)}
.pl-play svg{width:21px;height:21px}
.pl-heart[aria-pressed="true"]{color:var(--bad)}
.pl-heart[aria-pressed="true"] svg{fill:currentColor}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
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
```
