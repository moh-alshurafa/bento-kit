# Notifications

A live stack of notifications: new ones slide in on top; swipe or close to dismiss; Clear all empties it.

**Use it for:** Inboxes, activity feeds, alerts.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Drag a card sideways: it follows the pointer with a slight rotation and flies off past a threshold.
- Clear all dismisses cards one after another, 70ms apart.
- An empty state appears when nothing is left.

## Accessibility

- Every card has a labelled close button, so swiping is never the only way to dismiss.

## Tokens it reads

`--font-num`, `--muted`, `--nf-bg`, `--nf-border`, `--nf-shadow`, `--spring`, `--tile-radius`, `--tile-solid`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-notif a-notif c2 r2" aria-label="Notifications">
      <div class="tl"><span class="lbl lead">Notifications</span><button type="button" class="tl-btn" id="nfClear">Clear all</button></div>
      <div class="nf-list" id="nfList"><p class="nf-empty" id="nfEmpty" hidden>You’re all caught up</p></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .nf-list`).

```css
/* 7 notifications */
.nf-list{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;gap:8px;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 82%,transparent);mask-image:linear-gradient(180deg,#000 82%,transparent)}
.nf{position:relative;flex:none;display:flex;gap:11px;align-items:center;padding:9px 11px;border-radius:calc(var(--tile-radius) * .62);background:var(--nf-bg);border:var(--nf-border);box-shadow:var(--nf-shadow);touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:grab;transition:transform .5s var(--spring),opacity .4s}
.nf.grab{cursor:grabbing}
.nf-av{flex:none;width:36px;height:36px;border-radius:50%;object-fit:cover}
.nf-body{min-width:0;flex:1}
.nf-top{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.nf-top b{font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nf-top time{flex:none;font-family:var(--font-num);font-size:11px;color:var(--muted);transition:opacity .2s}
.nf-body p{margin-top:2px;font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nf-x{position:absolute;top:6px;right:6px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:var(--tile-solid);color:var(--muted);opacity:0;transform:scale(.7);transition:opacity .2s,transform .25s var(--spring)}
.nf-x svg{width:12px;height:12px}
.nf:hover .nf-x,.nf-x:focus-visible{opacity:1;transform:none}
.nf:hover time{opacity:0}
.nf-empty{position:absolute;inset:0;display:grid;place-items:center;font-size:13px;color:var(--muted)}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- notifications ---------- */
const people = [
  {n: 'Lina Haddad', av: 'img/av-owl.jpg', m: 'Can we ship the yearly toggle today?'},
  {n: 'Omar Saleh', av: 'img/av-parrot.jpg', m: 'Left 3 comments on Pricing v4'},
  {n: 'Deploy bot', av: 'img/av-penguin.jpg', m: 'harbour-web is live on production · 42s'},
  {n: 'Maya Chen', av: 'img/av-zebra.jpg', m: 'Shared 24 photos with you'},
  {n: 'Sami Nasser', av: 'img/av-eagle.jpg', m: 'Booked the studio for Thursday 10:00'}
];
const nfList = $('#nfList'), nfEmpty = $('#nfEmpty'); let np = 0;
const liveNf = () => $$('.nf', nfList).filter(x => !x.dataset.gone);
function nfEl(p, time){
  const el = document.createElement('div'); el.className = 'nf';
  el.innerHTML = '<img class="nf-av" alt=""><div class="nf-body"><div class="nf-top"><b></b><time></time></div><p></p></div><button type="button" class="nf-x" aria-label="Dismiss">' + SI('<path d="M7 7l10 10M17 7 7 17"/>') + '</button>';
  const im = $('img', el); im.dataset.base = p.av; im.src = srcFor(p.av);
  $('b', el).textContent = p.n; $('time', el).textContent = time; $('p', el).textContent = p.m;
  $('.nf-x', el).addEventListener('click', ev => { ev.stopPropagation(); dismissNf(el, 1); });
  swipeable(el);
  return el;
}
function addNf(animate){
  const p = people[np++ % people.length];
  $$('.nf time', nfList).forEach(t => { if (t.textContent === 'now') t.textContent = '1m'; });
  const el = nfEl(p, 'now'); nfList.prepend(el); nfEmpty.hidden = true;
  if (animate && !reduce) el.animate([{opacity: 0, transform: 'translateY(-18px) scale(.95)'}, {opacity: 1, transform: 'none'}], {duration: 560, easing: 'cubic-bezier(.34,1.56,.64,1)'});
  liveNf().slice(4).forEach(x => dismissNf(x, 0));
}
function dismissNf(el, dir){
  if (el.dataset.gone) return; el.dataset.gone = '1';
  const cs = getComputedStyle(el), h = el.offsetHeight, pt = cs.paddingTop, pb = cs.paddingBottom;
  el.style.transition = 'none';
  const out = dir ? [{transform: cs.transform === 'none' ? 'none' : cs.transform, opacity: cs.opacity}, {transform: `translateX(${dir * 115}%) rotate(${dir * 5}deg)`, opacity: 0}] : [{opacity: 1}, {opacity: 0}];
  const finish = () => { el.remove(); if (!liveNf().length) nfEmpty.hidden = false; };
  if (reduce){ finish(); return; }
  el.animate(out, {duration: dir ? 320 : 220, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards'}).finished
    .then(() => el.animate([{height: h + 'px', paddingTop: pt, paddingBottom: pb, marginBottom: '0px'}, {height: '0px', paddingTop: '0px', paddingBottom: '0px', marginBottom: '-8px'}], {duration: 280, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards'}).finished)
    .then(finish, finish);
}
function swipeable(el){
  let x0 = null, dx = 0;
  el.addEventListener('pointerdown', e => { if (e.target.closest('.nf-x') || el.dataset.gone) return; x0 = e.clientX; dx = 0; el.setPointerCapture(e.pointerId); el.style.transition = 'none'; el.classList.add('grab'); });
  el.addEventListener('pointermove', e => { if (x0 === null) return; dx = e.clientX - x0; el.style.transform = `translateX(${dx}px) rotate(${(dx * .025).toFixed(2)}deg)`; el.style.opacity = String(1 - Math.min(.6, Math.abs(dx) / 320)); });
  const end = () => { if (x0 === null) return; x0 = null; el.classList.remove('grab'); el.style.transition = ''; if (Math.abs(dx) > 80) dismissNf(el, Math.sign(dx)); else { el.style.transform = ''; el.style.opacity = ''; } };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}
$('#nfClear').addEventListener('click', () => liveNf().forEach((el, i) => setTimeout(() => dismissNf(el, 1), i * 70)));
function ensureNf(n){ for (let i = liveNf().length; i < n; i++) addNf(false); }
[['now', 0], ['4m', 1], ['12m', 2], ['1h', 3]].forEach(([t, k]) => nfList.insertBefore(nfEl(people[k], t), nfEmpty));
np = 4;
```
