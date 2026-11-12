# Revenue chart

A line chart with a 7D/30D/90D range switch, a total, a change badge and a crosshair tooltip.

**Use it for:** Analytics, finance, reporting.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Switching range redraws the line and counts the total up.
- The line draws in on entrance; an end dot marks the latest value.
- Hover shows a crosshair and tooltip; with focus, the arrow keys step through the points.

## Accessibility

- A visually hidden table carries the same numbers for screen readers.
- The range switch is a tablist.
- Attributes in use: `aria-pressed`, `aria-pressed="false"`, `aria-pressed="true"`, `role="group"`.

## Tokens it reads

`--chart-line`, `--expo`, `--faint`, `--fg`, `--font-num`, `--good`, `--muted`, `--tile-solid`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-chart a-chart c2" aria-label="Revenue chart">
      <div class="ch-head">
        <div><span class="lbl lead">Revenue</span><div class="ch-num"><b id="chNum">$48,210</b><span class="delta" id="chDelta">+12.4%</span></div></div>
        <div class="seg ch-seg" id="chSeg" role="group" aria-label="Range"><span class="seg-pill" aria-hidden="true"></span><button type="button" data-r="7" aria-pressed="true">7D</button><button type="button" data-r="30" aria-pressed="false">30D</button><button type="button" data-r="90" aria-pressed="false">90D</button></div>
      </div>
      <div class="ch" id="ch">
        <svg id="chSvg" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="chGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-opacity=".32"/><stop offset="1" stop-opacity="0"/></linearGradient></defs>
          <line class="gl" x1="0" x2="600" y1="30" y2="30"/><line class="gl" x1="0" x2="600" y1="60" y2="60"/><line class="gl" x1="0" x2="600" y1="90" y2="90"/>
          <path class="area" id="chArea"/><path class="line" id="chLine"/>
        </svg>
        <i class="ch-x" id="chX"></i><i class="ch-dot" id="chDot"></i><span class="ch-tip" id="chTip"></span>
      </div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .ch-head`).

```css
/* 10 chart */
.ch-head{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex:none}
.ch-num{display:flex;align-items:baseline;gap:8px;margin-top:4px}
.ch-num b{font-family:var(--font-num);font-size:24px;font-weight:650;letter-spacing:-.03em;font-variant-numeric:tabular-nums;line-height:1}
.delta{font-size:11px;font-weight:700;color:var(--good);background:color-mix(in srgb,var(--good) 15%,transparent);padding:2px 7px;border-radius:99px;white-space:nowrap}
.ch-seg button{height:24px;padding:0 8px;font-size:11px}
.ch{position:relative;flex:1;min-height:0;cursor:crosshair}
.ch svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.ch stop{stop-color:var(--chart-line)}
.ch .area{fill:url(#chGrad);transition:d .7s var(--expo)}
.ch .line{fill:none;stroke:var(--chart-line);stroke-width:2.2;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round;transition:d .7s var(--expo)}
.ch .gl{stroke:var(--faint);stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:3 4}
.ch-x{position:absolute;top:0;bottom:0;width:1px;background:var(--muted);opacity:0;transition:opacity .15s}
.ch-dot{position:absolute;width:11px;height:11px;margin:-5.5px 0 0 -5.5px;border-radius:50%;background:var(--tile-solid);border:2.5px solid var(--chart-line);opacity:0;transition:opacity .15s}
.ch-tip{position:absolute;top:0;left:0;padding:5px 8px;border-radius:7px;background:var(--fg);color:var(--tile-solid);font-family:var(--font-num);font-size:11.5px;font-weight:650;white-space:nowrap;pointer-events:none;transform:translate(-50%,calc(-100% - 10px));opacity:0;transition:opacity .15s}
.ch.hov .ch-x{opacity:.35}
.ch.hov .ch-dot,.ch.hov .ch-tip{opacity:1}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
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
```
