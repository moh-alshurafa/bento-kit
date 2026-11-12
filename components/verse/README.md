# Verse of the day

A verse of classical Arabic poetry: two hemistichs in Amiri, the poet's name, and a next button.

**Use it for:** Arabic editorial, quotes, daily content.

_Part of Diwan (Arabic, right to left)._

## Behaviour

- Next swaps the verse with a soft fade.
- The hemistichs sit side by side on wide screens and stack on narrow ones.

## Accessibility

- The verse is real text marked `lang="ar"`.

## Tokens it reads

`--brass`, `--font-verse`, `--ink`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-verse a-verse c2" aria-label="بيت اليوم">
      <div class="tl"><span class="lbl lead">بيت اليوم</span><span class="vr-meta"><span class="lbl2" id="vrPoet">المتنبي</span><button type="button" class="tl-btn" id="vrNext">التالي</button></span></div>
      <p class="vr-lines" id="vrLines"><span id="vrA">عَلى قَدْرِ أهْلِ العَزْمِ تأتي العَزائِمُ</span><svg class="vr-orn" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.8 2.8h3.9v3.9l2.8 2.8-2.8 2.8v3.9h-3.9L12 21.5l-2.8-2.8H5.3v-3.9L2.5 12l2.8-2.8V5.3h3.9z"/></svg><span id="vrB">وَتأتي عَلى قَدْرِ الكِرامِ المَكارِمُ</span></p>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .t-verse`).

```css
/* verse */
.t-verse{gap:4px}
.t-verse::after{content:"";position:absolute;inset-inline-start:-26px;top:-26px;width:110px;height:110px;z-index:-1;background:var(--brass);opacity:.08;pointer-events:none;
  -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='.6'><path d='M12 2.5l2.8 2.8h3.9v3.9l2.8 2.8-2.8 2.8v3.9h-3.9L12 21.5l-2.8-2.8H5.3v-3.9L2.5 12l2.8-2.8V5.3h3.9z'/></svg>") center/contain no-repeat;
  mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='.6'><path d='M12 2.5l2.8 2.8h3.9v3.9l2.8 2.8-2.8 2.8v3.9h-3.9L12 21.5l-2.8-2.8H5.3v-3.9L2.5 12l2.8-2.8V5.3h3.9z'/></svg>") center/contain no-repeat}
.vr-meta{display:inline-flex;align-items:center;gap:6px}
.vr-lines{flex:1;min-height:0;display:flex;align-items:center;justify-content:space-between;gap:12px;font-family:var(--font-verse);font-size:20px;line-height:1.9;color:var(--ink)}
.vr-lines span{flex:1;text-align:center;white-space:nowrap}
.vr-orn{flex:none;width:12px;height:12px;color:var(--brass)}
```

## Behaviour code

From `js/diwan.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- verse of the day ---------- */
const VERSES = [
  {a: 'عَلى قَدْرِ أهْلِ العَزْمِ تأتي العَزائِمُ', b: 'وَتأتي عَلى قَدْرِ الكِرامِ المَكارِمُ', p: 'المتنبي'},
  {a: 'الخَيْلُ وَاللّيْلُ وَالبَيْداءُ تَعرِفُني', b: 'وَالسّيفُ وَالرّمحُ وَالقِرْطاسُ وَالقَلَمُ', p: 'المتنبي'},
  {a: 'السَّيْفُ أَصْدَقُ أَنْبَاءً مِنَ الكُتُبِ', b: 'فِي حَدِّهِ الحَدُّ بَيْنَ الجِدِّ وَاللَّعِبِ', p: 'أبو تمّام'},
  {a: 'دَعِ الأَيَّامَ تَفْعَلُ مَا تَشَاءُ', b: 'وَطِبْ نَفْسًا إِذَا حَكَمَ القَضَاءُ', p: 'الشافعي'}
];
let vi = 0, vBusy = false;
async function nextVerse(){
  if (vBusy) return; vBusy = true;
  const A = $('#vrA'), B = $('#vrB'), P = $('#vrPoet');
  vi = (vi + 1) % VERSES.length; const v = VERSES[vi];
  if (!reduce) await Promise.all([A, B].map(el => el.animate([{opacity: 1}, {opacity: 0}], {duration: 200, fill: 'forwards'}).finished));
  A.textContent = v.a; B.textContent = v.b; P.textContent = v.p;
  [A, B].forEach(el => el.getAnimations().forEach(a => a.cancel()));
  if (!reduce) await Promise.all([A, B].map((el, k) => el.animate([{clipPath: 'inset(0 0 0 100%)', opacity: 1}, {clipPath: 'inset(0 0 0 0%)', opacity: 1}], {duration: 900, delay: k * 520, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards'}).finished));
  vBusy = false;
}
$('#vrNext').addEventListener('click', nextVerse);
```
