# Prayer times

Today's five prayer times, computed on the device, with the next prayer highlighted and a countdown ring.

**Use it for:** Muslim lifestyle apps, calendars, Arabic dashboards.

_Part of Diwan (Arabic, right to left)._

## Behaviour

- Times come from a solar-position calculation with Umm al-Qura conventions: Fajr at 18.5° below the horizon, Isha 90 minutes after Maghrib, standard Asr. The demo computes Riyadh.
- The next prayer's row is highlighted and the ring shows the time remaining.
- Each row has a bell toggle for its reminder.

## Accessibility

- Times are text with Arabic-Indic digits; the bells are labelled toggle buttons.
- Attributes in use: `aria-label`, `aria-pressed`.

## Tokens it reads

`--accent-line`, `--accent-soft`, `--brass`, `--ease`, `--font-display`, `--ink`, `--muted`, `--spring`, `--surface-2`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-prayer a-prayer c2 r2" aria-label="مواقيت الصلاة">
      <div class="tl"><span class="lbl lead">مواقيت الصلاة</span><span class="lbl2">الرياض · حساب فلكي</span></div>
      <div class="pr-hero">
        <div class="pr-next"><small>الصلاة القادمة</small><b id="prName">العصر</b><p class="pr-cd">بعد <span id="prCd">١:٤٢:٠٩</span></p></div>
        <div class="pr-ring" aria-hidden="true"><svg class="rg" viewBox="0 0 100 100"><circle class="t" cx="50" cy="50" r="44"/><circle class="a" id="prArc" cx="50" cy="50" r="44" pathLength="100"/></svg><svg class="pr-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M12 2.5l2.8 2.8h3.9v3.9l2.8 2.8-2.8 2.8v3.9h-3.9L12 21.5l-2.8-2.8H5.3v-3.9L2.5 12l2.8-2.8V5.3h3.9z"/></svg></div>
      </div>
      <ul class="pr-list" id="prList"></ul>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .t-prayer`).

```css
/* prayer times */
.t-prayer{gap:10px}
.t-prayer::after{content:"";position:absolute;inset-inline-end:-34px;bottom:-34px;width:150px;height:150px;z-index:-1;background:var(--brass);opacity:.09;pointer-events:none;
  -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='.7'><path d='M12 2.5l2.8 2.8h3.9v3.9l2.8 2.8-2.8 2.8v3.9h-3.9L12 21.5l-2.8-2.8H5.3v-3.9L2.5 12l2.8-2.8V5.3h3.9z'/><circle cx='12' cy='12' r='4.2'/></svg>") center/contain no-repeat;
  mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='.7'><path d='M12 2.5l2.8 2.8h3.9v3.9l2.8 2.8-2.8 2.8v3.9h-3.9L12 21.5l-2.8-2.8H5.3v-3.9L2.5 12l2.8-2.8V5.3h3.9z'/><circle cx='12' cy='12' r='4.2'/></svg>") center/contain no-repeat}
.pr-hero{display:flex;align-items:center;justify-content:space-between;gap:12px;flex:none}
.pr-next{min-width:0}
.pr-next small{display:block;font-size:12px;color:var(--muted);line-height:1.3}
.pr-next b{display:block;font-family:var(--font-display);font-size:30px;font-weight:600;line-height:1.2}
.pr-cd{font-size:13px;color:var(--muted)}
.pr-cd span{color:var(--ink);font-weight:600;font-variant-numeric:tabular-nums}
.pr-ring{position:relative;width:70px;height:70px;flex:none}
.pr-ring svg.rg{width:100%;height:100%;transform:rotate(-90deg) scaleY(-1)}
.pr-ring circle{fill:none;stroke-width:6;stroke-linecap:round}
.pr-ring .t{stroke:var(--surface-2)}
.pr-ring .a{stroke:var(--accent-line);stroke-dasharray:100;transition:stroke-dashoffset 1s var(--ease),stroke .5s var(--ease)}
.pr-star{position:absolute;inset:0;margin:auto;width:24px;height:24px;color:var(--brass)}
.pr-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px;flex:1;min-height:0}
.pr-row{display:flex;align-items:center;gap:10px;flex:1;min-height:0;padding-inline:10px 4px;border-radius:10px;font-size:13px;transition:background .4s var(--ease),color .4s}
.pr-row b{flex:1;font-weight:500}
.pr-row time{font-variant-numeric:tabular-nums;color:var(--muted)}
.pr-row.past{color:var(--muted)}
.pr-row.next{background:var(--accent-soft)}
.pr-row.next b{font-weight:700}
.pr-row.next time{color:var(--ink);font-weight:600}
.pr-bell{flex:none;width:28px;height:28px;border-radius:8px;display:grid;place-items:center;color:var(--muted);transition:color .2s,background .2s,transform .25s var(--spring)}
.pr-bell:hover{background:var(--surface-2)}
.pr-bell svg{width:15px;height:15px}
.pr-bell[aria-pressed="true"]{color:var(--accent-line)}
.pr-bell.ring svg{animation:bell .6s ease}
@keyframes bell{20%{transform:rotate(14deg)}40%{transform:rotate(-12deg)}60%{transform:rotate(8deg)}80%{transform:rotate(-4deg)}}
```

## Behaviour code

From `js/diwan.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- prayer times (astronomical, Umm al-Qura angles) ---------- */
const PRAYERS = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
const RIYADH = {lat: 24.7136, lng: 46.6753, tz: 3};
const prayTimes = (() => {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const fixA = a => ((a % 360) + 360) % 360, fixH = h => ((h % 24) + 24) % 24;
  const sin = d => Math.sin(d * D2R), cos = d => Math.cos(d * D2R), tan = d => Math.tan(d * D2R);
  const asin = x => Math.asin(x) * R2D, acos = x => Math.acos(clamp(x, -1, 1)) * R2D, atan2 = (y, x) => Math.atan2(y, x) * R2D, acot = x => Math.atan(1 / x) * R2D;
  function julian(y, m, d){ if (m <= 2){ y -= 1; m += 12; } const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5; }
  function sunPos(jd){ const D = jd - 2451545.0, g = fixA(357.529 + .98560028 * D), q = fixA(280.459 + .98564736 * D), L = fixA(q + 1.915 * sin(g) + .020 * sin(2 * g)), e = 23.439 - .00000036 * D; return {decl: asin(sin(e) * sin(L)), eqt: q / 15 - fixH(atan2(cos(e) * sin(L), cos(L)) / 15)}; }
  return (y, m, d, {lat, lng, tz}) => {
    const jd = julian(y, m, d) - lng / (15 * 24);
    const mid = t => fixH(12 - sunPos(jd + t).eqt);
    const angleTime = (ang, t, ccw) => { const decl = sunPos(jd + t).decl, T = acos((-sin(ang) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat))) / 15; return mid(t) + (ccw ? -T : T); };
    const asr = (f, t) => { const decl = sunPos(jd + t).decl; return angleTime(-acot(f + tan(Math.abs(lat - decl))), t); };
    const adj = tz - lng / 15;
    const maghrib = angleTime(.833, 18 / 24) + adj;
    return [angleTime(18.5, 5 / 24, true) + adj, mid(12 / 24) + adj, asr(1, 13 / 24) + adj, maghrib, maghrib + 1.5];
  };
})();
const t12 = hours => { let h = Math.floor(hours), m = Math.round((hours - h) * 60); if (m === 60){ h += 1; m = 0; } const suf = (h % 24) < 12 ? 'ص' : 'م'; return ar(`${(h % 12) || 12}:${String(m).padStart(2, '0')}`) + ' ' + suf; };
const prList = $('#prList'), prArc = $('#prArc');
const bells = [false, true, true, false, true];
PRAYERS.forEach((n, i) => {
  const li = document.createElement('li'); li.className = 'pr-row';
  li.innerHTML = `<b></b><time></time><button type="button" class="pr-bell"></button>`;
  $('b', li).textContent = n;
  const bell = $('.pr-bell', li);
  bell.addEventListener('click', () => { bells[i] = !bells[i]; paintBell(i); bell.classList.remove('ring'); void bell.offsetWidth; if (bells[i]) bell.classList.add('ring'); });
  prList.appendChild(li);
});
const prRows = $$('.pr-row', prList);
function paintBell(i){ const b = $('.pr-bell', prRows[i]); b.setAttribute('aria-pressed', String(bells[i])); b.setAttribute('aria-label', (bells[i] ? 'إلغاء تنبيه ' : 'تفعيل تنبيه ') + PRAYERS[i]); b.innerHTML = bells[i] ? ICON.bell : ICON.bellOff; }
PRAYERS.forEach((_, i) => paintBell(i));
function riyadhNow(){ const d = new Date(Date.now() + RIYADH.tz * 3600e3); return {y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600}; }
let prNextIdx = 2, prLastName = '';
function prayerTick(){
  const n = riyadhNow();
  const today = prayTimes(n.y, n.m, n.d, RIYADH);
  let list = today, idx = today.findIndex(t => t > n.h), next, prev, afterIsha = false;
  if (idx === -1){
    const tm = new Date(Date.UTC(n.y, n.m - 1, n.d + 1));
    list = prayTimes(tm.getUTCFullYear(), tm.getUTCMonth() + 1, tm.getUTCDate(), RIYADH);
    idx = 0; next = list[0] + 24; prev = today[4]; afterIsha = true;
  } else { next = today[idx]; prev = idx > 0 ? today[idx - 1] : today[4] - 24; }
  prNextIdx = idx;
  prRows.forEach((li, i) => { $('time', li).textContent = t12(list[i]); li.classList.toggle('next', i === idx); li.classList.toggle('past', !afterIsha && i < idx); });
  const left = Math.max(0, Math.round((next - n.h) * 3600));
  const hh = Math.floor(left / 3600), mm2 = String(Math.floor(left % 3600 / 60)).padStart(2, '0'), ss2 = String(left % 60).padStart(2, '0');
  $('#prCd').textContent = ar(hh ? `${hh}:${mm2}:${ss2}` : `${mm2}:${ss2}`);
  if (PRAYERS[idx] !== prLastName){ prLastName = PRAYERS[idx]; $('#prName').textContent = prLastName; }
  prArc.style.strokeDashoffset = String(100 - clamp((n.h - prev) / (next - prev), 0, 1) * 100);
}
prayerTick(); setInterval(prayerTick, 1000);
function prayerIntro(){ prArc.style.transition = 'none'; prArc.style.strokeDashoffset = '100'; void prArc.getBoundingClientRect(); prArc.style.transition = ''; requestAnimationFrame(prayerTick); setTimeout(prayerTick, 60); }
```
