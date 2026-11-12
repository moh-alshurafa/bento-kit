# Wallet

A payment card with balance, the last transaction and a Pay button.

**Use it for:** Banking, wallets, checkout.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- The card tilts toward the pointer; clicking (or Enter and Space) flips it to its back.
- Pay runs busy and done states, then lowers the balance and records the payment.

## Accessibility

- The card is focusable and flips from the keyboard.
- Attributes in use: `aria-label`, `role="button"`.

## Tokens it reads

`--card-bg`, `--card-fg`, `--flip`, `--font-num`, `--gx`, `--gy`, `--muted`, `--rx`, `--ry`, `--spring`, `--tile-radius`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-wallet a-wallet c2" data-pop="3" aria-label="Wallet">
      <div class="wl-card" id="wlCard" role="button" tabindex="0" aria-label="Flip card">
        <div class="wl-in">
          <div class="wl-face wl-front"><span class="wl-chip"></span><svg class="wl-nfc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 7a7 7 0 0 1 0 10M12 4.5a11 11 0 0 1 0 15M16 2a14.5 14.5 0 0 1 0 20"/></svg><span class="wl-num">•••• 4242</span><span class="wl-name">L. HADDAD</span><span class="wl-exp">09/29</span><i class="wl-glare"></i></div>
          <div class="wl-face wl-back"><span class="wl-strip"></span><span class="wl-sig">Lina Haddad</span><span class="wl-cvv">•••</span></div>
        </div>
      </div>
      <div class="wl-side">
        <span class="lbl lead">Balance</span>
        <b class="wl-amt" id="wlAmt">$2,480.15</b>
        <span class="wl-last" id="wlLast">−$18.00 · Pro plan</span>
        <button type="button" class="btn sm" id="wlPay">Pay $4.50</button>
      </div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .t-wallet`).

```css
/* 21 wallet */
.t-wallet{flex-direction:row;align-items:stretch;gap:14px}
.wl-card{position:relative;height:100%;aspect-ratio:1.586;max-width:58%;flex:none;perspective:700px;cursor:pointer;border-radius:calc(var(--tile-radius) * .55)}
.wl-in{position:absolute;inset:0;transform-style:preserve-3d;transform:rotateX(var(--rx,0deg)) rotateY(calc(var(--flip,0deg) + var(--ry,0deg)));transition:transform .6s var(--spring)}
.wl-card.flipped{--flip:180deg}
.wl-card.tilt .wl-in{transition:transform .12s ease-out}
.wl-card.flipping .wl-in{transition:transform .7s var(--spring)}
.wl-face{position:absolute;inset:0;border-radius:calc(var(--tile-radius) * .55);background:var(--card-bg);color:var(--card-fg);-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden;box-shadow:0 10px 22px -12px rgba(0,0,0,.55)}
.wl-back{transform:rotateY(180deg)}
.wl-chip{position:absolute;left:10%;top:30%;width:17%;aspect-ratio:1.3;border-radius:3px;background:linear-gradient(135deg,#F3D58A,#C9A24B);box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}
.wl-nfc{position:absolute;right:9%;top:13%;width:13%;opacity:.85}
.wl-num{position:absolute;left:10%;bottom:27%;font-family:var(--font-num);font-size:12.5px;letter-spacing:.12em;font-weight:600;white-space:nowrap}
.wl-name{position:absolute;left:10%;bottom:10%;font-size:8px;letter-spacing:.14em;opacity:.85;white-space:nowrap}
.wl-exp{position:absolute;right:9%;bottom:10%;font-size:8px;letter-spacing:.08em;opacity:.85}
.wl-glare{position:absolute;inset:0;background:radial-gradient(140px circle at var(--gx,30%) var(--gy,20%),rgba(255,255,255,.4),transparent 50%);mix-blend-mode:soft-light;pointer-events:none}
.wl-strip{position:absolute;left:0;right:0;top:16%;height:20%;background:rgba(0,0,0,.75)}
.wl-sig{position:absolute;left:8%;bottom:26%;right:30%;height:17%;display:flex;align-items:center;padding-left:6px;font-size:9px;font-style:italic;color:#333;background:repeating-linear-gradient(45deg,rgba(255,255,255,.88) 0 3px,rgba(255,255,255,.68) 3px 6px)}
.wl-cvv{position:absolute;right:10%;bottom:29%;font-family:var(--font-num);font-size:11px;letter-spacing:.1em}
.wl-side{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;gap:2px}
.wl-amt{font-family:var(--font-num);font-size:21px;font-weight:750;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.1;white-space:nowrap}
.wl-last{max-width:100%;font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- wallet ---------- */
const wlCard = $('#wlCard'); let wlFlipped = false, wlBal = 2480.15;
function tilt(px, py){
  wlCard.style.setProperty('--ry', ((px - .5) * 22).toFixed(1) + 'deg'); wlCard.style.setProperty('--rx', ((.5 - py) * 18).toFixed(1) + 'deg');
  wlCard.style.setProperty('--gx', (px * 100).toFixed(0) + '%'); wlCard.style.setProperty('--gy', (py * 100).toFixed(0) + '%');
  wlCard.classList.add('tilt');
}
function untilt(){ wlCard.classList.remove('tilt'); wlCard.style.setProperty('--rx', '0deg'); wlCard.style.setProperty('--ry', '0deg'); }
wlCard.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = wlCard.getBoundingClientRect(); tilt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); });
wlCard.addEventListener('pointerleave', untilt);
function flipCard(){ wlFlipped = !wlFlipped; wlCard.classList.add('flipping'); wlCard.classList.toggle('flipped', wlFlipped); wlCard.setAttribute('aria-label', wlFlipped ? 'Show card front' : 'Flip card'); setTimeout(() => wlCard.classList.remove('flipping'), 750); }
wlCard.addEventListener('click', flipCard);
wlCard.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); flipCard(); } });
$('#wlPay').addEventListener('click', e => busy(e.currentTarget, 'Pay $4.50', 'Paying', 'Paid', () => {
  const from = wlBal; wlBal = Math.round((wlBal - 4.5) * 100) / 100;
  countUp($('#wlAmt'), wlBal, 700, money2, from);
  $('#wlLast').textContent = '−$4.50 · Corner Coffee';
  if (!reduce) wlCard.animate([{transform: 'scale(1)'}, {transform: 'scale(.93)'}, {transform: 'scale(1)'}], {duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)'});
}));
```
