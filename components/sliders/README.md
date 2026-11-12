# Brightness and volume

Two vertical fill sliders.

**Use it for:** Device controls, media, lighting.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Drag anywhere on the track (pointer capture) or use the arrow keys.
- On entrance the fills sweep up to their value.
- The icon at the bottom changes colour once the fill covers it.

## Accessibility

- Each slider is `role="slider"` with its value range and a label.
- Attributes in use: `aria-valuemax="100"`, `aria-valuemin="0"`, `aria-valuenow`, `role="slider"`.

## Tokens it reads

`--ctl`, `--ctl-border`, `--spring`, `--tile-radius`, `--v`, `--vs-fill`, `--vs-ic`, `--vs-ic-low`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-sliders a-sliders r2" data-pop="6" aria-label="Brightness and volume">
      <div class="tl"><span class="lbl lead" id="vsLbl">Brightness</span><span class="lbl2" id="vsRead">64%</span></div>
      <div class="vs-wrap">
        <div class="vs" id="vsB" role="slider" tabindex="0" aria-label="Brightness" aria-valuemin="0" aria-valuemax="100"><div class="vs-fill"></div><svg class="vs-ic sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor"/><g class="rays"><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></g></svg></div>
        <div class="vs" id="vsV" role="slider" tabindex="0" aria-label="Volume" aria-valuemin="0" aria-valuemax="100"><div class="vs-fill"></div><svg class="vs-ic spk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor"/><path class="w1" d="M15.5 9.5a3.5 3.5 0 0 1 0 5"/><path class="w2" d="M18 7a7 7 0 0 1 0 10"/></svg></div>
      </div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .vs-wrap`).

```css
/* 6 sliders */
.vs-wrap{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:9px}
.vs{position:relative;border-radius:calc(var(--tile-radius) * .78);background:var(--ctl);border:var(--ctl-border);overflow:hidden;cursor:ns-resize;touch-action:none;transform-origin:50% 100%;transition:transform .5s var(--spring)}
.vs.drag{transition:none}
.vs-fill{position:absolute;left:0;right:0;bottom:0;height:calc(var(--v,.5) * 100%);background:var(--vs-fill);transition:height .55s var(--spring),bottom .55s var(--spring)}
.vs.drag .vs-fill{transition:none}
.vs-ic{position:absolute;left:50%;bottom:14px;width:22px;height:22px;margin-left:-11px;color:var(--vs-ic);transition:color .3s}
.vs.low .vs-ic{color:var(--vs-ic-low)}
.sun .rays{transform-box:fill-box;transform-origin:center;transform:scale(calc(.55 + var(--v,.5) * .55)) rotate(calc(var(--v,.5) * 90deg))}
.spk .w1,.spk .w2{transition:opacity .25s}
.vs[data-lvl="0"] .w1,.vs[data-lvl="0"] .w2,.vs[data-lvl="1"] .w2{opacity:0}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
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
```
