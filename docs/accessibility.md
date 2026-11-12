# Accessibility

The components work with a keyboard, a screen reader and reduced motion. Keep these properties when you recreate them.

## Contrast

- Text needs at least 4.5:1 against the surface it sits on. Large text (24px, or 19px bold), icons, borders and focus rings need 3:1.
- Check every style you ship, not only the first. Check translucent styles against the wallpaper behind them: Glass uses a white fill from 80% to 60% and caps backdrop saturation at 130%, which keeps secondary text above 4.5:1 across its whole wallpaper.
- Text on an accent fill uses `--accent-ink` (Diwan: `--on-accent`), never an assumed white.
- Status never relies on colour alone: pair `--good` and `--bad` with a word or an icon.

## Keyboard

- Every control is a `button`, `input` or link, or has `tabindex="0"` with key handling.
- Sliders and knobs change with the arrow keys.
- The chart takes focus; the arrow keys step through its points.
- The command menu opens with ⌘K or Ctrl+K; arrows move and Enter runs.
- The one-time code advances as you type, goes back on Backspace and fills on paste.
- Focus is always visible: `outline: 2px solid var(--accent); outline-offset: 2px` (Diwan: `--accent-line`).

## Semantics

| Pattern | Markup |
| --- | --- |
| Toggle button | `aria-pressed="true"` or `"false"` |
| Switch | `role="switch"` with `aria-checked` |
| Segmented control | `role="tablist"` holding `role="tab"` buttons with `aria-selected` |
| Slider or knob | `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and a label |
| Star rating | `role="radio"` options, each labelled with its value |
| Command results | `role="option"` items with `aria-selected` |
| Chart | a visually hidden table with the same numbers |
| Decorative art | `aria-hidden="true"` |

## Pointer and touch

- Targets are at least 24×24px (WCAG 2.2); primary controls are 34px or more.
- Every hover or gesture has a click, tap or key equivalent: the like button beside double-click, the close button beside swipe-to-dismiss.
- Hovering a card pauses the showcase so people can read and play.

## Reduced motion

Honour `prefers-reduced-motion`; see `motion.md`. Anything that advances on its own must stop advancing.

## Right to left

See `rtl.md`.
