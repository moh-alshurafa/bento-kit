# Bento Kit: instructions for AI agents

Use this repository as the design reference whenever you build UI with it: apps, websites, dashboards, components. Bento Kit has nine complete visual styles that share 27 components, one grid and one motion language. Follow these rules in any framework.

## Workflow

1. **Pick one style.** Use the style the person asks for. If they name none, choose from the table below by product type and tell them which you chose. Never mix styles on a screen.
2. **Read the style guide** at `styles/<style>.md`: fonts, signature details, do's and don'ts.
3. **Load its fonts** with the Google Fonts link in that guide, keeping the fallback stacks from the tokens.
4. **Take every colour, font, radius and shadow from tokens.** Import `tokens/tokens.css` and set `data-skin="<style>"` on the root, or copy values from `tokens/tokens.json` into the project's theme. Never type a hex value a token already covers.
5. **Build from the components.** Check `components/README.md` before inventing UI. Recreate a component in the target stack with the same anatomy, states, keyboard support and motion its README describes.
6. **Lay screens out with the bento grid** (`docs/layout.md`); on phones, stack the same cards.
7. **Apply motion and accessibility** from `docs/motion.md` and `docs/accessibility.md` on every screen.
8. **Right-to-left products** (Arabic, Hebrew, Persian, Urdu) use Diwan and `docs/rtl.md`.

## Choosing a style

| Style | Character | Reach for it when | Accent |
| --- | --- | --- | --- |
| [Liquid Glass](styles/glass.md) | Frosted translucent cards over a colourful wallpaper | Consumer apps, media players, smart-home dashboards, launch pages | `#1B47C8` |
| [Graphite](styles/graphite.md) | Near-black surfaces, hairlines, mono labels and one amber glow | Pro tools, analytics, developer consoles, trading and finance, night-time use | `#F5B544` |
| [Hardware](styles/hardware.md) | Beveled keys, LCD readouts and signal orange, like a piece of audio gear | Music and audio apps, synth and IoT controllers, utilities with physical controls | `#FF5A1F` |
| [Neo-Brutal](styles/brutal.md) | Thick outlines, hard offset shadows and candy colours | Startups, marketing sites, portfolios, playful SaaS, education | `#111` |
| [Riso](styles/riso.md) | Two fluorescent inks, halftone photos and offset print | Editorial sites, events and festivals, creative studios, culture and zines | `#FF48B0` |
| [Bitmap](styles/bitmap.md) | 1-bit windows, dithered photos and pixel type | Retro and nostalgic products, games, lo-fi tools, playful developer utilities | `#000` |
| [Aero](styles/aero.md) | Glossy gel buttons, sky gradients and bubbles | Friendly consumer apps, travel and weather, family and education products | `#0A84E8` |
| [Blueprint](styles/blueprint.md) | Cyanotype photos, dimension labels and a drafting grid | Engineering and hardware teams, architecture, specs, documentation and developer portals | `#FFD54A` |
| [Diwan (ديوان)](styles/diwan.md) | Arabic, right to left: porcelain and ink, brass detailing, one lime accent | Arabic and right-to-left products, Gulf and Levant markets, premium lifestyle and finance | `#89F336` |

## Hard rules

- Text meets 4.5:1 contrast on its surface; icons, borders, focus rings and large text meet 3:1. Check every style and theme you ship.
- Every interactive element is a real `button`, `input` or link, reachable by keyboard, with a visible focus ring (2px solid accent, 2px offset).
- Expose state: `aria-pressed` on toggle buttons, `role="switch"` with `aria-checked` on switches, `role="tab"` with `aria-selected` inside a `role="tablist"` for segmented controls, `role="slider"` with value attributes for sliders and knobs.
- Respect `prefers-reduced-motion`: no entrance, exit or ambient motion, and nothing advances on its own.
- One accent per style for actions and selection. `--good`, `--bad` and `--warn` are for status only, always with a word or icon.
- Cards take their surface, border, radius and shadow from tokens. Don't add extra borders, coloured side rails or a second shadow.
- Use real content, and only images the project may publish.

## Tokens you will use most

| Token | Role |
| --- | --- |
| `--fg`, `--muted`, `--faint` | Main text, secondary text and labels, hairlines and tracks |
| `--accent`, `--accent-ink` | Actions and selection; text on the accent |
| `--tile-bg`, `--tile-border`, `--tile-radius`, `--tile-shadow` | The card surface |
| `--btn-*`, `--btn2-*` | Primary and secondary buttons |
| `--seg-*` | Segmented controls |
| `--good`, `--bad`, `--warn` | Status |
| `--font`, `--font-label`, `--font-num` | Body text, labels, numerals |
| `--spring`, `--expo`, `--ease` | Motion curves |

Diwan uses its own Arabic set (`--bg`, `--surface`, `--ink`, `--brass`, `--lime`, `--on-accent` …); see `styles/diwan.md`.

## Where things are

| Path | Contents |
| --- | --- |
| `styles/` | One guide per style |
| `tokens/tokens.css`, `tokens/tokens.json` | Every token for every style |
| `components/` | 27 components with behaviour, accessibility and their real markup, CSS and JS |
| `docs/layout.md` | The bento grid and tile anatomy |
| `docs/motion.md` | Curves, entrance and exit, micro-interactions, reduced motion |
| `docs/accessibility.md` | Contrast, keyboard, semantics |
| `docs/rtl.md` | Right-to-left rules (Diwan) |
| `docs/recipes.md` | Tokens in Tailwind, React and native apps; screen recipes |
| `demo/index.html` | The live showcase: the source everything here was generated from |

When a doc and the demo disagree, the demo wins.
