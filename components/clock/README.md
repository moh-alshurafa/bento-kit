# Clock

An analog clock face with tick marks and a digital readout.

**Use it for:** World clocks, dashboards, scheduling.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- The hands move every second and sweep into place on entrance.
- Tap the digital time to switch between 12- and 24-hour format.

## Accessibility

- The digital time carries the value; the face is decorative.

## Tokens it reads

`--accent`, `--clk-face`, `--clk-ring`, `--clk-ring-w`, `--fg`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-clock a-clock" data-pop="3" aria-label="Clock">
      <div class="tl"><span class="lbl lead">Local time</span><button type="button" class="lbl2 clk-dig" id="clkDig" aria-label="Switch between 12 and 24 hour time">00:00</button></div>
      <div class="clk-wrap"><svg class="clk" viewBox="0 0 100 100" aria-hidden="true"><circle class="clk-face" cx="50" cy="50" r="46"/><g class="clk-ticks" id="clkTicks"></g><line class="clk-h" id="clkH" x1="50" y1="53" x2="50" y2="29"/><line class="clk-m" id="clkM" x1="50" y1="54" x2="50" y2="16"/><g class="clk-s" id="clkS"><line x1="50" y1="60" x2="50" y2="12"/><circle cx="50" cy="50" r="2.8"/></g></svg></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .clk-wrap`).

```css
/* 4 clock */
.clk-wrap{flex:1;min-height:0;display:grid;place-items:center}
.clk{height:100%;max-height:118px;aspect-ratio:1;overflow:visible}
.clk-face{fill:var(--clk-face);stroke:var(--clk-ring);stroke-width:var(--clk-ring-w)}
.clk-ticks line{stroke:var(--fg);stroke-width:1.3;stroke-linecap:round;opacity:.45}
.clk-ticks line.q{stroke-width:2.6;opacity:1}
.clk-h,.clk-m{stroke:var(--fg);stroke-linecap:round}
.clk-h{stroke-width:4.2}.clk-m{stroke-width:2.8}
.clk-s line{stroke:var(--accent);stroke-width:1.3;stroke-linecap:round}
.clk-s circle{fill:var(--accent)}
.clk-h,.clk-m,.clk-s{transform-box:view-box;transform-origin:50% 50%}
.clk-dig{cursor:pointer}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
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
```
