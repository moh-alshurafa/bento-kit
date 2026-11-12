# Memories

A photo card that steps through a set of photos with a caption and progress dots.

**Use it for:** Galleries, highlights, stories, onboarding carousels.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- The active dot fills over 4.2 seconds; when it finishes, the next photo fades in and the caption updates.
- Previous, next and each dot jump straight to a photo.
- Hovering the card pauses the dot.

## Accessibility

- Dots are buttons labelled "Show <title>".
- With reduced motion the photos stop advancing on their own.
- Attributes in use: `aria-label`.

## Tokens it reads

`--spring`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-photos a-photos c2" id="photos" aria-label="Memories">
      <div class="ph-stack bleed" id="phStack">
        <img class="on" data-base="img/ph-reef.jpg" src="img/ph-reef.jpg" alt="Aerial view of a turquoise reef and sandy shore">
        <img data-base="img/ph-rail.jpg" src="img/ph-rail.jpg" alt="Railway tracks running between rows of shipping containers">
        <img data-base="img/ph-pool.jpg" src="img/ph-pool.jpg" alt="Indoor pool under a green ceiling with stairs leading down">
        <img data-base="img/ph-dusk.jpg" src="img/ph-dusk.jpg" alt="Dark clouds over a thin band of orange sunset">
      </div>
      <div class="ph-cap"><span class="lbl">Memories</span><b id="phTitle">Reef, from above</b><span id="phMeta">Coast · 24 photos</span></div>
      <div class="ph-dots" id="phDots"></div>
      <button type="button" class="ph-nav prev noanim" id="phPrev" aria-label="Previous photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg></button>
      <button type="button" class="ph-nav next noanim" id="phNext" aria-label="Next photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg></button>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .t-photos`).

```css
/* 2 photos */
.t-photos{padding:0!important;gap:0}
.ph-stack{position:absolute;inset:0}
.ph-stack img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.12);transition:opacity 1s ease,transform 7s linear}
.ph-stack img.on{opacity:1;transform:scale(1)}
.t-photos::after{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(0,0,0,0) 38%,rgba(0,0,0,.58));pointer-events:none}
.ph-cap{position:absolute;left:14px;bottom:12px;right:110px;z-index:2;color:#fff;display:flex;flex-direction:column;gap:2px;min-width:0}
.ph-cap .lbl{color:rgba(255,255,255,.82)}
.ph-cap b{font-size:15px;font-weight:700;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ph-cap span:last-child{font-size:12px;opacity:.85;white-space:nowrap}
.ph-dots{position:absolute;right:14px;bottom:16px;z-index:2;display:flex;gap:5px}
.ph-dots button{position:relative;width:7px;height:7px;border-radius:99px;background:rgba(255,255,255,.5);overflow:hidden;transition:width .45s var(--spring)}
.ph-dots button.on{width:24px}
.ph-dots button.on::after{content:"";position:absolute;inset:0;background:#fff;transform-origin:left;animation:dotfill 4.2s linear forwards}
.t-photos:hover .ph-dots button.on::after,.t-photos.gh .ph-dots button.on::after{animation-play-state:paused}
@keyframes dotfill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.ph-nav{position:absolute;top:calc(50% - 17px);z-index:3;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.88);color:#111;opacity:0;transition:opacity .25s,transform .25s var(--spring)}
.ph-nav svg{width:16px;height:16px}
.ph-nav.prev{left:12px}.ph-nav.next{right:12px}
.t-photos:hover .ph-nav,.t-photos.gh .ph-nav,.ph-nav:focus-visible{opacity:1}
.ph-nav:active{transform:scale(.86)}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- photos ---------- */
const photos = [
  {t: 'Reef, from above', m: 'Coast · 24 photos'},
  {t: 'The freight yard', m: 'Rail trip · 18 photos'},
  {t: 'Green room pool', m: 'Weekend away · 31 photos'},
  {t: 'Last light', m: 'Evening walk · 9 photos'}
];
const phImgs = $$('#phStack img'), phDots = $('#phDots'); let pi = 0;
photos.forEach((p, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Show ' + p.t); b.addEventListener('click', () => showPhoto(i)); phDots.appendChild(b); });
function showPhoto(i){
  pi = (i + photos.length) % photos.length;
  phImgs.forEach((im, k) => im.classList.toggle('on', k === pi));
  $('#phTitle').textContent = photos[pi].t; $('#phMeta').textContent = photos[pi].m;
  if (!reduce) [$('#phTitle'), $('#phMeta')].forEach((el, k) => el.animate([{opacity: 0, transform: 'translateY(6px)'}, {opacity: 1, transform: 'none'}], {duration: 460, delay: k * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
  $$('button', phDots).forEach((d, k) => { d.classList.remove('on'); if (k === pi){ void d.offsetWidth; d.classList.add('on'); } });
}
phDots.addEventListener('animationend', e => { if (e.animationName === 'dotfill') showPhoto(pi + 1); });
$('#phPrev').addEventListener('click', () => showPhoto(pi - 1));
$('#phNext').addEventListener('click', () => showPhoto(pi + 1));
showPhoto(0);
```
