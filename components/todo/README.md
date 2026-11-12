# Checklist

A checklist with a count and a progress bar.

**Use it for:** Onboarding, launch checklists, task lists.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Checking an item strikes it through and pops its box.
- The progress bar springs to the new total.
- Completing every item bursts confetti from the bar.

## Accessibility

- Items are keyboard-operable and expose their checked state.
- Attributes in use: `aria-checked`, `aria-checked="false"`, `aria-checked="true"`, `role="checkbox"`.

## Tokens it reads

`--accent`, `--accent-ink`, `--ctl`, `--ctl-border`, `--ease`, `--faint`, `--good`, `--muted`, `--spring`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-todo a-todo r2" id="todoTile" data-pop="3" aria-label="Launch checklist">
      <div class="tl"><span class="lbl lead">Launch list</span><span class="lbl2" id="tdCount">2/5</span></div>
      <div class="td-list">
        <button type="button" class="td done" role="checkbox" aria-checked="true"><span class="box"><svg viewBox="0 0 16 16"><path d="M3 8.5 6.5 12 13 4.5"/></svg></span><span class="txt">Write release notes</span></button>
        <button type="button" class="td done" role="checkbox" aria-checked="true"><span class="box"><svg viewBox="0 0 16 16"><path d="M3 8.5 6.5 12 13 4.5"/></svg></span><span class="txt">QA on staging</span></button>
        <button type="button" class="td" role="checkbox" aria-checked="false"><span class="box"><svg viewBox="0 0 16 16"><path d="M3 8.5 6.5 12 13 4.5"/></svg></span><span class="txt">Update pricing page</span></button>
        <button type="button" class="td" role="checkbox" aria-checked="false"><span class="box"><svg viewBox="0 0 16 16"><path d="M3 8.5 6.5 12 13 4.5"/></svg></span><span class="txt">Record the demo loop</span></button>
        <button type="button" class="td" role="checkbox" aria-checked="false"><span class="box"><svg viewBox="0 0 16 16"><path d="M3 8.5 6.5 12 13 4.5"/></svg></span><span class="txt">Send launch email</span></button>
      </div>
      <div class="td-bar"><i id="tdBar"></i></div>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .td-list`).

```css
/* 9 todo */
.td-list{flex:1;min-height:0;display:flex;flex-direction:column;gap:1px}
.td{display:flex;align-items:center;gap:9px;padding:6px;margin:0 -6px;border-radius:8px;text-align:left;font-size:12.5px;transition:background .15s}
.td:hover{background:var(--faint)}
.box{flex:none;width:18px;height:18px;border-radius:6px;border:1.6px solid var(--muted);display:grid;place-items:center;transition:background .25s,border-color .25s,box-shadow .25s}
.box svg{width:11px;height:11px;fill:none;stroke:var(--accent-ink);stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:18;stroke-dashoffset:18;transition:stroke-dashoffset .35s .05s var(--ease)}
.td.done .box{background:var(--accent);border-color:var(--accent)}
.td.done .box svg{stroke-dashoffset:0}
.td.pop .box{animation:boxpop .45s var(--spring)}
@keyframes boxpop{40%{transform:scale(1.28)}}
.txt{position:relative;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .3s}
.txt::after{content:"";position:absolute;left:0;top:55%;height:1.5px;width:0;background:currentColor;transition:width .35s var(--ease)}
.td.done .txt{color:var(--muted)}
.td.done .txt::after{width:100%}
.td-bar{height:6px;flex:none;border-radius:99px;background:var(--ctl);border:var(--ctl-border);overflow:hidden}
.td-bar i{display:block;height:100%;width:40%;background:var(--good);border-radius:inherit;transition:width .7s var(--spring)}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- todo ---------- */
const tds = $$('.td'), todoTile = $('#todoTile');
function tdSync(){ const d = tds.filter(t => t.classList.contains('done')).length; $('#tdCount').textContent = `${d}/${tds.length}`; $('#tdBar').style.width = (d / tds.length * 100) + '%'; return d; }
tds.forEach(t => t.addEventListener('click', () => {
  const on = !t.classList.contains('done');
  t.classList.toggle('done', on); t.setAttribute('aria-checked', String(on));
  if (on){ t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop'); }
  if (tdSync() === tds.length){ const b = $('.td-bar', todoTile), r = b.getBoundingClientRect(), tr = todoTile.getBoundingClientRect(); particles(todoTile, r.left - tr.left + r.width / 2, r.top - tr.top, 22, ['#FF6A3D', '#13A35B', '#F4A11C', '#3C9BE0'], 90, 6); }
}));
function resetTodos(){ tds.forEach((t, i) => { const on = i < 2; t.classList.toggle('done', on); t.setAttribute('aria-checked', String(on)); }); tdSync(); }
tdSync();
```
