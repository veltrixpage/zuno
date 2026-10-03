/** Conversar com Zuno: escolher idioma, nível, tema e objetivo antes de começar. */
import { h } from '../../core/dom.js';
import { LANGUAGES, getLanguage } from '../../domain/languages.js';
import { TOPICS, GOALS } from '../../domain/world.js';
import { ACTIVE_LEVELS } from '../../domain/models.js';
import { ProgressService } from '../../services/progress/ProgressService.js';
import { SettingsService } from '../../services/settings/SettingsService.js';
import { Button } from '../../components/ui.js';
import { Flag } from '../../components/flags.js';
import { icon } from '../../components/icons.js';
import { Recent } from './WorldPage.js';

export function ConversationSetupPage({ user }) {
  const p = ProgressService.load(user.id);
  const choice = {
    code: p.lastLanguage || 'en',
    level: p.languages[p.lastLanguage]?.level || 'A1',
    topic: 'cotidiano',
    goal: SettingsService.get(user.id).goal || null,
  };
  const root = h('div', { class: 'page setup' });

  const group = (title, id, items, key, render, onPick) => h('section', { class: 'setup__group', 'aria-labelledby': id },
    h('h2', { class: 'setup__title', id }, title),
    h('div', { class: 'setup__options', role: 'radiogroup', 'aria-labelledby': id },
      items.map((it) => h('button', {
        class: `pill${choice[key] === it.id ? ' is-active' : ''}`, type: 'button', role: 'radio', 'aria-checked': String(choice[key] === it.id),
        onClick: () => { choice[key] = it.id; onPick?.(it.id); draw(); },
      }, render(it))),
    ),
  );

  function draw() {
    root.replaceChildren(
      h('a', { class: 'back-link', href: '#mundo' }, icon('arrowLeft'), 'Modo Mundo'),
      h('header', { class: 'page-header' },
        h('p', { class: 'eyebrow' }, '💬 Conversar com Zuno'),
        h('h1', { class: 'page-title' }, 'Sobre o que vamos conversar?'),
        h('p', { class: 'page-subtitle' }, 'O Zuno fala no idioma escolhido, adapta a dificuldade e corrige o que importa.'),
      ),
      group('Idioma', 'g-lang', LANGUAGES.map((l) => ({ ...l, id: l.code })), 'code', (l) => [Flag({ country: l.flag, size: 'sm' }), h('span', { lang: l.tag }, l.native)]),
      group('Nível', 'g-level', ACTIVE_LEVELS.map((c) => ({ id: c })), 'level', (x) => x.id),
      group('Tema', 'g-topic', TOPICS, 'topic', (t) => [h('span', { 'aria-hidden': 'true' }, t.emoji), ` ${t.label}`]),
      group('Seu objetivo (opcional)', 'g-goal', GOALS, 'goal', (g) => g.label, (id) => SettingsService.update(user.id, { goal: id })),
      h('div', {}, Button({ label: `Conversar em ${getLanguage(choice.code).name.toLowerCase()}`, href: `#conversa-${choice.code}-${choice.level.toLowerCase()}-${choice.topic}`, size: 'lg', iconAfter: 'arrowRight' })),
      Recent(user),
    );
  }
  draw();
  return root;
}
