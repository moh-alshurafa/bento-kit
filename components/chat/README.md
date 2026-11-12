# Chat

A message thread with a composer.

**Use it for:** Messaging, support, AI assistants.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Sending appends your bubble with a spring; a typing indicator appears before each reply.
- Replies come from a scripted list in the demo.

## Accessibility

- The composer is a labelled form; Enter sends.
- Attributes in use: `aria-live="polite"`.

## Tokens it reads

`--accent`, `--btn-bg`, `--btn-border`, `--btn-fg`, `--btn-shadow`, `--bub-border`, `--bub-in`, `--bub-in-fg`, `--bub-out`, `--bub-out-fg`, `--ctl`, `--ctl-border`, `--expo`, `--fg`, `--good`, `--muted`, `--spring`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-chat a-chat c2 r2" data-pop="4" aria-label="Chat with Lina Haddad">
      <div class="tl"><span class="lbl lead">Lina Haddad</span><span class="lbl2 ch-on"><i></i>Online</span></div>
      <div class="msgs" id="msgs" aria-live="polite"></div>
      <form class="compose" id="compose"><input id="msgIn" type="text" placeholder="Message Lina…" autocomplete="off" aria-label="Message Lina"><button type="submit" class="send" id="sendBtn" aria-label="Send"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 11.4 21 3l-8.4 18-2.1-7.5z"/></svg></button></form>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .ch-on`).

```css
/* 19 chat */
.ch-on{display:inline-flex;align-items:center;gap:5px}
.ch-on i{width:7px;height:7px;border-radius:50%;background:var(--good)}
.msgs{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent,#000 24%);mask-image:linear-gradient(180deg,transparent,#000 24%)}
.msg{display:flex;align-items:flex-end;gap:6px;max-width:86%;flex:none}
.msg.out{align-self:flex-end}
.msg p{padding:7px 11px;border-radius:16px;font-size:12.5px;line-height:1.35;background:var(--bub-in);color:var(--bub-in-fg);border:var(--bub-border)}
.msg.in p{border-bottom-left-radius:5px}
.msg.out p{background:var(--bub-out);color:var(--bub-out-fg);border-bottom-right-radius:5px}
.msg-av{width:22px;height:22px;border-radius:50%;object-fit:cover;flex:none}
.typing p{display:flex;gap:3px;padding:10px 12px}
.typing i{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.4;animation:typing 1.1s infinite}
.typing i:nth-child(2){animation-delay:.15s}
.typing i:nth-child(3){animation-delay:.3s}
@keyframes typing{0%,60%,100%{transform:none;opacity:.35}30%{transform:translateY(-4px);opacity:1}}
.compose{display:flex;gap:8px;flex:none}
.compose input{flex:1;min-width:0;height:36px;padding:0 12px;border-radius:999px;background:var(--ctl);border:var(--ctl-border);outline:none;font-size:13px;color:var(--fg)}
.compose input::placeholder{color:var(--muted)}
.compose input:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 30%,transparent)}
.send{flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:var(--btn-bg);color:var(--btn-fg);border:var(--btn-border);box-shadow:var(--btn-shadow);transition:transform .25s var(--spring)}
.send svg{width:15px;height:15px}
.send:active{transform:scale(.88)}
.send.fly svg{animation:fly .55s var(--expo)}
@keyframes fly{40%{transform:translate(9px,-9px) scale(.6);opacity:0}41%{transform:translate(-9px,9px) scale(.6);opacity:0}100%{transform:none;opacity:1}}
```

## Behaviour code

From `js/bento-kit.js`. It relies on the demo's helpers (`$`, `$$`, `tween`, `sleep`, `particles`) and the `reduce` flag for reduced motion.

```js
/* ---------- chat ---------- */
const msgs = $('#msgs'), msgIn = $('#msgIn'), sendBtn = $('#sendBtn'), LINA = 'img/av-owl.jpg';
const REPLIES = ['Looks amazing on my screen', 'Hardware is my favourite so far', 'Can we ship it tonight?', 'That poppy photo is so good', 'Riso would make a great poster', 'Okay, I’m sold on Aero'];
const CHAT_DEMO = ['Link is up, check the loop', 'Try the Bitmap style', 'Recording the demo now'];
let rq = 0, replyT = 0, demoChat = 0;
function avatarImg(cls){ const im = document.createElement('img'); im.className = cls; im.alt = ''; im.dataset.base = LINA; im.src = srcFor(LINA); return im; }
function bubble(kind, text, animate){
  const el = document.createElement('div'); el.className = 'msg ' + kind;
  if (kind === 'in') el.appendChild(avatarImg('msg-av'));
  const p = document.createElement('p'); p.textContent = text; el.appendChild(p);
  msgs.appendChild(el);
  if (animate && !reduce) el.animate([{opacity: 0, transform: 'translateY(10px) scale(.9)', transformOrigin: kind === 'out' ? '100% 100%' : '0 100%'}, {opacity: 1, transform: 'none', transformOrigin: kind === 'out' ? '100% 100%' : '0 100%'}], {duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)'});
  const all = $$('.msg', msgs); all.slice(0, Math.max(0, all.length - 7)).forEach(m => m.remove());
  return el;
}
function typing(){ const el = document.createElement('div'); el.className = 'msg in typing'; el.appendChild(avatarImg('msg-av')); const p = document.createElement('p'); p.innerHTML = '<i></i><i></i><i></i>'; el.appendChild(p); msgs.appendChild(el); if (!reduce) el.animate([{opacity: 0, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}], {duration: 300, easing: 'ease-out'}); return el; }
let typingEl = null;
const clearTyping = () => { if (typingEl){ typingEl.remove(); typingEl = null; } };
function incoming(delay = 500){
  clearTimeout(replyT); clearTyping();
  replyT = setTimeout(() => { typingEl = typing(); replyT = setTimeout(() => { clearTyping(); bubble('in', REPLIES[rq++ % REPLIES.length], true); }, 1400); }, delay);
}
function send(text){
  text = text.trim(); if (!text) return;
  bubble('out', text, true);
  sendBtn.classList.remove('fly'); void sendBtn.offsetWidth; sendBtn.classList.add('fly');
  incoming(600);
}
$('#compose').addEventListener('submit', e => { e.preventDefault(); send(msgIn.value); msgIn.value = ''; });
bubble('in', 'Are we still on for the launch tonight?', false);
bubble('out', 'Yes! The loop is recording now', false);
bubble('in', 'Send me the bento link when it’s up', false);
```
