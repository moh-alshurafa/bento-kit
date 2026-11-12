# Hardware

Beveled keys, LCD readouts and signal orange, like a piece of audio gear.

**Reach for it when:** Music and audio apps, synth and IoT controllers, utilities with physical controls.

## Signature details

- Warm grey panels with raised, beveled buttons that press down 2px.
- Black LCD wells (`--lcd`) hold readouts and album art, which turns grayscale and multiplies into the screen.
- Condensed uppercase labels (Archivo at 75–80% width) with mono numerals.
- Signal orange accent (`#FF5A1F`) with a small status LED before lead labels; some tiles flip to a dark panel (`data-hw="dark"`).

## Fonts

Archivo, IBM Plex Mono.

- `--font`: `"Archivo",ui-sans-serif,system-ui,sans-serif`
- `--font-label`: `"Archivo",ui-sans-serif,system-ui,sans-serif`
- `--font-num`: `"IBM Plex Mono",ui-monospace,Menlo,monospace`

## Set up

```html
<html data-skin="hardware">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<link rel="stylesheet" href="tokens/tokens.css">
```

## Core tokens

| Token | Value |
| --- | --- |
| `--fg` | `#1A1A1A` |
| `--muted` | `#78736B` |
| `--faint` | `rgba(0,0,0,.07)` |
| `--accent` | `#FF5A1F` |
| `--accent-ink` | `#1A1A1A` |
| `--tile-solid` | `#E9E5DD` |
| `--tile-radius` | `10px` |
| `--btn-bg` | `#1C1C1C` |
| `--btn-fg` | `#EEEBE4` |
| `--good` | `#3E7B2C` |
| `--bad` | `#D23C1B` |
| `--warn` | `#FF5A1F` |
| `--chart-line` | `#222B1C` |
| `--ring1` | `#FF5A1F` |
| `--ring2` | `#1C1C1C` |
| `--ring3` | `#8E897F` |

Every token for this style is in `tokens/tokens.css` under `[data-skin="hardware"]` and in `tokens/tokens.json`.

## Do

Make every control look pressable and give it a pressed state.

## Don't

Don't use soft blurred shadows or glossy gradients; they read as screens, not objects.

See it live: open `demo/index.html` and pick **Hardware** in the header.
