# Bento Kit

A design reference for building apps and websites, written for people and for AI coding agents. Nine complete visual styles share 27 live components, one bento grid and one motion language. Clone it, point your AI at `AGENTS.md`, and whatever it builds follows the same rules.

## See it

Clone or download the repo and open `demo/index.html` in a browser. It cycles through all nine styles; hover a card to pause it, or pick a style in the header.

## Use it with your AI

1. Clone it next to your project:

```bash
git clone https://github.com/moh-alshurafa/bento-kit.git
```

2. Ask for UI in a style, for example: "Build the settings screen in Bento Kit's Graphite style. Read bento-kit/AGENTS.md first."

3. To make it permanent, add this line to your project's `AGENTS.md` (or `CLAUDE.md`):

```text
Design reference: follow bento-kit/AGENTS.md for all UI work.
```

Claude Code can also import it directly: put `@bento-kit/AGENTS.md` in your `CLAUDE.md`.

## The nine styles

| Style | Character | Accent | Fonts |
| --- | --- | --- | --- |
| [Liquid Glass](styles/glass.md) | Frosted translucent cards over a colourful wallpaper | `#1B47C8` | Figtree |
| [Graphite](styles/graphite.md) | Near-black surfaces, hairlines, mono labels and one amber glow | `#F5B544` | Geist, Geist Mono |
| [Hardware](styles/hardware.md) | Beveled keys, LCD readouts and signal orange, like a piece of audio gear | `#FF5A1F` | Archivo, IBM Plex Mono |
| [Neo-Brutal](styles/brutal.md) | Thick outlines, hard offset shadows and candy colours | `#111` | Bricolage Grotesque |
| [Riso](styles/riso.md) | Two fluorescent inks, halftone photos and offset print | `#FF48B0` | DM Sans, DM Mono |
| [Bitmap](styles/bitmap.md) | 1-bit windows, dithered photos and pixel type | `#000` | Pixelify Sans, VT323 |
| [Aero](styles/aero.md) | Glossy gel buttons, sky gradients and bubbles | `#0A84E8` | Nunito |
| [Blueprint](styles/blueprint.md) | Cyanotype photos, dimension labels and a drafting grid | `#FFD54A` | JetBrains Mono |
| [Diwan (ديوان)](styles/diwan.md) | Arabic, right to left: porcelain and ink, brass detailing, one lime accent | `#89F336` | IBM Plex Sans Arabic, Reem Kufi, Amiri |

## What's inside

| Path | What it holds |
| --- | --- |
| `AGENTS.md` | The rules an AI follows: pick a style, use tokens, compose with the grid, motion and accessibility |
| `tokens/` | Every style's colours, fonts, radii and shadows as CSS variables and JSON |
| `components/` | 27 components, each with purpose, behaviour, accessibility notes and its exact markup, CSS and JavaScript |
| `styles/` | One guide per style: when to use it, signature details, palette, do's and don'ts |
| `docs/` | The grid, motion, accessibility, right to left, and recipes for apps and websites |
| `demo/` | The live showcase in one HTML file, with its images |
| `css/`, `js/` | The demo's stylesheet and scripts as standalone files |

## Credits

Photos are public domain or CC0; `CREDITS.md` lists each source. The Glass wallpaper is original artwork made for this kit. Fonts load from Google Fonts under the SIL Open Font License. Code is MIT licensed.
