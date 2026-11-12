# Weather

Current conditions over a photo: temperature, condition and today's high and low.

**Use it for:** Travel, home and city dashboards.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Tap the temperature to switch between Celsius and Fahrenheit; the number counts to the new value.
- A gradient scrim keeps text readable over the photo.

## Accessibility

- The temperature is a button whose label says what it does.

## Tokens it reads

`--expo`, `--font-num`, `--spring`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-weather a-weather" id="weather" aria-label="Weather">
      <img class="wx-bg bleed" data-base="img/wx-wind.jpg" src="img/wx-wind.jpg" alt="">
      <div class="tl"><span class="lbl lead">Weather</span><svg class="wx-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 8.5h10.5a3 3 0 1 0-3-3M3 12.5h15a3 3 0 1 1-3 3M3 16.5h6"/></svg></div>
      <button type="button" class="wx-temp" id="wxTemp" aria-label="Switch temperature unit"><span id="wxT">21</span><span class="wx-u" id="wxU">°C</span></button>
      <div class="wx-meta" id="wxMeta">Windy · H 24° L 16°</div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .t-weather`).

```css
/* 3 weather */
.t-weather{color:#fff}
.wx-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;transition:transform 1.4s var(--expo)}
.t-weather::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(20,60,120,0),rgba(15,35,70,.45));pointer-events:none}
.t-weather:hover .wx-bg,.t-weather.gh .wx-bg{transform:scale(1.07)}
.t-weather .lbl{color:rgba(255,255,255,.9)}
.wx-ic{width:20px;height:20px;animation:sway 3.2s ease-in-out infinite}
@keyframes sway{50%{transform:translateX(3px)}}
.wx-temp{margin-top:auto;align-self:flex-start;display:flex;align-items:flex-start;font-family:var(--font-num);font-size:40px;font-weight:650;letter-spacing:-.04em;line-height:1;color:inherit;font-variant-numeric:tabular-nums;transition:transform .25s var(--spring)}
.wx-temp:active{transform:scale(.94)}
.wx-u{font-size:15px;margin:3px 0 0 3px;letter-spacing:0}
.wx-meta{font-size:12px;opacity:.92;white-space:nowrap}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- weather ---------- */
let wxC = true; const wxT = $('#wxT');
$('#wxTemp').addEventListener('click', () => {
  wxC = !wxC; const from = parseInt(wxT.textContent, 10) || 0;
  countUp(wxT, wxC ? 21 : 70, 650, v => Math.round(v), from);
  $('#wxU').textContent = wxC ? '°C' : '°F';
  $('#wxMeta').textContent = wxC ? 'Windy · H 24° L 16°' : 'Windy · H 75° L 61°';
});
```
