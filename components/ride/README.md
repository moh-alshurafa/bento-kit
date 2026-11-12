# Ride tracker

A stylised map with an animated route and car, an arrival estimate, and the driver with message and call buttons.

**Use it for:** Deliveries, rides, logistics, order tracking.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- The estimate counts down; at zero it reads Arrived.
- The car travels the route; the call button toggles a connected state.

## Accessibility

- The map is decorative; the estimate and driver details are text.
- Attributes in use: `aria-label`.

## Tokens it reads

`--ctl`, `--ctl-border`, `--faint`, `--fg`, `--font-label`, `--font-num`, `--good`, `--map-bg`, `--map-block`, `--map-park`, `--map-road`, `--map-route`, `--map-water`, `--muted`, `--tile-radius`, `--tile-solid`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-ride a-ride c2 r2" aria-label="Ride tracker">
      <div class="rd-map">
        <svg class="rd-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect class="m-bg" width="320" height="200"/>
          <path class="m-water" d="M0 160 C48 150 92 184 150 178 C208 172 252 192 320 184 V200 H0 Z"/>
          <rect class="m-block" x="47" y="6" width="66" height="47" rx="3"/><rect class="m-block" x="127" y="6" width="96" height="47" rx="3"/><rect class="m-block" x="237" y="6" width="46" height="47" rx="3"/>
          <rect class="m-block" x="47" y="67" width="66" height="36" rx="3"/><rect class="m-block" x="127" y="67" width="96" height="36" rx="3"/><rect class="m-block" x="237" y="67" width="46" height="36" rx="3"/><rect class="m-block" x="297" y="67" width="30" height="36" rx="3"/>
          <rect class="m-block" x="47" y="117" width="66" height="26" rx="3"/><rect class="m-block" x="127" y="117" width="96" height="26" rx="3"/><rect class="m-block" x="237" y="117" width="46" height="26" rx="3"/><rect class="m-block" x="-8" y="67" width="41" height="36" rx="3"/>
          <circle class="m-park" cx="80" cy="30" r="16"/><rect class="m-park" x="242" y="11" width="74" height="38" rx="6"/><rect class="m-park" x="132" y="121" width="50" height="18" rx="4"/>
          <g class="m-roads"><path d="M40 0V200M120 0V150M230 0V150M290 60V150M0 60H320M0 110H320M0 150H320"/></g>
          <g class="m-roads-in"><path d="M40 0V200M120 0V150M230 0V150M290 60V150M0 60H320M0 110H320M0 150H320"/></g>
          <path class="m-route" id="rdRoute" d="M40 186V110H120V60H230V110H290"/>
          <path class="m-ants" d="M40 186V110H120V60H230V110H290"/>
          <text class="m-label" x="282" y="98" text-anchor="end">Harbour St</text>
          <g transform="translate(290 110)"><circle class="m-pulse" r="6"/><circle class="m-pulse p2" r="6"/><circle class="m-pin" r="5.5"/></g>
          <g class="m-car" id="rdCar" transform="translate(40 186)"><circle r="7.5"/><path d="M0 -4.2 3.6 3.4 0 1.6 -3.6 3.4z"/></g>
        </svg>
        <div class="rd-eta"><span class="lbl" id="rdLbl">Arriving in</span><b id="rdEta">6</b><span id="rdMin">min</span></div>
      </div>
      <div class="rd-sheet">
        <img class="rd-av" data-base="img/av-eagle.jpg" src="img/av-eagle.jpg" alt="">
        <div class="rd-who"><b>Sami · Grey Prius 4KX 219</b><span id="rdStatus">On the way to Harbour St</span></div>
        <button type="button" class="ib rd-btn" id="rdMsg" aria-label="Message driver"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg></button>
        <button type="button" class="ib rd-btn rd-call" id="rdCall" aria-label="Call driver"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 4h3.5l2 5-2.2 1.3a11 11 0 0 0 5.4 5.4l1.3-2.2 5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></button>
      </div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .t-ride`).

```css
/* 18 ride */
.t-ride{padding:0!important;gap:0}
.rd-map{position:relative;flex:1;min-height:0;overflow:hidden}
.rd-svg{position:absolute;inset:0;width:100%;height:100%}
.m-bg{fill:var(--map-bg)}
.m-block{fill:var(--map-block)}
.m-park{fill:var(--map-park)}
.m-water{fill:var(--map-water)}
.m-roads path{fill:none;stroke:var(--map-road);stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
.m-roads-in{display:none}
.m-roads-in path{fill:none;stroke-linecap:round;stroke-linejoin:round}
.m-route{fill:none;stroke:var(--map-route);stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round}
.m-ants{fill:none;stroke:var(--tile-solid);stroke-width:1.6;stroke-dasharray:2 6;stroke-linecap:round;animation:ants 1.2s linear infinite;opacity:.9}
@keyframes ants{to{stroke-dashoffset:-16}}
.m-label{font-family:var(--font-label);font-size:8px;font-weight:600;fill:var(--fg);letter-spacing:.04em}
.m-pin{fill:var(--map-route);stroke:var(--tile-solid);stroke-width:2.5}
.m-pulse{fill:none;stroke:var(--map-route);stroke-width:1.5;transform-box:fill-box;transform-origin:center;animation:mpulse 2s ease-out infinite}
.m-pulse.p2{animation-delay:1s}
@keyframes mpulse{0%{transform:scale(1);opacity:.9}100%{transform:scale(3.4);opacity:0}}
.m-car circle{fill:var(--tile-solid);stroke:var(--map-route);stroke-width:2.5}
.m-car path{fill:var(--map-route)}
.rd-eta{position:absolute;top:12px;left:12px;display:flex;align-items:baseline;gap:4px;padding:6px 10px;border-radius:calc(var(--tile-radius) * .5);background:var(--tile-solid);color:var(--fg);box-shadow:0 4px 12px -6px rgba(0,0,0,.35);font-size:11px}
.rd-eta b{font-family:var(--font-num);font-size:20px;font-weight:750;line-height:1;font-variant-numeric:tabular-nums}
.rd-sheet{display:flex;align-items:center;gap:10px;padding:11px 14px;flex:none;border-top:1px solid var(--faint)}
.rd-av{width:34px;height:34px;border-radius:50%;object-fit:cover;flex:none}
.rd-who{min-width:0;flex:1;display:flex;flex-direction:column}
.rd-who b{font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rd-who span{font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rd-btn{background:var(--ctl);border:var(--ctl-border);width:34px;height:34px}
.rd-call.on{background:var(--good);color:#fff}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
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
```
