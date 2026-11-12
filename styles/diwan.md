# Diwan (ديوان)

Arabic, right to left: porcelain and ink, brass detailing, one lime accent.

**Reach for it when:** Arabic and right-to-left products, Gulf and Levant markets, premium lifestyle and finance.

## Signature details

- Porcelain cards on limestone by day and on ink by night; it follows the system theme.
- Brass detailing: an eight-point star lattice on the ground and star watermarks inside cards.
- One lime accent (`#89F336`) for fills, always with dark ink on top; a deeper lime (`#3F7A0A`) for text and lines in light mode.
- IBM Plex Sans Arabic for text, Reem Kufi for display, Amiri for poetry; Arabic-Indic digits and Hijri dates.
- Two components of its own: prayer times and a verse of the day.

## Fonts

IBM Plex Sans Arabic, Reem Kufi, Amiri.

- `--font`: `"IBM Plex Sans Arabic","Noto Sans Arabic","Segoe UI",Tahoma,sans-serif`
- `--font-display`: `"Reem Kufi","Noto Kufi Arabic","IBM Plex Sans Arabic",sans-serif`
- `--font-verse`: `"Amiri","Noto Naskh Arabic","Times New Roman",serif`

## Set up

```html
<html data-skin="diwan" dir="rtl" lang="ar">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Reem+Kufi:wght@400..700&family=Amiri:wght@400;700&display=swap">
<link rel="stylesheet" href="tokens/tokens.css">
```
Accent tokens inside Diwan: `--accent: var(--lime)` for fills, `--accent-line: var(--lime-line)` for text and lines, `--accent-soft` for washes, `--on-accent` for text on lime.

## Core tokens

| Token | Light | Dark |
| --- | --- | --- |
| `--bg` | `#E9E7E1` | `#0E1211` |
| `--surface` | `#FBFAF7` | `#161B19` |
| `--surface-2` | `#F1EFE9` | `#1D2321` |
| `--raised` | `#FFFFFF` | `#262D2A` |
| `--ink` | `#16191B` | `#ECEDE8` |
| `--muted` | `#6E6C66` | `#9BA29D` |
| `--line` | `rgba(22,25,27,.09)` | `rgba(236,237,232,.08)` |
| `--line-strong` | `rgba(22,25,27,.17)` | `rgba(236,237,232,.16)` |
| `--brass` | `#A07A42` | `#C7A46A` |
| `--lime` | `#89F336` | `#89F336` |
| `--lime-line` | `#3F7A0A` | `#89F336` |
| `--on-accent` | `#16191B` | `#0E1211` |
| `--good` | `#2E7D58` | `#5FB98C` |
| `--bad` | `#B4483B` | `#E07B6C` |
| `--warn` | `#A87A1E` | `#D7A54A` |
| `--ring1` | `#1C8F6B` | `#3E9E81` |
| `--ring2` | `#B4832C` | `#B4863A` |
| `--ring3` | `#4B6BC0` | `#6585D6` |

Every token for this style is in `tokens/tokens.css` under `[data-skin="diwan"]` and in `tokens/tokens.json`.

## Do

Mirror the layout with logical CSS properties, and keep left-to-right islands for numbers that read that way (card numbers, phone numbers, media scrubbers).

## Don't

Don't letter-space Arabic or set it in a Latin font, and don't add glows.

See it live: open `demo/index.html` and pick **Diwan** in the header.
