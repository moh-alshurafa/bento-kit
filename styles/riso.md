# Riso

Two fluorescent inks, halftone photos and offset print.

**Reach for it when:** Editorial sites, events and festivals, creative studios, culture and zines.

## Signature details

- Two inks only, fluorescent pink (`#FF48B0`) and blue, overprinting where they meet.
- Paper grain and halftone dot fields on the ground; photos become halftones.
- Shapes and shadows sit slightly out of register, like a real print run.
- Syne for display figures and titles, DM Mono for small figures and labels.

## Fonts

DM Sans, DM Mono.

- `--font`: `"DM Sans",ui-sans-serif,system-ui,sans-serif`
- `--font-label`: `"DM Mono",ui-monospace,Menlo,monospace`
- `--font-num`: `"DM Mono",ui-monospace,Menlo,monospace`

## Set up

```html
<html data-skin="riso">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..700&family=DM+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="tokens/tokens.css">
```

## Core tokens

| Token | Value |
| --- | --- |
| `--fg` | `#1F3C88` |
| `--muted` | `rgba(31,60,136,.66)` |
| `--faint` | `rgba(31,60,136,.12)` |
| `--accent` | `#FF48B0` |
| `--accent-ink` | `#1F3C88` |
| `--tile-solid` | `#F8F8F3` |
| `--tile-radius` | `6px` |
| `--btn-bg` | `#1F3C88` |
| `--btn-fg` | `#F8F8F3` |
| `--good` | `#0078BF` |
| `--bad` | `#FF48B0` |
| `--warn` | `#FF48B0` |
| `--chart-line` | `#FF48B0` |
| `--ring1` | `#FF48B0` |
| `--ring2` | `#0078BF` |
| `--ring3` | `#FFC800` |

Every token for this style is in `tokens/tokens.css` under `[data-skin="riso"]` and in `tokens/tokens.json`.

## Do

Let the two inks do all the work and use the paper colour for everything else.

## Don't

Don't introduce a third colour or full-colour photography.

See it live: open `demo/index.html` and pick **Riso** in the header.
