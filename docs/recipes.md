# Recipes: apps and websites with Bento Kit

## Start every project the same way

1. Pick one style (`AGENTS.md` has the chooser).
2. Load its fonts from `styles/<style>.md`.
3. Bring in the tokens: `tokens/tokens.css`, or the values from `tokens/tokens.json` mapped into your stack.
4. Compose screens from `components/`, laid out with `docs/layout.md`.
5. Check `docs/accessibility.md` before you ship.

## Tokens in your stack

Plain CSS:

```html
<html data-skin="graphite">
<link rel="stylesheet" href="bento-kit/tokens/tokens.css">
```

Tailwind CSS (keep the variables, switch styles with `data-skin`):

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        fg: 'var(--fg)', muted: 'var(--muted)', faint: 'var(--faint)',
        accent: 'var(--accent)', 'accent-ink': 'var(--accent-ink)',
        good: 'var(--good)', bad: 'var(--bad)', warn: 'var(--warn)',
      },
      borderRadius: { tile: 'var(--tile-radius)' },
      boxShadow: { tile: 'var(--tile-shadow)' },
      fontFamily: { sans: 'var(--font)', label: 'var(--font-label)', num: 'var(--font-num)' },
      transitionTimingFunction: { spring: 'var(--spring)', expo: 'var(--expo)' },
    },
  },
};
```

React, a tile:

```jsx
export function Tile({ label, value, action, className = '', children }) {
  return (
    <section className={`tile ${className}`} aria-label={label}>
      <div className="tl">
        <span className="lbl">{label}</span>
        {value ? <span className="lbl2">{value}</span> : action}
      </div>
      {children}
    </section>
  );
}
```

Native apps (SwiftUI, Jetpack Compose, Flutter): generate a theme from `tokens/tokens.json` and keep the token names, so `--accent` becomes `Theme.accent`.

## Screens

- **Dashboard:** the bento grid as is. Chart 2×1, notifications 2×2, calendar 2×1, then weather, clock, timer and rating as 1×1.
- **Landing page:** a hero in the style's display face, then a bento section where the cards are live components (player, chat, chart) instead of screenshots.
- **Mobile app:** one column of full-width tiles; the header becomes a top bar; a segmented control styled with `--seg-*` becomes the tab bar.
- **Settings:** quick controls, switches, sliders and segmented controls, grouped in tiles by topic.
- **Checkout and sign-in:** pricing, wallet and one-time code, with busy buttons for every network action.
- **Arabic app:** Diwan plus `docs/rtl.md`; add prayer times and the verse only where they fit the product.

## Before you ship

- One style per product, tokens only, no stray hex values.
- Contrast checked in every style and theme you ship.
- Keyboard, focus rings and screen-reader labels work.
- Reduced motion turns animation off.
- Real content, and images you are allowed to publish.
