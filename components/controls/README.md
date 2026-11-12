# Quick controls

Control-centre toggles (Wi-Fi, Bluetooth, Focus, Airplane mode) and an Auto-lock switch.

**Use it for:** Settings, smart home, quick actions.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Each toggle tile presses with a spring; its icon fills with the accent when on.
- The switch slides its knob with a spring and stretches while held.

## Accessibility

- Toggle tiles use `aria-pressed`; the switch uses `role="switch"` and `aria-checked`.
- Attributes in use: `aria-checked`, `aria-checked="true"`, `aria-pressed`, `aria-pressed="false"`, `aria-pressed="true"`, `role="switch"`.

## Tokens it reads

`--accent`, `--accent-ink`, `--ctl`, `--ctl-border`, `--faint`, `--fg`, `--muted`, `--spring`, `--tile-radius`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-toggles a-toggles r2" data-pop="4" aria-label="Quick controls">
      <div class="tl"><span class="lbl lead">Controls</span><span class="lbl2">Studio</span></div>
      <div class="cc">
        <button type="button" class="cc-btn" aria-pressed="true" data-on="Studio 5G"><span class="cc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2.5 9a14 14 0 0 1 19 0M5.8 12.5a9.5 9.5 0 0 1 12.4 0M9.2 16a5 5 0 0 1 5.6 0"/><circle cx="12" cy="19.3" r="1.3" fill="currentColor" stroke="none"/></svg></span><b>Wi‑Fi</b><small>Studio 5G</small></button>
        <button type="button" class="cc-btn" aria-pressed="true" data-on="AirPods Pro"><span class="cc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 7.5 11 9-5.5 4.5v-18l5.5 4.5-11 9"/></svg></span><b>Bluetooth</b><small>AirPods Pro</small></button>
        <button type="button" class="cc-btn" id="ccFocus" aria-pressed="false" data-on="Until 18:00"><span class="cc-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 14.6A8.5 8.5 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1z"/></svg></span><b>Focus</b><small>Off</small></button>
        <button type="button" class="cc-btn" aria-pressed="false" data-on="On"><span class="cc-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></span><b>Airplane</b><small>Off</small></button>
      </div>
      <div class="sw-row"><span>Auto‑lock</span><button type="button" class="switch" id="swLock" role="switch" aria-checked="true" aria-label="Auto-lock"></button></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .cc`).

```css
/* 5 controls */
.cc{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:7px}
.cc-btn{display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;gap:3px;padding:9px;min-width:0;border-radius:calc(var(--tile-radius) * .6);background:var(--ctl);border:var(--ctl-border);text-align:left;transition:transform .3s var(--spring),background .3s,box-shadow .3s}
.cc-btn:active{transform:scale(.93)}
.cc-ic{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--faint);color:var(--fg);transition:background .35s,color .35s,transform .5s var(--spring),box-shadow .35s}
.cc-ic svg{width:15px;height:15px}
.cc-btn b{display:block;max-width:100%;font-size:12px;font-weight:700;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cc-btn small{display:block;max-width:100%;font-size:10.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cc-btn[aria-pressed="true"] .cc-ic{background:var(--accent);color:var(--accent-ink)}
.sw-row{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13px;font-weight:600;flex:none}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- controls ---------- */
$$('.cc-btn').forEach(b => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', String(on));
  $('small', b).textContent = on ? b.dataset.on : 'Off';
  if (!reduce) $('.cc-ic', b).animate([{transform: 'scale(.78)', offset: .3}, {transform: 'scale(1.14)', offset: .65}], {duration: 480, easing: 'ease-out'});
}));
$$('.switch').forEach(s => s.addEventListener('click', () => s.setAttribute('aria-checked', String(s.getAttribute('aria-checked') !== 'true'))));
```
