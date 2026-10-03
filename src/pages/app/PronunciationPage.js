/**
 * Prática de pronúncia com frases reais dos cursos (as frases certas das
 * atividades de completar). Zuno à esquerda, frases à direita.
 */
import { h } from '../../core/dom.js';
import { getLanguage } from '../../domain/languages.js';
import { getCourse } from '../../content/index.js';
import { levelLessons, getLevel } from '../../domain/course.js';
import { SettingsService } from '../../services/settings/SettingsService.js';
import { VoiceService } from '../../services/voice/VoiceService.js';
import { PronunciationService } from '../../services/voice/PronunciationService.js';
import { LessonLayout } from '../../layouts/LessonLayout.js';
import { PronunciationPanel } from '../../components/ai/PronunciationPanel.js';
import { fillBlank } from '../../components/exercises/shared.js';
import { Placeholder } from '../../components/ui.js';
import { Flag } from '../../components/flags.js';
import { icon } from '../../components/icons.js';
import { FREE_PRONUNCIATION_PHRASES } from '../../config/plans.js';

function phrasesFor(code) {
  const level = getLevel(getCourse(code), 'A1');
  const out = [];
  for (const lesson of levelLessons(level)) {
    for (const ex of lesson.exercises) {
      if (ex.prompt?.includes('___') && ex.answer) out.push({ text: fillBlank(ex.prompt, ex.answer), translation: ex.translation });
      if (ex.type === 'order') out.push({ text: ex.answer, translation: ex.prompt });
    }
  }
  const seen = new Set();
  return out.filter((p) => !seen.has(p.text) && seen.add(p.text)).slice(0, 12);
}

export function PronunciationPage({ user, params, setTitle }) {
  const lang = getLanguage(params[0]);
  if (!lang) return h('div', { class: 'lesson-screen lesson-screen--center' }, Placeholder({ title: 'Idioma não encontrado', text: '' }));
  setTitle(`Pronúncia · ${lang.name}`);
  const personality = SettingsService.personalityFor(user);
  const phrases = phrasesFor(lang.code);
  let selected = 0;

  const panelSlot = h('div', { class: 'pron-page__panel' });
  const list = h('ol', { class: 'phrase-list' });
  const notes = h('div', { class: 'pron-page__notes' });

  function draw() {
    const limit = user.plan === 'plus' ? Infinity : FREE_PRONUNCIATION_PHRASES;
    list.replaceChildren(...phrases.map((p, i) => h('li', {}, i < limit
      ? h('button', {
        class: `phrase${i === selected ? ' is-active' : ''}`, type: 'button', 'aria-pressed': String(i === selected),
        onClick: () => { selected = i; draw(); VoiceService.speak(p.text, lang.code, { personality }); layout.companion.play('pop'); },
      }, h('span', { lang: lang.tag }, p.text), p.translation && h('span', { class: 'phrase__tr' }, p.translation))
      : h('a', { class: 'phrase is-locked', href: '#plus' }, h('span', { lang: lang.tag }, p.text), h('span', { class: 'plus-chip plus-chip--sm' }, icon('lock'), 'Plus')))));
    const p = phrases[selected];
    panelSlot.replaceChildren(PronunciationPanel({ text: p.text, translation: p.translation, lang, personality }));
  }

  const body = h('div', { class: 'pron-page' },
    h('a', { class: 'back-link', href: '#mundo' }, icon('arrowLeft'), 'Modo Mundo'),
    h('header', { class: 'page-header' },
      h('p', { class: 'eyebrow' }, '🎙️ Pronúncia'),
      h('h1', { class: 'page-title' }, 'Ouça o Zuno. Depois, fale você.'),
    ),
    panelSlot, notes,
    h('h2', { class: 'setup__title' }, 'Frases das suas aulas'), list,
  );
  const layout = LessonLayout({ body, langTag: lang.tag });

  VoiceService.status(lang.code).then(async (v) => {
    const ready = await PronunciationService.analysisReady();
    notes.replaceChildren(h('p', { class: 'muted' },
      v.cloud ? 'Voz do Zuno ativa.' : v.device ? 'Usando a voz do seu aparelho (a voz própria do Zuno ainda não está configurada).' : 'Seu aparelho não tem voz para este idioma.',
      ' ',
      ready ? 'Análise de pronúncia ativa.' : 'A análise automática de pronúncia ainda não está configurada.'));
  });

  draw();
  return h('div', { class: 'lesson-screen' },
    h('header', { class: 'lesson-bar' }, h('div', { class: 'lesson-bar__row' },
      h('a', { class: 'icon-btn', href: '#mundo', 'aria-label': 'Fechar' }, icon('close')),
      h('div', { class: 'lesson-bar__where' }, Flag({ country: lang.flag, size: 'sm' }), h('span', { class: 'lesson-bar__lang', lang: lang.tag }, lang.native), h('span', { class: 'lesson-bar__sep' }, '·'), h('span', { class: 'lesson-bar__unit' }, 'Pronúncia')),
    )),
    layout,
  );
}
