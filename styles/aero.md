# Aero

Glossy gel buttons, sky gradients and bubbles.

**Reach for it when:** Friendly consumer apps, travel and weather, family and education products.

## Signature details

- A sky-blue ground with green hills and slowly drifting bubbles behind the cards.
- Glossy gel controls: a top highlight over a saturated body.
- Rounded, friendly type; a bright sky-blue accent (`#0A84E8`).
- Soft white cards with generous radii.

## Fonts

Nunito.

- `--font`: `"Nunito",ui-rounded,system-ui,sans-serif`
- `--font-label`: `var(--font)`
- `--font-num`: `var(--font)`

## Set up

```html
<html data-skin="aero">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@500..800&display=swap">
<link rel="stylesheet" href="tokens/tokens.css">
```

## Core tokens

| Token | Value |
| --- | --- |
| `--fg` | `#0B2A4A` |
| `--muted` | `rgba(11,42,74,.62)` |
| `--faint` | `rgba(10,90,180,.1)` |
| `--accent` | `#0A84E8` |
| `--accent-ink` | `#fff` |
| `--tile-solid` | `#F2FAFF` |
| `--tile-radius` | `16px` |
| `--btn-bg` | `linear-gradient(180deg,#8BD6FF 0%,#2A9DF4 50%,#1279D4 51%,#48B8FF 100%)` |
| `--btn-fg` | `#fff` |
| `--good` | `#2DB84C` |
| `--bad` | `#E5484D` |
| `--warn` | `#F7B500` |
| `--chart-line` | `#0A84E8` |
| `--ring1` | `#2DB84C` |
| `--ring2` | `#0A84E8` |
| `--ring3` | `#F7B500` |

Every token for this style is in `tokens/tokens.css` under `[data-skin="aero"]` and in `tokens/tokens.json`.

## Do

Keep the gloss on controls and leave reading surfaces calm.

## Don't

Don't gloss every surface; text on glossy fills loses contrast.

See it live: open `demo/index.html` and pick **Aero** in the header.
