# Graphite

Near-black surfaces, hairlines, mono labels and one amber glow.

**Reach for it when:** Pro tools, analytics, developer consoles, trading and finance, night-time use.

## Signature details

- Near-black ground with cards one step lighter, separated by hairline borders instead of shadows.
- A single amber accent (`#F5B544`) that glows softly on primary controls, switches, chart lines and rings.
- A radial highlight follows the pointer across each card (`--mx`, `--my`).
- Times, values and labels in the mono face; photos are desaturated so amber stays the only colour.

## Fonts

Geist, Geist Mono.

- `--font`: `"Geist",ui-sans-serif,system-ui,sans-serif`
- `--font-label`: `"Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace`
- `--font-num`: `"Geist",ui-sans-serif,system-ui,sans-serif`

## Set up

```html
<html data-skin="graphite">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&display=swap">
<link rel="stylesheet" href="tokens/tokens.css">
```

## Core tokens

| Token | Value |
| --- | --- |
| `--fg` | `#ECEDF0` |
| `--muted` | `#80858F` |
| `--faint` | `rgba(255,255,255,.07)` |
| `--accent` | `#F5B544` |
| `--accent-ink` | `#1A1206` |
| `--tile-solid` | `#101215` |
| `--tile-radius` | `16px` |
| `--btn-bg` | `#F5B544` |
| `--btn-fg` | `#1A1206` |
| `--good` | `#3DD68C` |
| `--bad` | `#FF6B6B` |
| `--warn` | `#F5B544` |
| `--chart-line` | `#F5B544` |
| `--ring1` | `#F5B544` |
| `--ring2` | `#FFD089` |
| `--ring3` | `#9C7432` |

Every token for this style is in `tokens/tokens.css` under `[data-skin="graphite"]` and in `tokens/tokens.json`.

## Do

Spend the glow on the one or two things that matter on a screen.

## Don't

Don't add a second accent hue, and don't put glows on secondary elements.

See it live: open `demo/index.html` and pick **Graphite** in the header.
