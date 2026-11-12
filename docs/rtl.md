# Right to left with Diwan

Diwan is Bento Kit's Arabic, right-to-left style. These rules apply to any RTL product (Arabic, Hebrew, Persian, Urdu).

## Set up

- Put `dir="rtl"` and `lang="ar"` on the root of the RTL interface.
- Load IBM Plex Sans Arabic (text), Reem Kufi (display) and Amiri (poetry); the link is in `styles/diwan.md`.
- Use `[data-skin="diwan"]` from `tokens/tokens.css`. Light and dark follow the system theme.

## Layout

- Use logical properties everywhere: `margin-inline-start`, `padding-inline`, `inset-inline-start`, `border-start-start-radius`, `text-align: start`.
- The grid fills from the right on its own under `dir="rtl"`.
- Entrances sweep from the right, the reading start.
- Mirror icons that point (back, next, send, progress). Leave the rest alone (play, clock, search).

## Numbers and dates

- Arabic-Indic digits: `new Intl.NumberFormat('ar-EG')`. The demo's `ar()` helper converts any string.
- Saudi riyal: the number followed by `ر.س`.
- Hijri dates: `new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', {day: 'numeric', month: 'long', year: 'numeric'})`.
- Keep left-to-right islands (`dir="ltr"` or `<bdi>`) for what reads left to right: card numbers, one-time codes, phone numbers, media scrub bars.

## Charts

Time runs right to left: the oldest point sits at the right and the newest at the left, where the end dot and its label go.

## Type

- Never letter-space Arabic; it breaks the joins.
- Give Arabic a little more size and line height than Latin (body line height 1.5 or more).
- Use real bold weights; never fake bold or italic.

## Prayer times

The demo computes times on the device from the sun's position, with Umm al-Qura conventions: Fajr when the sun is 18.5° below the horizon, Dhuhr at solar noon, Asr when an object's shadow equals its length plus its noon shadow, Maghrib at sunset, Isha 90 minutes after Maghrib. Riyadh (24.7136, 46.6753, UTC+3) is the configured city; change the coordinates for another city. See `components/prayer-times`.
