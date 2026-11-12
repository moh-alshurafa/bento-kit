# Saved photo

A full-bleed photo with a like button and count.

**Use it for:** Social feeds, galleries, saved items.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- The heart toggles with a pop and a small particle burst; the count updates.
- Double-clicking the photo shows a large heart and likes it.

## Accessibility

- The like button uses `aria-pressed`; double-click is a shortcut, never the only way.
- Attributes in use: `aria-pressed`, `aria-pressed="false"`.

## Tokens it reads

`--expo`, `--spring`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-like a-like" id="likeTile" aria-label="Saved photo">
      <img class="lk-img bleed" id="lkImg" data-base="img/like-poppy.jpg" src="img/like-poppy.jpg" alt="Orange poppy. Double-click to like.">
      <span class="lk-big noanim" id="lkBig" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.3s-7.6-4.6-9.5-9.4C1.2 7.4 3.5 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.5 0 5.8 3.4 4.5 6.9-1.9 4.8-9.5 9.4-9.5 9.4z"/></svg></span>
      <div class="lk-foot"><span class="lk-cap">Poppy</span><button type="button" class="lk-btn" id="likeBtn" aria-pressed="false" aria-label="Like"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 20.3s-7.6-4.6-9.5-9.4C1.2 7.4 3.5 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.5 0 5.8 3.4 4.5 6.9-1.9 4.8-9.5 9.4-9.5 9.4z"/></svg><span id="likeN">1,284</span></button></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .t-like`).

```css
/* 16 like */
.t-like{padding:0!important;justify-content:flex-end}
.lk-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;cursor:pointer;transition:transform 1.4s var(--expo)}
.t-like::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,transparent 45%,rgba(0,0,0,.45));pointer-events:none}
.t-like:hover .lk-img,.t-like.gh .lk-img{transform:scale(1.06)}
.lk-big{position:absolute;left:50%;top:42%;width:60px;height:60px;margin:-30px 0 0 -30px;color:#fff;opacity:0;pointer-events:none;filter:drop-shadow(0 6px 16px rgba(0,0,0,.35))}
.lk-big svg{width:100%;height:100%}
.lk-foot{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:11px;color:#fff}
.lk-cap{font-size:12px;font-weight:700;text-shadow:0 1px 6px rgba(0,0,0,.35)}
.lk-btn{display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 10px;border-radius:999px;background:rgba(255,255,255,.92);color:#111;font-size:12px;font-weight:700;font-variant-numeric:tabular-nums;transition:transform .25s var(--spring),color .2s}
.lk-btn svg{width:14px;height:14px;transition:transform .45s var(--spring)}
.lk-btn span{display:inline-block}
.lk-btn.on{color:#E8364A}
.lk-btn.on svg{fill:currentColor;transform:scale(1.15)}
.lk-btn:active{transform:scale(.9)}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- like ---------- */
let liked = false, likes = 1284;
const likeBtn = $('#likeBtn'), likeN = $('#likeN'), likeTile = $('#likeTile'), lkBig = $('#lkBig');
function setLike(on){
  if (liked === on) return;
  liked = on; likes += on ? 1 : -1;
  likeBtn.classList.toggle('on', on); likeBtn.setAttribute('aria-pressed', String(on));
  likeN.textContent = likes.toLocaleString('en-US');
  if (reduce) return;
  likeN.animate([{transform: `translateY(${on ? 8 : -8}px)`, opacity: 0}, {transform: 'none', opacity: 1}], {duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)'});
  if (on){ const r = likeBtn.getBoundingClientRect(), t = likeTile.getBoundingClientRect(); particles(likeTile, r.left - t.left + 18, r.top - t.top + r.height / 2, 12, ['#E8364A', '#FF8A5B', '#FFC94D'], 32, 5); }
}
likeBtn.addEventListener('click', () => setLike(!liked));
function bigHeart(){
  if (reduce) return;
  lkBig.getAnimations().forEach(a => a.cancel());
  lkBig.animate([{opacity: 0, transform: 'scale(.3)'}, {opacity: 1, transform: 'scale(1.18)', offset: .35}, {opacity: 1, transform: 'scale(1)', offset: .6}, {opacity: 0, transform: 'scale(1.08) translateY(-10px)'}], {duration: 900, easing: 'ease-out'});
}
$('#lkImg').addEventListener('dblclick', () => { bigHeart(); setLike(true); });
```
