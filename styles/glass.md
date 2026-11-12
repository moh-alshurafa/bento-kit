# Liquid Glass

Frosted translucent cards over a colourful wallpaper.

**Reach for it when:** Consumer apps, media players, smart-home dashboards, launch pages.

## Signature details

- Cards blur what is behind them: `backdrop-filter: blur(30px) saturate(130%)` over a white fill that fades from 80% to 60% opacity.
- A bright 1px rim (`--tile-border`) and an inner top highlight make the edge read as glass.
- The backdrop is a full-bleed wallpaper: `img/bg-hills.jpg`, positioned `center 62% / cover`.
- One cobalt accent (`#1B47C8`) for actions and selection; hovered cards lift 3px.

## Fonts

Figtree.

- `--font`: `"Figtree",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif`
- `--font-label`: `var(--font)`
- `--font-num`: `var(--font)`

## Set up

```html
<html data-skin="glass">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400..800&display=swap">
<link rel="stylesheet" href="tokens/tokens.css">
```

## Core tokens

| Token | Value |
| --- | --- |
| `--fg` | `#111317` |
| `--muted` | `rgba(17,19,23,.68)` |
| `--faint` | `rgba(17,19,23,.09)` |
| `--accent` | `#1B47C8` |
| `--accent-ink` | `#fff` |
| `--tile-solid` | `#fff` |
| `--tile-radius` | `24px` |
| `--btn-bg` | `#111317` |
| `--btn-fg` | `#fff` |
| `--good` | `#096232` |
| `--bad` | `#C81E2C` |
| `--warn` | `#F4A11C` |
| `--chart-line` | `#1B47C8` |
| `--ring1` | `#D8204A` |
| `--ring2` | `#12803A` |
| `--ring3` | `#0F6FB0` |

Every token for this style is in `tokens/tokens.css` under `[data-skin="glass"]` and in `tokens/tokens.json`.

## Do

Keep text on the frosted fill, and check contrast against the brightest and darkest parts of the wallpaper you use.

## Don't

Don't push saturation above 130% or the fill below 60%: the wallpaper starts to fight the text. Never set accent text straight on the wallpaper.

See it live: open `demo/index.html` and pick **Glass** in the header.
