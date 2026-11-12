# Blueprint

Cyanotype photos, dimension labels and a drafting grid.

**Reach for it when:** Engineering and hardware teams, architecture, specs, documentation and developer portals.

## Signature details

- Deep cyanotype paper with a white drafting grid; cards are solid blue panels with corner brackets.
- Cards can label their own size (width × height) like a technical drawing.
- White line work, hatched fills (`url(#pt-hw)`), mono type; a yellow accent (`#FFD54A`).
- Photos are printed as cyanotypes.

## Fonts

JetBrains Mono.

- `--font`: `"JetBrains Mono",ui-monospace,Menlo,monospace`
- `--font-label`: `var(--font)`
- `--font-num`: `var(--font)`

## Set up

```html
<html data-skin="blueprint">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..700&display=swap">
<link rel="stylesheet" href="tokens/tokens.css">
```

## Core tokens

| Token | Value |
| --- | --- |
| `--fg` | `#EAF2FF` |
| `--muted` | `rgba(234,242,255,.64)` |
| `--faint` | `rgba(234,242,255,.1)` |
| `--accent` | `#FFD54A` |
| `--accent-ink` | `#0F3B82` |
| `--tile-solid` | `#0E3A80` |
| `--tile-radius` | `2px` |
| `--btn-bg` | `#FFD54A` |
| `--btn-fg` | `#0F3B82` |
| `--good` | `#7CF0B5` |
| `--bad` | `#FF8A80` |
| `--warn` | `#FFD54A` |
| `--chart-line` | `#FFD54A` |
| `--ring1` | `#FFD54A` |
| `--ring2` | `#EAF2FF` |
| `--ring3` | `#7CF0B5` |

Every token for this style is in `tokens/tokens.css` under `[data-skin="blueprint"]` and in `tokens/tokens.json`.

## Do

Draw with lines and hatching, and label things the way a drawing would.

## Don't

Don't make the panels translucent: they are solid so text stays readable over the grid.

See it live: open `demo/index.html` and pick **Blueprint** in the header.
