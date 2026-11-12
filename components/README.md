# Components

27 components, each in its own folder with its purpose, behaviour, accessibility notes and the exact markup, CSS and JavaScript from the demo. Recreate them in your stack with the same anatomy, states and motion; take every colour, font, radius and shadow from tokens.

| Component | What it is |
| --- | --- |
| [Music player](player/README.md) | A now-playing card: album art, track and artist, an equalizer, a scrub bar and transport controls. |
| [Memories](photos/README.md) | A photo card that steps through a set of photos with a caption and progress dots. |
| [Weather](weather/README.md) | Current conditions over a photo: temperature, condition and today's high and low. |
| [Clock](clock/README.md) | An analog clock face with tick marks and a digital readout. |
| [Quick controls](controls/README.md) | Control-centre toggles (Wi-Fi, Bluetooth, Focus, Airplane mode) and an Auto-lock switch. |
| [Brightness and volume](sliders/README.md) | Two vertical fill sliders. |
| [Notifications](notifications/README.md) | A live stack of notifications: new ones slide in on top; swipe or close to dismiss; Clear all empties it. |
| [Command menu](search/README.md) | A search field with a ⌘K shortcut over a filtered list of commands with icons and key hints. |
| [Checklist](todo/README.md) | A checklist with a count and a progress bar. |
| [Revenue chart](chart/README.md) | A line chart with a 7D/30D/90D range switch, a total, a change badge and a crosshair tooltip. |
| [Pricing](price/README.md) | A pricing card: Monthly/Yearly switch, rolling price digits, a savings badge, features and an Upgrade button. |
| [One-time code](otp/README.md) | A six-digit verification code field. |
| [Break timer](timer/README.md) | A countdown ring with play and pause. |
| [Rating](rating/README.md) | Five stars with a word label. |
| [Team](team/README.md) | An avatar stack with online indicators, an overflow count and an Invite button. |
| [Saved photo](like/README.md) | A full-bleed photo with a like button and count. |
| [Week calendar](week-calendar/README.md) | A week strip with a sliding selection pill, a today marker and the selected day's event. |
| [Ride tracker](ride/README.md) | A stylised map with an animated route and car, an arrival estimate, and the driver with message and call buttons. |
| [Chat](chat/README.md) | A message thread with a composer. |
| [Flip countdown](flip-countdown/README.md) | A split-flap countdown in hours, minutes and seconds. |
| [Wallet](wallet/README.md) | A payment card with balance, the last transaction and a Pay button. |
| [Knob](knob/README.md) | A rotary knob with a value arc and tick marks. |
| [Activity rings](activity-rings/README.md) | Three concentric progress rings with their values. |
| [Keyboard shortcut](keycaps/README.md) | Physical-looking keycaps showing a shortcut (⌘ K). |
| [Palette](swatches/README.md) | A colour palette: select a swatch to see its value; select it again to copy it. |
| [Prayer times](prayer-times/README.md) | Today's five prayer times, computed on the device, with the next prayer highlighted and a countdown ring. |
| [Verse of the day](verse/README.md) | A verse of classical Arabic poetry: two hemistichs in Amiri, the poet's name, and a next button. |

## Building blocks every component shares

- **Tile**: the card. `section.tile` with a first row `.tl` holding a label (`.lbl`) and an optional value (`.lbl2`) or text action (`.tl-btn`). See `docs/layout.md`.
- **Buttons**: primary `.btn` (`--btn-*` tokens), secondary `.btn.alt` (`--btn2-*`), icon buttons `.ib`.
- **Switch**: `.switch` with `role="switch"` and `aria-checked`.
- **Segmented control**: `.seg` with a sliding `.seg-pill`, `role="tablist"` and `role="tab"` buttons.
- **Busy buttons**: a button shows a spinner and a working label, then a done label, then resets (Pricing, Team, Wallet).

### Shared CSS

```css
/* shared controls */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:38px;padding:0 16px;border-radius:var(--btn-radius);background:var(--btn-bg);color:var(--btn-fg);border:var(--btn-border);box-shadow:var(--btn-shadow);font-weight:650;font-size:13.5px;white-space:nowrap;transition:transform .25s var(--spring),box-shadow .25s,filter .2s,background .3s}
.btn:hover{filter:brightness(1.06)}
.btn:active{transform:scale(.96)}
.btn.alt{background:var(--btn2-bg);color:var(--btn2-fg);border:var(--btn2-border);box-shadow:var(--btn2-shadow)}
.btn.sm{height:32px;font-size:12.5px;padding:0 12px}
.btn.ok,.btn.alt.ok{background:var(--good);color:#fff}
.btn svg{width:15px;height:15px}
.spin{width:14px;height:14px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.ib{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;color:var(--fg);transition:transform .25s var(--spring),background .2s,color .2s}
.ib:hover{background:var(--faint)}
.ib:active{transform:scale(.86)}
.ib svg{width:18px;height:18px}
.ib[aria-pressed="true"]{color:var(--accent)}
.switch{position:relative;flex:none;width:46px;height:28px;border-radius:999px;background:var(--ctl);border:var(--ctl-border);transition:background .3s,box-shadow .3s,border-color .3s}
.switch::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:999px;background:var(--knob);box-shadow:var(--knob-shadow);transition:left .45s var(--spring),width .2s var(--ease),background .3s,box-shadow .3s}
.switch:active::after{width:28px}
.switch[aria-checked="true"]{background:var(--accent)}
.switch[aria-checked="true"]::after{left:21px}
.switch[aria-checked="true"]:active::after{left:15px}
.track{position:relative;height:6px;border-radius:999px;background:var(--ctl);border:var(--ctl-border);cursor:pointer;touch-action:none}
.track .fill{position:absolute;inset:0 auto 0 0;width:var(--p,30%);border-radius:inherit;background:var(--fill)}
.track .knob{position:absolute;top:50%;left:var(--p,30%);width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:var(--knob);box-shadow:var(--knob-shadow);transform:scale(0);transition:transform .25s var(--spring)}
.track:hover .knob,.track.drag .knob,.tile.gh .track .knob{transform:scale(1)}
kbd{font-family:var(--font-num);font-size:10.5px;padding:2px 6px;border-radius:5px;border:1px solid var(--faint);color:var(--muted);flex:none}
```
