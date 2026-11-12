# Keyboard shortcut

Physical-looking keycaps showing a shortcut (⌘ K).

**Use it for:** Shortcut hints, onboarding, documentation.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- The keys press down while the user holds ⌘ or Ctrl, or K, mirroring the real keyboard.

## Accessibility

- A decorative mirror of a shortcut that is also written as text.

## Tokens it reads

`--font-num`, `--key-bg`, `--key-edge`, `--key-fg`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-keys a-keys" data-pop="3" aria-label="Keyboard shortcut">
      <div class="tl"><span class="lbl lead">Shortcut</span><span class="lbl2">Search</span></div>
      <div class="keys"><button type="button" class="key" id="keyCmd" aria-label="Command key"><span>⌘</span></button><button type="button" class="key" id="keyK" aria-label="K key"><span>K</span></button></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .keys`).

```css
/* 24 keycaps */
.keys{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:8px}
.key{position:relative;width:50px;height:50px;border-radius:12px;background:var(--key-bg);color:var(--key-fg);font-family:var(--font-num);font-size:20px;font-weight:700;box-shadow:0 5px 0 var(--key-edge),0 8px 14px -6px rgba(0,0,0,.45);transition:transform .08s ease,box-shadow .08s ease,background .15s,color .15s}
.key span{position:absolute;inset:0;display:grid;place-items:center}
.key.down,.key:active{transform:translateY(4px);box-shadow:0 1px 0 var(--key-edge),0 3px 6px -4px rgba(0,0,0,.4)}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- keycaps ---------- */
const keyCmd = $('#keyCmd'), keyK = $('#keyK');
const pressKey = (k, on) => k.classList.toggle('down', on);
function tapKey(k){ pressKey(k, true); setTimeout(() => pressKey(k, false), 150); }
function pulseSearch(){ const t = $('.t-search'); t.classList.remove('pulse'); void t.offsetWidth; t.classList.add('pulse'); }
keyCmd.addEventListener('click', () => tapKey(keyCmd));
keyK.addEventListener('click', () => { tapKey(keyK); pulseSearch(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Meta' || e.key === 'Control') pressKey(keyCmd, true);
  if (e.key && e.key.toLowerCase() === 'k') pressKey(keyK, true);
  if ((e.metaKey || e.ctrlKey) && e.key && e.key.toLowerCase() === 'k'){ e.preventDefault(); cmdIn.focus(); pulseSearch(); }
});
document.addEventListener('keyup', e => {
  if (e.key === 'Meta' || e.key === 'Control') pressKey(keyCmd, false);
  if (e.key && e.key.toLowerCase() === 'k') pressKey(keyK, false);
});
addEventListener('blur', () => { pressKey(keyCmd, false); pressKey(keyK, false); });
```
