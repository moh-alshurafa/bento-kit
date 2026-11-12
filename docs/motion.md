# Motion

Motion explains change: cards arrive, leave and answer the pointer. Everything uses three curves:

| Token | Value | Use |
| --- | --- | --- |
| `--spring` | `cubic-bezier(.34,1.56,.64,1)` | Presses, pops, toggles, sliding pills (it overshoots) |
| `--expo` | `cubic-bezier(.16,1,.3,1)` | Entrances, reveals, content swaps |
| `--ease` | `cubic-bezier(.2,.8,.2,1)` | Small state changes |

Diwan uses a softer spring, `cubic-bezier(.34,1.28,.64,1)`.

## Entrance and exit

Cards enter as a wave from the top left (Diwan: from the top right, its reading start). Each card's delay comes from its position: `(x / gridWidth × 0.55 + y / gridHeight × 0.45) × 620ms`.

- **Card in:** from `opacity: 0; transform: translateY(36px) scale(.9) rotateX(10deg); filter: blur(12px)` to rest over 1050ms on `--expo`.
- **Children in:** from `opacity: 0; translateY(14px)` over 760ms, starting 170ms after their card and 60ms apart.
- **Full-bleed images:** settle from `scale(1.22)` over 1600ms.
- **Out:** children fade in 240ms; the card rises 22px, shrinks to .94 and blurs 10px over 650ms on `cubic-bezier(.7,0,.84,0)`, delays spread over 420ms.
- **Diwan:** gentler (22px, scale .96, blur 6px, 1100ms in; 14px, .97, 6px, 680ms out).

## Micro-interactions

- **Press:** buttons scale to .92 (text buttons .94) on `--spring`.
- **Pop:** a choice scales up and back in 400–450ms (stars, checkboxes, the like heart).
- **Count-up:** numbers count to their value in 1000–1200ms on entrance and when they change.
- **Sliding selection:** segmented controls and the week strip move one pill on `--spring` over 500ms.
- **Particles:** a small burst for big moments only (finishing a checklist, liking).
- **Busy buttons:** spinner and working label, then a done label, then reset.
- **Pulse:** a tile rings briefly in its accent when a shortcut targets it (⌘K pulses the command menu).

## The showcase loop

The demo holds each style for 9.5 seconds, exits the cards, switches style and brings the cards back. A scripted demo cursor clicks through components while a style is on screen. Hovering any card pauses the loop; Space pauses and resumes it; the pause button in the header does the same. Your product does not need a loop: use the entrance on first load and the exit when leaving a screen.

## Reduced motion

With `prefers-reduced-motion: reduce`: no entrance, exit, loop or ambient animation; components show their resting state and still respond instantly; auto-advancing content (the photo carousel) stops advancing.

## Reference code

Entrance and exit from `js/bento-kit.js`:

```js
/* ---------- entrance / exit ---------- */
let live = [];
function delays(scale){
  const g = grid.getBoundingClientRect();
  return tiles.map(t => { const r = t.getBoundingClientRect(); return (((r.left - g.left) / Math.max(1, g.width)) * .55 + ((r.top - g.top) / Math.max(1, g.height)) * .45) * scale; });
}
const settle = list => Promise.all(list.map(a => a.finished.catch(() => {})));
const skipKid = c => c.classList.contains('noanim') || c.classList.contains('pt');
function animIn(){
  live.forEach(a => a.cancel()); live = [];
  if (reduce) return Promise.resolve();
  const ds = delays(620), all = [];
  tiles.forEach((t, i) => {
    const d = ds[i];
    all.push(t.animate([{opacity: 0, transform: 'translateY(36px) scale(.9) rotateX(10deg)', filter: 'blur(12px)'}, {opacity: 1, transform: 'none', filter: 'blur(0px)'}], {duration: 1050, delay: d, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
    let j = 0;
    for (const c of Array.from(t.children)){
      if (skipKid(c)) continue;
      if (c.classList.contains('bleed')) all.push(c.animate([{transform: 'scale(1.22)'}, {transform: 'none'}], {duration: 1600, delay: d, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
      else all.push(c.animate([{opacity: 0, transform: 'translateY(14px)'}, {opacity: 1, transform: 'none'}], {duration: 760, delay: d + 170 + j++ * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards'}));
    }
  });
  return settle(all);
}
function animOut(){
  if (reduce) return Promise.resolve();
  const ds = delays(420), all = [];
  tiles.forEach((t, i) => {
    const d = ds[i];
    for (const c of Array.from(t.children)){ if (skipKid(c) || c.classList.contains('bleed')) continue; all.push(c.animate([{opacity: 1}, {opacity: 0}], {duration: 240, delay: d, easing: 'ease-in', fill: 'forwards'})); }
    all.push(t.animate([{opacity: 1, transform: 'none', filter: 'blur(0px)'}, {opacity: 0, transform: 'translateY(-22px) scale(.94) rotateX(-8deg)', filter: 'blur(10px)'}], {duration: 650, delay: d + 70, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards'}));
  });
  live = all;
  return settle(all);
}
function onEnter(){
  if (reduce) return;
  ensureNf(3);
  setTimeout(() => {
    countUp($('#chNum'), DATA[range].total, 1200, money);
    countUp($('#wlAmt'), wlBal, 1200, money2, wlBal * .6);
    revealChart();
    countUp(wxT, wxC ? 21 : 70, 1000, v => Math.round(v));
    clockSweep(); vsB.intro(); vsV.intro(); tmIntro(); drawRings(true); knobIntro(); placeWk();
    const bar = $('#tdBar'); bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth; bar.style.transition = ''; tdSync();
  }, 380);
  setTimeout(() => addNf(true), 2600);
  setTimeout(() => incoming(0), 4200);
}
function preloadFonts(){
  if (!document.fonts || !document.fonts.load) return;
  ['600 16px "Geist"', '500 12px "Geist Mono"', '700 16px "Archivo"', '600 16px "IBM Plex Mono"', '800 16px "Bricolage Grotesque"', '800 16px "Syne"', '500 14px "DM Sans"', '500 12px "DM Mono"', '500 14px "Pixelify Sans"', '400 20px "VT323"', '700 14px "Nunito"', '500 12px "JetBrains Mono"']
    .forEach(f => document.fonts.load(f).catch(() => {}));
}
```
