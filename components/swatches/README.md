# Palette

A colour palette: select a swatch to see its value; select it again to copy it.

**Use it for:** Theming, brand tools, product options.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- The selected swatch gets a ring and the label shows its name or hex; copying confirms in the label.

## Accessibility

- Swatches are buttons labelled with the colour's name.
- Attributes in use: `aria-label`.

## Tokens it reads

`--fg`, `--spring`, `--tile-radius`, `--tile-solid`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-swatch a-swatch" data-pop="4" aria-label="Palette">
      <div class="tl"><span class="lbl lead">Palette</span><span class="lbl2" id="swHex">#FF6A3D</span></div>
      <div class="sws" id="sws"></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .sws`).

```css
/* 25 swatches */
.sws{flex:1;min-height:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:7px}
.sw{position:relative;border-radius:calc(var(--tile-radius) * .42);box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);transition:transform .25s var(--spring),box-shadow .2s}
.sw:hover{transform:scale(1.06)}
.sw.on{box-shadow:0 0 0 2px var(--tile-solid),0 0 0 4px var(--fg);transform:scale(.94)}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- swatches ---------- */
const SW_NAMES = {bitmap: ['Black', 'White', 'Gray 50%', 'Gray 25%', 'Gray 75%', 'Stripes']};
const sws = $('#sws'); let swI = 0, swT = 0;
for (let i = 1; i <= 6; i++){ const b = document.createElement('button'); b.type = 'button'; b.className = 'sw'; b.style.background = `var(--sw${i})`; b.setAttribute('aria-label', 'Colour ' + i); b.addEventListener('click', () => pickSwatch(i - 1, true)); sws.appendChild(b); }
const swBtns = $$('.sw', sws);
function swLabel(i){ const names = SW_NAMES[skin]; return names ? names[i] : getComputedStyle(kit).getPropertyValue('--sw' + (i + 1)).trim().toUpperCase(); }
function renderSwatchLabel(){ $('#swHex').textContent = swLabel(swI); }
async function pickSwatch(i, copy){
  swI = i; swBtns.forEach((b, k) => b.classList.toggle('on', k === i));
  const label = swLabel(i); $('#swHex').textContent = label;
  if (copy && !SW_NAMES[skin]){
    try { await navigator.clipboard.writeText(label); $('#swHex').textContent = 'Copied'; clearTimeout(swT); swT = setTimeout(renderSwatchLabel, 900); } catch (err) { /* clipboard refused; keep the hex visible */ }
  }
}
pickSwatch(0, false);
```
