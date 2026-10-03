/**
 * "Escreva em outro idioma" (correção de texto) e "Tradução com contexto".
 * Zuno à esquerda reage; o conteúdo fica à direita.
 */
import { h } from '../../core/dom.js';
import { LANGUAGES, getLanguage } from '../../domain/languages.js';
import { ProgressService } from '../../services/progress/ProgressService.js';
import { AIService } from '../../services/ai/AIService.js';
import { learnerContext } from '../../services/ai/learnerContext.js';
import { SettingsService } from '../../services/settings/SettingsService.js';
import { AudioService, PERSONALITY_SOUNDS } from '../../services/audio/AudioService.js';
import { LessonLayout } from '../../layouts/LessonLayout.js';
import { CorrectionBlock, TeachCard, AIUnavailable, VoiceControls } from '../../components/ai/blocks.js';
import { Flag } from '../../components/flags.js';
import { icon } from '../../components/icons.js';
import { presentEmotion } from '../../zuno/zuno.states.js';

export function WritingPage({ user }) {
  const p = ProgressService.load(user.id);
  let code = p.lastLanguage || 'en';
  let mode = 'correct';
  const personality = SettingsService.personalityFor(user);
  const settings = SettingsService.get(user.id);

  const result = h('div', { class: 'write-result', 'aria-live': 'polite' });
  const area = h('textarea', { class: 'field__input write-area', id: 'write-text', rows: '4' });
  const go = h('button', { class: 'btn btn--primary btn--lg', type: 'submit' }, h('span', { class: 'btn__label' }, 'Corrigir'));
  const langRow = h('div', { class: 'lang-strip', role: 'radiogroup', 'aria-label': 'Idioma' });
  const tabs = h('div', { class: 'tabs', role: 'tablist' });

  const form = h('form', { class: 'write-form', novalidate: true },
    h('label', { class: 'setup__title', for: 'write-text' }, 'Seu texto'), area, h('div', {}, go));

  function draw() {
    const lang = getLanguage(code);
    langRow.replaceChildren(...LANGUAGES.map((l) => h('button', {
      class: `lang-pill${l.code === code ? ' is-active' : ''}`, type: 'button', role: 'radio', 'aria-checked': String(l.code === code),
      onClick: () => { code = l.code; draw(); },
    }, Flag({ country: l.flag, size: 'sm' }), h('span', { lang: l.tag }, l.native))));
    tabs.replaceChildren(
      Tab('correct', 'Corrigir meu texto'),
      Tab('explain', 'Traduzir com contexto'),
    );
    area.lang = lang.tag;
    area.placeholder = mode === 'correct' ? `Escreva uma frase em ${lang.name.toLowerCase()}…` : `Uma palavra ou expressão em ${lang.name.toLowerCase()}…`;
    go.querySelector('.btn__label').textContent = mode === 'correct' ? 'Corrigir' : 'Explicar';
  }
  const Tab = (id, label) => h('button', {
    class: `tab${mode === id ? ' is-active' : ''}`, type: 'button', role: 'tab', 'aria-selected': String(mode === id),
    onClick: () => { mode = id; result.replaceChildren(); draw(); },
  }, label);

  const body = h('div', { class: 'write-page' },
    h('a', { class: 'back-link', href: '#mundo' }, icon('arrowLeft'), 'Modo Mundo'),
    h('header', { class: 'page-header' },
      h('p', { class: 'eyebrow' }, '✍️ Escreva em outro idioma'),
      h('h1', { class: 'page-title' }, 'Escreva. O Zuno mostra a forma natural.'),
    ),
    langRow, tabs, form, result,
  );
  const layout = LessonLayout({ body, langTag: getLanguage(code).tag, hideTranslation: !settings.showTranslation });
  const zuno = layout.companion;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = area.value.trim();
    if (!text) return;
    const lang = getLanguage(code);
    const status = await AIService.status();
    if (!status.ready) { result.replaceChildren(AIUnavailable()); zuno.setState('confused'); return; }

    go.disabled = true;
    zuno.say(null);
    zuno.setState('curious');
    zuno.look('answer');
    result.replaceChildren(h('p', { class: 'talk__thinking' }, h('span', { class: 'dots', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')), 'Zuno está lendo…'));
    try {
      const ctx = { ...learnerContext(user, code), text };
      if (mode === 'correct') {
        const r = await AIService.correct(ctx, { user });
        zuno.look(null);
        zuno.setState(presentEmotion(r.emotion, personality));
        if (r.laugh) { zuno.play(r.laugh === 'big' ? 'laugh-big' : 'laugh'); AudioService.play(PERSONALITY_SOUNDS[personality].laugh, { enabled: settings.sound }); }
        else if (r.isCorrect) zuno.play('celebrate');
        zuno.say(r.reaction ? { text: r.reaction.text, translation: code === 'pt' ? null : r.reaction.translation } : null, r.laugh);
        result.replaceChildren(
          r.demo && h('span', { class: 'demo-chip' }, 'Demonstração'),
          h('p', { class: `write-result__verdict${r.isCorrect ? ' is-ok' : ''}` }, r.isCorrect ? 'Está certo.' : 'Dá para melhorar.'),
          CorrectionBlock({ correction: { severity: 'major', you_wrote: r.youWrote || text, natural: r.natural, why: r.why, native: r.native }, lang, translation: r.translation }),
          r.natural && VoiceControls({ text: r.native || r.natural, lang, personality }),
          r.notes.length > 0 && h('ul', { class: 'fix-notes', role: 'list' }, r.notes.map((n) => h('li', {},
            h('span', { class: 'fix-notes__from', lang: lang.tag }, n.from || '—'), ' → ', h('strong', { lang: lang.tag }, n.to), n.why && h('span', { class: 'fix-notes__why' }, ` · ${n.why}`)))),
        );
      } else {
        const r = await AIService.explain(ctx, { user });
        zuno.look(null);
        zuno.setState('happy');
        result.replaceChildren(
          r.demo && h('span', { class: 'demo-chip' }, 'Demonstração'),
          TeachCard({ teach: { term: r.term || text, translation: r.translation, reading: r.reading, example: r.example, example_translation: r.exampleTranslation, note: [r.literal && `Literal: ${r.literal}.`, r.note].filter(Boolean).join(' ') || null }, lang, personality }),
        );
      }
    } catch (err) {
      zuno.look(null);
      zuno.setState('confused');
      result.replaceChildren(h('p', { class: 'talk__error' }, err.message,
        err.code === 'limit' && user.plan !== 'plus' ? h('a', { class: 'link link--strong', href: '#plus' }, ' Conhecer o Plus') : null));
    } finally {
      go.disabled = false;
    }
  });

  draw();
  return h('div', { class: 'lesson-screen' },
    h('header', { class: 'lesson-bar' }, h('div', { class: 'lesson-bar__row' },
      h('a', { class: 'icon-btn', href: '#mundo', 'aria-label': 'Fechar' }, icon('close')),
      h('div', { class: 'lesson-bar__where' }, h('span', { class: 'lesson-bar__lang' }, 'Escreva em outro idioma')),
    )),
    layout,
  );
}
