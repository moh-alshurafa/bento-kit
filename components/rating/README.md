# Rating

Five stars with a word label.

**Use it for:** Reviews, feedback, satisfaction surveys.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Hovering previews a rating; clicking sets it and pops the stars in sequence, 45ms apart.
- The label switches to a word such as "Great".

## Accessibility

- Stars are `role="radio"` options, each labelled with its value.
- Attributes in use: `aria-checked`, `aria-label`, `role="radiogroup"`.

## Tokens it reads

`--muted`, `--spring`, `--star-off`, `--warn`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-rating a-rating" data-pop="5" aria-label="Rating">
      <div class="tl"><span class="lbl lead">Rate your stay</span></div>
      <div class="stars" id="stars" role="radiogroup" aria-label="Stars"></div>
      <div class="rt-foot"><b id="rtWord">Great</b><span>Hotel Arden</span></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .stars`).

```css
/* 14 rating */
.stars{display:flex;gap:4px;flex:1;align-items:center}
.star{flex:1 1 0;min-width:0;max-width:30px;aspect-ratio:1;color:var(--star-off);transition:transform .25s var(--spring),color .2s}
.star svg{width:100%;height:100%}
.star.on{color:var(--warn)}
.star:hover{transform:scale(1.14)}
.star.pop{animation:pop .5s var(--spring) both}
@keyframes pop{40%{transform:scale(1.4) rotate(-10deg)}}
.rt-foot{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex:none}
.rt-foot b{font-size:15px;font-weight:750;letter-spacing:-.01em}
.rt-foot span{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- rating ---------- */
const WORDS = ['Poor', 'Okay', 'Good', 'Great', 'Superb'];
const starsEl = $('#stars'); let rating = 4;
for (let i = 1; i <= 5; i++){
  const b = document.createElement('button'); b.type = 'button'; b.className = 'star'; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', i + (i > 1 ? ' stars' : ' star'));
  b.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.9l2.75 5.6 6.15.9-4.45 4.35 1.05 6.1L12 17l-5.5 2.85 1.05-6.1L3.1 9.4l6.15-.9z"/></svg>';
  starsEl.appendChild(b);
}
const stars = $$('.star', starsEl);
function paintStars(n){ stars.forEach((s, i) => { s.classList.toggle('on', i < n); s.setAttribute('aria-checked', String(i + 1 === rating)); }); $('#rtWord').textContent = WORDS[n - 1]; }
function rateTo(n){ rating = n; paintStars(n); stars.forEach((x, j) => { if (j < n){ x.classList.remove('pop'); void x.offsetWidth; x.style.animationDelay = (j * 45) + 'ms'; x.classList.add('pop'); } }); }
stars.forEach((s, i) => { s.addEventListener('mouseenter', () => paintStars(i + 1)); s.addEventListener('click', () => rateTo(i + 1)); });
starsEl.addEventListener('mouseleave', () => paintStars(rating));
paintStars(rating);
```
