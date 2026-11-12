# Knob

A rotary knob with a value arc and tick marks.

**Use it for:** Audio, lighting, any bounded value that suits a dial.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Drag up or down, scroll the wheel, or use the arrow keys (5 per step).
- On entrance the knob sweeps to its value.

## Accessibility

- `role="slider"` with its value range and a label.
- Attributes in use: `aria-valuemax="100"`, `aria-valuemin="0"`, `aria-valuenow`, `aria-valuenow="62"`, `role="slider"`.

## Tokens it reads

`--accent`, `--ka`, `--kn-track`, `--knob-face`, `--muted`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-knob a-knob" data-pop="6" aria-label="Gain knob">
      <div class="tl"><span class="lbl lead">Gain</span><span class="lbl2" id="knVal">62</span></div>
      <div class="kn-wrap"><div class="kn" id="kn" role="slider" tabindex="0" aria-label="Gain" aria-valuemin="0" aria-valuemax="100" aria-valuenow="62">
        <svg viewBox="0 0 100 100" aria-hidden="true"><path class="kn-track" d="M21.72 78.28A40 40 0 1 1 78.28 78.28"/><path class="kn-arc" id="knArc" d="M21.72 78.28A40 40 0 1 1 78.28 78.28" pathLength="100"/><g class="kn-ticks" id="knTicks"></g></svg>
        <span class="kn-body"><i class="kn-mark"></i></span>
      </div></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .kn-wrap`).

```css
/* 22 knob */
.kn-wrap{flex:1;min-height:0;display:grid;place-items:center}
.kn{position:relative;height:100%;max-height:96px;aspect-ratio:1;cursor:ns-resize;touch-action:none;border-radius:50%}
.kn svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.kn-track{fill:none;stroke:var(--kn-track);stroke-width:7;stroke-linecap:round}
.kn-arc{fill:none;stroke:var(--accent);stroke-width:7;stroke-linecap:round;stroke-dasharray:100;transition:stroke-dashoffset .15s}
.kn-ticks line{stroke:var(--muted);stroke-width:1.4;stroke-linecap:round}
.kn-body{position:absolute;inset:23%;border-radius:50%;background:var(--knob-face);box-shadow:0 6px 14px -6px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.6);transform:rotate(var(--ka,0deg));transition:transform .15s}
.kn-mark{position:absolute;left:50%;top:9%;width:3px;height:27%;margin-left:-1.5px;border-radius:2px;background:var(--accent)}
.kn.drag .kn-body,.kn.drag .kn-arc{transition:none}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
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
```
