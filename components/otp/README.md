# One-time code

A six-digit verification code field.

**Use it for:** Sign-in, verification, PIN entry.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Typing moves to the next box, Backspace moves back, and pasting a code fills every box.
- A correct code hops the digits and turns them green; a wrong one shakes.
- Resend clears the boxes and updates the message.

## Accessibility

- Each box is a real input; the message under the boxes states the result in words, not colour alone.
- Attributes in use: `aria-label`.

## Tokens it reads

`--accent`, `--ctl`, `--ctl-border`, `--fg`, `--font-num`, `--good`, `--i`, `--muted`, `--spring`, `--tile-radius`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-otp a-otp c2" data-pop="6" aria-label="Two-step verification">
      <div class="tl"><span class="lbl lead">Two-step verification</span><button type="button" class="tl-btn" id="otpResend">Resend</button></div>
      <div class="otp" id="otp"></div>
      <p class="otp-msg" id="otpMsg">Enter the 6-digit code sent to •• 42</p>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .otp`).

```css
/* 12 otp */
.otp{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px;flex:1;align-items:center}
.otp input{width:100%;height:44px;padding:0;text-align:center;font-family:var(--font-num);font-size:20px;font-weight:650;border-radius:calc(var(--tile-radius) * .45);background:var(--ctl);border:var(--ctl-border);color:var(--fg);outline:none;caret-color:var(--accent);transition:transform .25s var(--spring),box-shadow .2s,background .2s,border-color .2s,color .2s}
.otp input:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 35%,transparent)}
.otp input.filled{transform:translateY(-2px)}
.otp.ok input{color:var(--good);animation:okhop .45s var(--spring) both;animation-delay:calc(var(--i) * 45ms)}
@keyframes okhop{50%{transform:translateY(-7px)}}
.otp.bad{animation:shake .4s}
@keyframes shake{20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
.otp-msg{font-size:12px;color:var(--muted);flex:none;transition:color .2s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.otp-msg.ok{color:var(--good);font-weight:600}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- otp ---------- */
const otp = $('#otp'), otpMsg = $('#otpMsg'), DEFMSG = 'Enter the 6-digit code sent to •• 42';
for (let i = 0; i < 6; i++){
  const inp = document.createElement('input');
  inp.type = 'text'; inp.inputMode = 'numeric'; inp.maxLength = 1; inp.autocomplete = i ? 'off' : 'one-time-code';
  inp.id = 'otp' + i; inp.setAttribute('aria-label', 'Digit ' + (i + 1)); inp.style.setProperty('--i', i);
  otp.appendChild(inp);
}
const boxes = $$('input', otp); let otpReset = 0;
function otpCheck(){
  boxes.forEach(b => b.classList.toggle('filled', !!b.value));
  const code = boxes.map(b => b.value).join('');
  otp.classList.remove('ok');
  if (code.length < 6){ otpMsg.textContent = DEFMSG; otpMsg.className = 'otp-msg'; return; }
  if (code === '000000'){ otp.classList.remove('bad'); void otp.offsetWidth; otp.classList.add('bad'); otpMsg.textContent = 'That code has expired. Tap Resend for a new one.'; otpMsg.className = 'otp-msg'; return; }
  otp.classList.add('ok'); otpMsg.textContent = 'Verified. Signing you in…'; otpMsg.className = 'otp-msg ok';
  clearTimeout(otpReset); otpReset = setTimeout(() => { boxes.forEach(b => { b.value = ''; }); otpCheck(); }, 3200);
}
boxes.forEach((b, i) => {
  b.addEventListener('input', () => { b.value = b.value.replace(/\D/g, '').slice(-1); if (b.value && boxes[i + 1]) boxes[i + 1].focus(); otpCheck(); });
  b.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !b.value && boxes[i - 1]){ boxes[i - 1].value = ''; boxes[i - 1].focus(); otpCheck(); }
    else if (e.key === 'ArrowLeft' && boxes[i - 1]) boxes[i - 1].focus();
    else if (e.key === 'ArrowRight' && boxes[i + 1]) boxes[i + 1].focus();
  });
  b.addEventListener('paste', e => {
    const t = ((e.clipboardData && e.clipboardData.getData('text')) || '').replace(/\D/g, '').slice(0, 6);
    if (!t) return; e.preventDefault();
    [...t].forEach((c, j) => { if (boxes[j]) boxes[j].value = c; });
    boxes[Math.min(5, t.length)].focus(); otpCheck();
  });
});
$('#otpResend').addEventListener('click', () => { clearTimeout(otpReset); boxes.forEach(b => { b.value = ''; }); otpCheck(); otpMsg.textContent = 'New code sent to •• 42'; });
async function otpType(code){ clearTimeout(otpReset); boxes.forEach(b => { b.value = ''; }); otpCheck(); for (let j = 0; j < code.length; j++){ await sleep(120); boxes[j].value = code[j]; otpCheck(); } }
```
