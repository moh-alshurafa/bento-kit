# Flip countdown

A split-flap countdown in hours, minutes and seconds.

**Use it for:** Launches, sales, events.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Each digit folds in two halves when it changes.

## Accessibility

- Pair it with the remaining time in text for screen readers.
- Attributes in use: `aria-pressed`, `aria-pressed="false"`.

## Tokens it reads

`--flip-bg`, `--flip-fg`, `--font-num`, `--muted`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-flip a-flip c2" data-pop="5" data-hw="dark" aria-label="Launch countdown">
      <div class="tl"><span class="lbl lead">Launch in</span><button type="button" class="tl-btn" id="flipRemind" aria-pressed="false">Remind me</button></div>
      <div class="flip" id="flip"></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .flip`).

```css
/* 20 flip countdown */
.flip{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:4px}
.fd{position:relative;flex:none;width:36px;height:52px;perspective:240px;color:var(--flip-fg);font-family:var(--font-num);font-weight:750}
.fd-h{position:absolute;left:0;right:0;height:50%;overflow:hidden;background:var(--flip-bg);-webkit-backface-visibility:hidden;backface-visibility:hidden}
.fd-u,.fd-fu{top:0;border-radius:7px 7px 0 0}
.fd-l,.fd-fl{bottom:0;border-radius:0 0 7px 7px}
.fd-h b{position:absolute;left:0;right:0;height:52px;display:grid;place-items:center;font-size:33px;line-height:1;font-weight:inherit;font-variant-numeric:tabular-nums}
.fd-u b,.fd-fu b{top:0}
.fd-l b,.fd-fl b{bottom:0}
.fd-fu{transform-origin:50% 100%;z-index:2}
.fd-fl{transform-origin:50% 0;z-index:2;transform:rotateX(90deg)}
.fd::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;margin-top:-.5px;background:rgba(0,0,0,.28);z-index:3}
.fsep{flex:none;font-family:var(--font-num);font-size:24px;font-weight:700;color:var(--muted);margin:0 1px}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
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
```
