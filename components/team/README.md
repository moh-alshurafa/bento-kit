# Team

An avatar stack with online indicators, an overflow count and an Invite button.

**Use it for:** Collaboration, sharing dialogs, workspaces.

_Shown in every style of the demo; Diwan has a right-to-left version._

## Behaviour

- Invite shows a busy state, confirms, then resets (the busy-button pattern from Pricing).

## Accessibility

- Avatar images carry each person's name as alt text; the online count has a text label.

## Tokens it reads

`--ctl`, `--good`, `--muted`, `--spring`, `--tile-solid`

## Markup

From `demo/index.html`. Image paths are relative to `demo/`.

```html
<section class="tile t-team a-team" data-pop="1" aria-label="Team">
      <div class="tl"><span class="lbl lead">Design team</span><span class="lbl2 ch-on" title="3 online" aria-label="3 online"><i></i>3</span></div>
      <div class="avs"><span class="av on"><img data-base="img/av-owl.jpg" src="img/av-owl.jpg" alt="Lina"></span><span class="av on"><img data-base="img/av-parrot.jpg" src="img/av-parrot.jpg" alt="Omar"></span><span class="av on"><img data-base="img/av-penguin.jpg" src="img/av-penguin.jpg" alt="Deploy bot"></span><span class="av"><img data-base="img/av-zebra.jpg" src="img/av-zebra.jpg" alt="Maya"></span><span class="av av-more" id="avMore">+5</span></div>
      <button type="button" class="btn alt sm" id="inviteBtn">Invite</button>
    </section>
```

## CSS

Component rules only; each style adds its own touches in `css/bento-kit.css` (search for `.kit[data-skin="…"] .t-team`).

```css
/* 15 team */
.t-team{gap:7px}
.avs{display:flex;align-items:center;padding-left:9px;flex:1}
.av{position:relative;flex:none;width:32px;height:32px;margin-left:-9px;border-radius:50%;border:2.5px solid var(--tile-solid);background:var(--tile-solid);transition:margin .45s var(--spring),transform .3s var(--spring)}
.av img{width:100%;height:100%;border-radius:50%;object-fit:cover}
.av.on::after{content:"";position:absolute;right:-2px;bottom:-2px;width:9px;height:9px;border-radius:50%;background:var(--good);border:2px solid var(--tile-solid)}
.t-team:hover .av,.t-team.gh .av{margin-left:-3px}
.av:hover{transform:translateY(-4px)}
.av-more{display:grid;place-items:center;background:var(--ctl);font-size:10.5px;font-weight:700;color:var(--muted)}
```
