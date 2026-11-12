# Layout: the bento grid

Bento Kit lays a screen out as a grid of cards (tiles) in a few fixed sizes. Use it for dashboards, home screens and feature sections. On phones the same cards stack in two columns, or one if you prefer.

## Grid

- Columns: 2 by default, 4 from 720px, 6 from 1024px, 8 from 1400px.
- Gap: 12px. Rows are 150px; from 1400px they are `clamp(132px, calc((100dvh - 164px) / 6), 176px)` so six rows fit one screen under the header.
- `grid-auto-flow: dense` lets small tiles fill the gaps.
- Sizes: 1×1 by default; `c2` spans two columns, `r2` two rows; use both for 2×2.
- From 1400px, named areas (`grid-template-areas`) place every tile exactly. Below that, source order and spans decide.

## Page

- Content is centred with a 1600px maximum width.
- Side gutters are `max(16px, env(safe-area-inset-left))` and the right-hand equivalent; 16px at the top, 28px at the bottom.
- The header bar (brand left, controls right) sits 14px above the grid and wraps to two rows below 1400px.

## Tile anatomy

- Padding 16px (14px from 1400px), a vertical flex column with a 9px gap.
- First row `.tl`: a label `.lbl` in the style's label face and `--muted`, plus an optional value `.lbl2` (tabular numerals) or text action `.tl-btn` (accent).
- Full-bleed media uses `.bleed` and sits under a scrim when text overlaps it.
- The surface comes from tokens: `--tile-bg`, `--tile-border`, `--tile-radius`, `--tile-shadow`.

## Composing your own screens

- Lead with the most important tile at 2×2, top left (top right in right-to-left layouts).
- Mix sizes: one or two 2×2 tiles, a few 2×1, the rest 1×1. A grid of identical tiles reads as a table.
- Group related tiles (media together, scheduling together) so the eye can scan by area.
- Keep every tile self-contained: its own label, value and action.
- On phones keep the order of importance and let tiles take the full width when they hold text.

## The CSS

From `demo/index.html`:

```css
/* ================= grid ================= */
.grid{position:relative;z-index:1;max-width:1600px;margin:0 auto;display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:150px;grid-auto-flow:dense;perspective:1600px}
.c2{grid-column:span 2}
.r2{grid-row:span 2}
@media (min-width:720px){.grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (min-width:1024px){.grid{grid-template-columns:repeat(6,minmax(0,1fr))}}
@media (min-width:1400px){
  .grid{grid-template-columns:repeat(8,minmax(0,1fr));grid-auto-rows:clamp(132px,calc((100dvh - 164px) / 6),176px);
    grid-template-areas:"player player photos photos cal cal weather clock" "player player toggles sliders ride ride notif notif" "search search toggles sliders ride ride notif notif" "todo chart chart price chat chat flip flip" "todo timer rating price chat chat wallet wallet" "knob rings keys swatch otp otp team like"}
  .a-player{grid-area:player}.a-photos{grid-area:photos}.a-cal{grid-area:cal}.a-weather{grid-area:weather}.a-clock{grid-area:clock}
  .a-toggles{grid-area:toggles}.a-sliders{grid-area:sliders}.a-ride{grid-area:ride}.a-notif{grid-area:notif}.a-search{grid-area:search}
  .a-todo{grid-area:todo}.a-chart{grid-area:chart}.a-price{grid-area:price}.a-chat{grid-area:chat}.a-flip{grid-area:flip}
  .a-timer{grid-area:timer}.a-rating{grid-area:rating}.a-wallet{grid-area:wallet}.a-knob{grid-area:knob}.a-rings{grid-area:rings}
  .a-keys{grid-area:keys}.a-swatch{grid-area:swatch}.a-otp{grid-area:otp}.a-team{grid-area:team}.a-like{grid-area:like}}

.tile{position:relative;min-width:0;min-height:0;padding:16px;display:flex;flex-direction:column;gap:9px;color:var(--fg);background:var(--tile-bg);border:var(--tile-border);border-radius:var(--tile-radius);box-shadow:var(--tile-shadow);overflow:hidden;isolation:isolate;transition:transform .45s var(--spring),box-shadow .45s var(--ease),border-color .3s}
@media (min-width:1400px){.tile{padding:14px}}
.tl{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:20px;flex:none}
.lbl{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-label);font-size:var(--label-size);font-weight:var(--label-weight);letter-spacing:var(--label-tracking);text-transform:var(--label-transform);color:var(--muted);white-space:nowrap;line-height:1.25}
.lbl2{font-family:var(--font-num);font-size:11.5px;color:var(--muted);font-variant-numeric:tabular-nums;white-space:nowrap}
.tl-btn{font-size:12px;font-weight:700;color:var(--accent);padding:2px 4px;border-radius:6px;white-space:nowrap;transition:opacity .2s,transform .2s var(--spring)}
.tl-btn:hover{opacity:.75}
.tl-btn:active{transform:scale(.94)}
.pt{position:absolute;z-index:6;border-radius:2px;pointer-events:none}
.dim{display:none}
.tile.pulse{animation:tpulse .9s ease}
@keyframes tpulse{30%{box-shadow:var(--tile-shadow),0 0 0 4px color-mix(in srgb,var(--accent) 55%,transparent)}}
```
