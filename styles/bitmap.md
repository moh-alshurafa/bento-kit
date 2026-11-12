# Bitmap

1-bit windows, dithered photos and pixel type.

**Reach for it when:** Retro and nostalgic products, games, lo-fi tools, playful developer utilities.

## Signature details

- Pure black on white with nothing in between: greys are 2×2 dither patterns (`url(#pt-d50)`), never tints.
- Photos swap to Atkinson-dithered 1-bit PNGs (`img/1bit/`) while this style is active.
- Square corners and window-like chrome; pixel fonts (Pixelify Sans, VT323).
- Selection is shown by inverting black and white.

## Fonts

Pixelify Sans, VT323.

- `--font`: `"Pixelify Sans",ui-monospace,Menlo,monospace`
- `--font-label`: `"Pixelify Sans",ui-monospace,Menlo,monospace`
- `--font-num`: `"VT323",ui-monospace,Menlo,monospace`

## Set up

```html
<html data-skin="bitmap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=VT323&display=swap">
<link rel="stylesheet" href="tokens/tokens.css">
```

## Core tokens

| Token | Value |
| --- | --- |
| `--fg` | `#000` |
| `--muted` | `#000` |
| `--faint` | `transparent` |
| `--accent` | `#000` |
| `--accent-ink` | `#fff` |
| `--tile-solid` | `#fff` |
| `--tile-radius` | `0px` |
| `--btn-bg` | `#fff` |
| `--btn-fg` | `#000` |
| `--good` | `#000` |
| `--bad` | `#000` |
| `--warn` | `#000` |
| `--chart-line` | `#000` |
| `--ring1` | `#000` |
| `--ring2` | `url(#pt-d50)` |
| `--ring3` | `url(#pt-hk)` |

Every token for this style is in `tokens/tokens.css` under `[data-skin="bitmap"]` and in `tokens/tokens.json`.

## Do

Use a pattern for every in-between value: chart areas, tracks, disabled states.

## Don't

Don't use colour or gradients; keep every edge crisp.

See it live: open `demo/index.html` and pick **Bitmap** in the header.
