# Neo-Brutal

Thick outlines, hard offset shadows and candy colours.

**Reach for it when:** Startups, marketing sites, portfolios, playful SaaS, education.

## Signature details

- Every card and control has a solid ink outline and a hard offset shadow with no blur.
- Buttons press into their shadow when clicked.
- Flat candy fills on an off-white dotted ground; ink is the accent.
- Big, tight display type.

## Fonts

Bricolage Grotesque.

- `--font`: `"Bricolage Grotesque",ui-sans-serif,system-ui,sans-serif`
- `--font-label`: `var(--font)`
- `--font-num`: `var(--font)`

## Set up

```html
<html data-skin="brutal">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap">
<link rel="stylesheet" href="tokens/tokens.css">
```

## Core tokens

| Token | Value |
| --- | --- |
| `--fg` | `#111` |
| `--muted` | `rgba(17,17,17,.68)` |
| `--faint` | `rgba(17,17,17,.1)` |
| `--accent` | `#111` |
| `--accent-ink` | `#fff` |
| `--tile-solid` | `#fff` |
| `--tile-radius` | `16px` |
| `--btn-bg` | `#111` |
| `--btn-fg` | `#fff` |
| `--good` | `#16A34A` |
| `--bad` | `#FF4F64` |
| `--warn` | `#FFB020` |
| `--chart-line` | `#111` |
| `--ring1` | `#FF4F64` |
| `--ring2` | `#2FCB74` |
| `--ring3` | `#4DB8FF` |

Every token for this style is in `tokens/tokens.css` under `[data-skin="brutal"]` and in `tokens/tokens.json`.

## Do

Keep outline widths and shadow offsets identical everywhere.

## Don't

Don't add blur, gradients or soft shadows; they break the print-like flatness.

See it live: open `demo/index.html` and pick **Brutal** in the header.
