# Activity rings

Three concentric progress rings with their values.

**Use it for:** Fitness, habits, goals.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- The rings draw in on entrance.
- Tapping the day label cycles through days and redraws the rings.

## Accessibility

- Values are written beside the rings, so the data never depends on colour alone.

## Tokens it reads

`--expo`, `--font-num`, `--ring-track`, `--ring1`, `--ring2`, `--ring3`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-rings a-rings" data-pop="1" aria-label="Activity">
      <div class="tl"><span class="lbl lead">Activity</span><button type="button" class="lbl2 rg-day" id="rgDay" aria-label="Switch day">Today</button></div>
      <div class="rg-body">
        <svg class="rg" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="rg-t" cx="50" cy="50" r="42"/><circle class="rg-a r1" id="rg1" cx="50" cy="50" r="42" pathLength="100"/>
          <circle class="rg-t" cx="50" cy="50" r="30"/><circle class="rg-a r2" id="rg2" cx="50" cy="50" r="30" pathLength="100"/>
          <circle class="rg-t" cx="50" cy="50" r="18"/><circle class="rg-a r3" id="rg3" cx="50" cy="50" r="18" pathLength="100"/>
        </svg>
        <ul class="rg-leg"><li title="Steps"><i class="r1"></i><b id="rgL1">8.2k</b></li><li title="Active minutes"><i class="r2"></i><b id="rgL2">42m</b></li><li title="Sleep"><i class="r3"></i><b id="rgL3">7h</b></li></ul>
      </div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .rg-body`).

```css
/* 23 activity rings */
.rg-body{flex:1;min-height:0;display:flex;align-items:center;gap:8px}
.rg{height:100%;max-height:92px;aspect-ratio:1;flex:none;transform:rotate(-90deg);overflow:visible}
.rg circle{fill:none;stroke-width:10;stroke-linecap:round}
.rg-t{stroke:var(--ring-track)}
.rg-a{stroke-dasharray:100;stroke-dashoffset:100;transition:stroke-dashoffset 1.2s var(--expo)}
.rg-a.r1{stroke:var(--ring1)}.rg-a.r2{stroke:var(--ring2)}.rg-a.r3{stroke:var(--ring3)}
.rg-leg{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;min-width:0}
.rg-leg li{display:flex;align-items:center;gap:5px;font-size:11px;white-space:nowrap}
.rg-leg i{width:7px;height:7px;border-radius:50%;flex:none}
.rg-leg i.r1{background:var(--ring1)}.rg-leg i.r2{background:var(--ring2)}.rg-leg i.r3{background:var(--ring3)}
.rg-leg b{font-family:var(--font-num);font-weight:700;font-variant-numeric:tabular-nums}
.rg-day{cursor:pointer}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
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
```
