# Week calendar

A week strip with a sliding selection pill, a today marker and the selected day's event.

**Use it for:** Scheduling, bookings, habit tracking.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Clicking a day slides the pill to it with a spring and swaps the event line.
- The week and today are computed from the current date.

## Accessibility

- Days are buttons; the selected day is exposed to assistive technology.
- Attributes in use: `aria-label`, `aria-selected`, `role="tablist"`.

## Tokens it reads

`--accent`, `--fg`, `--font-label`, `--font-num`, `--muted`, `--seg-on`, `--seg-on-fg`, `--seg-on-shadow`, `--seg-radius`, `--spring`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-cal a-cal c2" data-pop="2" aria-label="This week">
      <div class="tl"><span class="lbl lead">November 2026</span><span class="lbl2" id="calSel">Wed 11</span></div>
      <div class="wk" id="wk" role="tablist" aria-label="Days this week"><span class="wk-pill" aria-hidden="true"></span></div>
      <div class="ev" id="calEv"><i></i><b>14:30</b><span>Design review</span></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .wk`).

```css
/* 17 week calendar */
.wk{position:relative;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;flex:1;min-height:0}
.wk-d{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border-radius:calc(var(--seg-radius) * .5 + 6px);color:var(--fg);transition:color .25s,transform .25s var(--spring)}
.wk-d span{font-family:var(--font-label);font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.04em}
.wk-d b{font-family:var(--font-num);font-size:16px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.1}
.wk-d .dot{width:4px;height:4px;border-radius:50%;background:var(--accent);opacity:0}
.wk-d.has .dot{opacity:1}
.wk-d.today b{color:var(--accent)}
.wk-d[aria-selected="true"]{color:var(--seg-on-fg)}
.wk-d[aria-selected="true"] span,.wk-d[aria-selected="true"] b{color:inherit}
.wk-d[aria-selected="true"] .dot{background:currentColor}
.wk-d:active{transform:scale(.92)}
.wk-pill{position:absolute;z-index:0;top:0;bottom:0;left:0;width:0;border-radius:calc(var(--seg-radius) * .5 + 6px);background:var(--seg-on);box-shadow:var(--seg-on-shadow);transition:transform .5s var(--spring),width .5s var(--spring)}
.ev{display:flex;align-items:center;gap:8px;font-size:12px;flex:none;min-width:0}
.ev i{width:3px;height:14px;border-radius:2px;background:var(--accent);flex:none}
.ev b{font-family:var(--font-num);font-weight:700;font-variant-numeric:tabular-nums}
.ev span{color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ev.none i{background:var(--muted);opacity:.4}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
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
```
