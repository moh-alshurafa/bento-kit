# Break timer

A countdown ring with play and pause.

**Use it for:** Focus timers, workouts, cooking.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Play starts the countdown; the ring drains smoothly; the state label switches between Running and Paused.

## Accessibility

- The button's label names the action it will take.
- Attributes in use: `aria-label`.

## Tokens it reads

`--accent`, `--btn-bg`, `--btn-border`, `--btn-fg`, `--btn-shadow`, `--ctl`, `--ease`, `--font-num`, `--spring`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-timer a-timer" data-pop="4" data-hw="dark" aria-label="Break timer">
      <div class="tl"><span class="lbl lead">Break</span><span class="lbl2" id="tmState">Running</span></div>
      <div class="tm-body">
        <div class="tm-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="tr-bg" cx="50" cy="50" r="42"/><circle class="tr-fg" id="tmArc" cx="50" cy="50" r="42" pathLength="100"/></svg><span class="tm-time" id="tmTime">04:12</span></div>
        <button type="button" class="tm-btn" id="tmBtn" aria-label="Pause timer"></button>
      </div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .tm-body`).

```css
/* 13 timer */
.tm-body{flex:1;min-height:0;display:flex;align-items:center;justify-content:space-between;gap:8px}
.tm-ring{position:relative;height:100%;max-height:92px;aspect-ratio:1;flex:none}
.tm-ring svg{width:100%;height:100%;transform:rotate(-90deg);overflow:visible}
.tm-ring circle{fill:none;stroke-width:8;stroke-linecap:round}
.tr-bg{stroke:var(--ctl)}
.tr-fg{stroke:var(--accent);stroke-dasharray:100;transition:stroke-dashoffset 1s var(--ease)}
.tm-time{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--font-num);font-size:15px;font-weight:650;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.tm-btn{width:38px;height:38px;flex:none;border-radius:50%;display:grid;place-items:center;background:var(--btn-bg);color:var(--btn-fg);border:var(--btn-border);box-shadow:var(--btn-shadow);transition:transform .25s var(--spring)}
.tm-btn svg{width:15px;height:15px}
.tm-btn:active{transform:scale(.88)}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
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
```
