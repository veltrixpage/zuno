/**
 * 🌎 Modo Mundo: "Aprenda usando o idioma no mundo real."
 * Hub com: idioma, situações (Free/Plus), Conversar com Zuno, Escreva em outro
 * idioma, Pronúncia e Conversas recentes. O estado real da IA aparece no topo.
 */
import { h } from '../../core/dom.js';
import { LANGUAGES, getLanguage } from '../../domain/languages.js';
import { SITUATIONS, getSituation, getTopic, WORLD_PLACES } from '../../domain/world.js';
import { ProgressService } from '../../services/progress/ProgressService.js';
import { SessionStore, relativeDay } from '../../services/ai/SessionStore.js';
import { AIService } from '../../services/ai/AIService.js';
import { UsageService } from '../../services/ai/UsageService.js';
import { local } from '../../core/storage.js';
import { Flag } from '../../components/flags.js';
import { icon } from '../../components/icons.js';
import { AIUnavailable } from '../../components/ai/blocks.js';
import { ZunoCharacter } from '../../zuno/ZunoCharacter.js';

const LANG_KEY = (id) => `world.lang.${id}`;

export function WorldPage({ user }) {
  const progress = ProgressService.load(user.id);
  let code = local.get(LANG_KEY(user.id), null) || progress.lastLanguage || 'en';
  if (!getLanguage(code)) code = 'en';
  const plus = user.plan === 'plus';

  const root = h('div', { class: 'page world' });
  const status = h('div', { class: 'world__status' });

  function render() {
    const lang = getLanguage(code);
    const place = WORLD_PLACES[code];

    const hero = h('section', { class: 'world__hero' },
      h('div', { class: 'world__hero-text' },
        h('p', { class: 'eyebrow' }, '🌎 Modo Mundo'),
        h('h1', { class: 'page-title' }, 'Aprenda usando o idioma no mundo real.'),
        h('p', { class: 'page-subtitle' }, 'Escolha um idioma e uma situação. O Zuno entra na cena com você.'),
      ),
      h('div', { class: 'world__zuno' }, ZunoCharacter({ size: 'lg', state: 'curious', decorative: true })),
    );

    const langs = h('div', { class: 'lang-strip', role: 'radiogroup', 'aria-label': 'Idioma' },
      LANGUAGES.map((l) => h('button', {
        class: `lang-pill${l.code === code ? ' is-active' : ''}`, type: 'button', role: 'radio', 'aria-checked': String(l.code === code),
        onClick: () => { code = l.code; local.set(LANG_KEY(user.id), code); render(); },
      }, Flag({ country: l.flag, size: 'sm' }), h('span', { lang: l.tag }, l.native))),
    );

    const situations = h('section', { class: 'world__section', 'aria-labelledby': 'sit-title' },
      h('div', { class: 'section-head' },
        h('h2', { class: 'section-title', id: 'sit-title' }, `Situações em ${place.city}`),
        !plus && h('span', { class: 'muted' }, '3 situações no Free'),
      ),
      h('ul', { class: 'situations', role: 'list' }, SITUATIONS.map((s) => {
        const locked = !s.free && !plus;
        return h('li', {}, h('a', { class: `situation${locked ? ' is-locked' : ''}`, href: `#cena-${code}-${s.id}` },
          h('span', { class: 'situation__emoji', 'aria-hidden': 'true' }, s.emoji),
          h('span', { class: 'situation__label' }, s.label),
          locked && h('span', { class: 'plus-chip plus-chip--sm' }, icon('lock'), 'Plus'),
        ));
      })),
    );

    const tools = h('section', { class: 'world__section', 'aria-labelledby': 'tools-title' },
      h('h2', { class: 'section-title', id: 'tools-title' }, 'Praticar com o Zuno'),
      h('div', { class: 'tools' },
        Tool('#conversar', '💬', 'Conversar com Zuno', 'Escolha nível e tema. Ele pergunta, você responde.'),
        Tool('#escrever', '✍️', 'Escreva em outro idioma', 'Escreva uma frase e veja a forma natural.'),
        Tool(`#pronuncia-${code}`, '🎙️', 'Pronúncia', 'Ouça o Zuno e pratique em voz alta.'),
      ),
    );

    root.replaceChildren(hero, status, langs, situations, tools, Recent(user));
  }

  render();
  AIService.status().then((s) => {
    if (!root.isConnected) return;
    if (!s.ready) status.replaceChildren(AIUnavailable());
    else {
      const lim = UsageService.limitsFor(user);
      status.replaceChildren(h('p', { class: 'ai-on' }, h('span', { class: 'ai-on__dot', 'aria-hidden': 'true' }),
        `IA ativa · ${s.label}`, h('span', { class: 'muted' }, ` · ${UsageService.remaining(user, 'world')} de ${lim.world} no Modo Mundo hoje`)));
    }
  });
  return root;
}

const Tool = (href, emoji, title, text) => h('a', { class: 'tool', href },
  h('span', { class: 'tool__emoji', 'aria-hidden': 'true' }, emoji),
  h('span', { class: 'tool__text' }, h('strong', {}, title), h('span', {}, text)),
  h('span', { class: 'tool__go' }, icon('chevronRight')));

/** "Conversas recentes": idioma, tema e data. */
export function Recent(user) {
  const list = SessionStore.recent(user.id);
  return h('section', { class: 'world__section', 'aria-labelledby': 'recent-title' },
    h('h2', { class: 'section-title', id: 'recent-title' }, 'Conversas recentes'),
    list.length
      ? h('ul', { class: 'recent', role: 'list' }, list.map((s) => {
          const lang = getLanguage(s.code);
          const what = s.kind === 'world' ? getSituation(s.situation) : getTopic(s.topic);
          return h('li', {}, h('a', { class: 'recent__item', href: `#sessao-${s.id}` },
            Flag({ country: lang.flag, size: 'md' }),
            h('span', { class: 'recent__text' },
              h('span', { class: 'recent__lang', lang: lang.tag }, lang.native),
              h('span', { class: 'recent__what' }, `${what?.emoji || ''} ${what?.label || ''}`),
            ),
            h('span', { class: 'recent__date' }, relativeDay(s.updatedAt)),
          ));
        }))
      : h('p', { class: 'muted' }, 'Suas conversas com o Zuno aparecem aqui.'),
  );
}
