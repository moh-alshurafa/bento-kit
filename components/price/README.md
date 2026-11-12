# Pricing

A pricing card: Monthly/Yearly switch, rolling price digits, a savings badge, features and an Upgrade button.

**Use it for:** Pricing pages, paywalls, plan pickers.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Switching billing rolls the digits to the new price and reveals the yearly saving.
- Upgrade runs a busy state, then a done state, then resets (shared busy-button pattern).

## Accessibility

- The billing switch is a tablist; button text states each phase in words.
- Attributes in use: `aria-pressed`, `aria-pressed="false"`, `aria-pressed="true"`, `role="group"`.

## Tokens it reads

`--font-num`, `--good`, `--muted`, `--spring`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-price a-price r2" data-pop="2" aria-label="Pricing">
      <div class="tl"><span class="lbl lead">Pro plan</span><span class="save" id="prSave">Save 20%</span></div>
      <div class="seg pr-seg" id="prSeg" role="group" aria-label="Billing period"><span class="seg-pill" aria-hidden="true"></span><button type="button" data-b="m" aria-pressed="true">Monthly</button><button type="button" data-b="y" aria-pressed="false">Yearly</button></div>
      <div class="pr-price"><span class="pr-roll" id="prRoll"><b>$18</b></span><small id="prPer">/ month</small></div>
      <ul class="pr-feat">
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 10 18 19.5 7"/></svg>Unlimited projects</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 10 18 19.5 7"/></svg>Version history</li>
        <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 10 18 19.5 7"/></svg>Custom domains</li>
      </ul>
      <button type="button" class="btn" id="prBtn">Upgrade</button>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .save`).

```css
/* 11 price */
.save{font-size:11px;font-weight:700;color:var(--good);opacity:0;transform:translateY(4px) scale(.9);transition:opacity .3s,transform .4s var(--spring);white-space:nowrap}
.save.show{opacity:1;transform:none}
.pr-seg{width:100%}
.pr-seg button{padding:0 6px}
.pr-price{display:flex;align-items:baseline;gap:6px;flex:none}
.pr-roll{display:grid;overflow:hidden;height:44px;align-items:center}
.pr-roll b{grid-area:1/1;font-family:var(--font-num);font-size:36px;font-weight:750;letter-spacing:-.04em;line-height:44px;font-variant-numeric:tabular-nums}
.pr-price small{font-size:12px;color:var(--muted);white-space:nowrap}
.pr-feat{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;font-size:12px}
.pr-feat li{display:flex;align-items:center;gap:7px;white-space:nowrap}
.pr-feat svg{width:13px;height:13px;flex:none;color:var(--good)}
.t-price .btn{margin-top:auto;width:100%;padding:0 10px}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- price + busy buttons ---------- */
const PR = {m: {p: '$18', per: '/ month'}, y: {p: '$173', per: '/ year'}};
function roll(box, text, dir){
  const old = box.lastElementChild, nu = document.createElement('b'); nu.textContent = text; box.appendChild(nu);
  if (reduce){ old.remove(); return; }
  nu.animate([{transform: `translateY(${dir * 100}%)`, opacity: 0}, {transform: 'none', opacity: 1}], {duration: 480, easing: 'cubic-bezier(.34,1.56,.64,1)'});
  old.animate([{transform: 'none', opacity: 1}, {transform: `translateY(${-dir * 100}%)`, opacity: 0}], {duration: 320, easing: 'ease-in', fill: 'forwards'}).finished.then(() => old.remove(), () => old.remove());
}
seg($('#prSeg'), 'aria-pressed', b => { const k = b.dataset.b; roll($('#prRoll'), PR[k].p, k === 'y' ? 1 : -1); $('#prPer').textContent = PR[k].per; $('#prSave').classList.toggle('show', k === 'y'); });
async function busy(btn, idle, working, done, after){
  if (btn.dataset.busy) return; btn.dataset.busy = '1';
  btn.style.minWidth = btn.offsetWidth + 'px';
  btn.innerHTML = `<span class="spin"></span><span>${working}</span>`;
  await sleep(1050);
  btn.classList.add('ok'); btn.innerHTML = ICON.check + `<span>${done}</span>`;
  if (!reduce) btn.animate([{transform: 'scale(.94)'}, {transform: 'scale(1.04)'}, {transform: 'none'}], {duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)'});
  if (after) after();
  await sleep(1900);
  btn.classList.remove('ok'); btn.textContent = idle; btn.style.minWidth = ''; delete btn.dataset.busy;
}
$('#prBtn').addEventListener('click', e => busy(e.currentTarget, 'Upgrade', 'Processing', 'Upgraded'));
let teamMore = 5;
$('#inviteBtn').addEventListener('click', e => busy(e.currentTarget, 'Invite', 'Sending', 'Sent', () => {
  const m = $('#avMore'); teamMore++; m.textContent = '+' + teamMore;
  if (!reduce) m.animate([{transform: 'scale(.6)'}, {transform: 'scale(1.2)'}, {transform: 'none'}], {duration: 450, easing: 'cubic-bezier(.34,1.56,.64,1)'});
}));
```
