# Command menu

A search field with a ⌘K shortcut over a filtered list of commands with icons and key hints.

**Use it for:** App-wide search, command palettes, quick actions.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Typing filters the list; arrow keys move the selection; Enter runs the command.
- ⌘K (Ctrl+K) focuses the field from anywhere and pulses the card.

## Accessibility

- Results are `role="option"` items with `aria-selected`.
- Attributes in use: `aria-pressed`, `aria-selected`, `aria-selected="${i === cmdSel}"`, `role="listbox"`, `role="option"`.

## Tokens it reads

`--accent`, `--accent-ink`, `--ctl`, `--ctl-border`, `--faint`, `--fg`, `--muted`, `--tile-radius`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-search a-search c2" data-pop="5" data-hw="dark" aria-label="Command menu">
      <label class="srch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="cmdIn" type="text" placeholder="Search or jump to…" autocomplete="off" spellcheck="false" aria-label="Search commands"><kbd>⌘K</kbd></label>
      <ul class="cmd" id="cmdList" role="listbox" aria-label="Commands"></ul>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .srch`).

```css
/* 8 search */
.srch{display:flex;align-items:center;gap:10px;height:36px;padding:0 12px;flex:none;border-radius:calc(var(--tile-radius) * .55);background:var(--ctl);border:var(--ctl-border);transition:box-shadow .25s,background .25s}
.srch:focus-within{box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 35%,transparent)}
.srch svg{width:16px;height:16px;color:var(--muted);flex:none}
.srch input{flex:1;min-width:0;border:0;outline:0;background:none;font-size:14px;color:var(--fg)}
.srch input::placeholder{color:var(--muted)}
.cmd{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px;flex:1;min-height:0;overflow:hidden}
.cmd li{display:flex;align-items:center;gap:10px;flex:none;height:29px;padding:0 8px;border-radius:9px;font-size:13px;cursor:pointer;transition:background .15s}
.cmd li .ci{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;background:var(--faint);color:var(--muted);flex:none;transition:background .15s,color .15s}
.cmd li .ci svg{width:13px;height:13px}
.cmd li .ct{min-width:0;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cmd li[aria-selected="true"]{background:color-mix(in srgb,var(--accent) 16%,transparent)}
.cmd li[aria-selected="true"] .ci{background:var(--accent);color:var(--accent-ink)}
.cmd li.empty{color:var(--muted);cursor:default}
.cmd li.run{animation:runflash .4s ease}
@keyframes runflash{50%{transform:scale(.97)}}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- search ---------- */
const cmdIn = $('#cmdIn'), cmdList = $('#cmdList'); let cmdSel = 0, cmdShown = [];
function cmds(){
  const next = SKINS[(SKINS.indexOf(skin) + 1) % SKINS.length];
  const skinCmd = s => ({t: 'Switch style to ' + SKIN_NAME[s], i: 'palette', k: 'S', run: () => requestSkin(s)});
  return [
    {t: 'Play “' + tracks[0].t + '”', i: 'music', k: 'P', run: () => { if (ti !== 0) loadTrack(0, 1); setPlaying(true); }},
    skinCmd(next),
    {t: 'Turn on Focus', i: 'moon', k: 'F', run: () => { const b = $('#ccFocus'); if (b.getAttribute('aria-pressed') !== 'true') b.click(); }},
    {t: 'Message Lina', i: 'chat', k: 'M', run: () => msgIn.focus()},
    {t: 'Clear notifications', i: 'bell', k: 'C', run: () => $('#nfClear').click()},
    {t: 'Next memory', i: 'image', k: 'N', run: () => showPhoto(pi + 1)},
    {t: 'Invite a teammate', i: 'user', k: 'I', run: () => $('#inviteBtn').click()},
    ...SKINS.filter(s => s !== skin && s !== next).map(skinCmd)
  ];
}
function markSel(){ $$('li[data-i]', cmdList).forEach(li => li.setAttribute('aria-selected', String(+li.dataset.i === cmdSel))); }
function renderCmd(){
  const q = cmdIn.value.trim().toLowerCase();
  cmdShown = cmds().filter(c => c.t.toLowerCase().includes(q));
  cmdSel = clamp(cmdSel, 0, Math.max(0, cmdShown.length - 1));
  cmdList.innerHTML = cmdShown.length ? cmdShown.map((c, i) => `<li role="option" aria-selected="${i === cmdSel}" data-i="${i}"><span class="ci">${CMD_ICON[c.i]}</span><span class="ct"></span><kbd>⌘${c.k}</kbd></li>`).join('') : '<li class="empty">No matches</li>';
  $$('li[data-i]', cmdList).forEach((li, i) => { $('.ct', li).textContent = cmdShown[i].t; });
}
function runCmd(){
  const c = cmdShown[cmdSel]; if (!c) return;
  const li = $(`li[data-i="${cmdSel}"]`, cmdList); if (li){ li.classList.remove('run'); void li.offsetWidth; li.classList.add('run'); }
  c.run();
  setTimeout(() => { cmdIn.value = ''; cmdSel = 0; renderCmd(); }, 320);
}
cmdIn.addEventListener('input', () => { cmdSel = 0; renderCmd(); });
cmdIn.addEventListener('keydown', e => {
  const n = Math.max(1, cmdShown.length);
  if (e.key === 'ArrowDown'){ e.preventDefault(); cmdSel = (cmdSel + 1) % n; markSel(); }
  else if (e.key === 'ArrowUp'){ e.preventDefault(); cmdSel = (cmdSel - 1 + n) % n; markSel(); }
  else if (e.key === 'Enter'){ e.preventDefault(); runCmd(); }
  else if (e.key === 'Escape'){ cmdIn.value = ''; renderCmd(); cmdIn.blur(); }
});
cmdList.addEventListener('mousemove', e => { const li = e.target.closest('li[data-i]'); if (li && +li.dataset.i !== cmdSel){ cmdSel = +li.dataset.i; markSel(); } });
cmdList.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li){ cmdSel = +li.dataset.i; runCmd(); } });
```
