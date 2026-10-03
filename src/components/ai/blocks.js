/**
 * Blocos de conversa com o Zuno. Discretos, sem cara de app de mensagens:
 * texto com respiro, rótulo pequeno, tradução logo abaixo.
 */
import { h } from '../../core/dom.js';
import { icon } from '../icons.js';
import { VoiceService } from '../../services/voice/VoiceService.js';
import { SpeechService } from '../../services/audio/SpeechService.js';
import { PronunciationPanel } from './PronunciationPanel.js';

/** 🔊 ouvir · 🔁 repetir · 🐢 mais devagar. Some se não houver voz nenhuma. */
export function VoiceControls({ text, lang, personality }) {
  const can = SpeechService.canSpeak(lang.code);
  const root = h('div', { class: 'voice', role: 'group', 'aria-label': 'Ouvir a frase' });
  root.hidden = !can;
  const btn = (iconName, label, opts) => h('button', {
    class: 'voice__btn', type: 'button', 'aria-label': label, title: label,
    onClick: () => VoiceService.speak(text, lang.code, { ...opts, personality }),
  }, h('span', { 'aria-hidden': 'true' }, iconName), h('span', { class: 'voice__label' }, label));
  root.append(
    btn('🔊', 'Ouvir', {}),
    btn('🔁', 'Repetir', {}),
    btn('🐢', 'Mais devagar', { slow: true }),
  );
  // Voz da nuvem pode existir mesmo sem voz no aparelho
  VoiceService.status(lang.code).then((s) => { if (s.cloud) root.hidden = false; });
  return root;
}

/** Fala do Zuno na conversa. */
export function ZunoLine({ text, translation, lang, personality, hideTranslation = false, demo = false }) {
  const tr = translation ? h('p', { class: 'say__translation', lang: 'pt-BR' }, translation) : null;
  let reveal = null;
  if (tr && hideTranslation) {
    tr.hidden = true;
    reveal = h('button', { class: 'say__reveal', type: 'button', onClick: () => { tr.hidden = false; reveal.remove(); } }, 'Ver tradução');
  }
  const practice = h('button', { class: 'say__practice', type: 'button' }, icon('sound'), 'Praticar pronúncia');
  const practiceSlot = h('div', { class: 'say__practice-slot' });
  practice.addEventListener('click', () => {
    if (practiceSlot.firstChild) { practiceSlot.replaceChildren(); return; }
    practiceSlot.replaceChildren(PronunciationPanel({ text, translation, lang, personality, compact: true }));
  });

  return h('article', { class: 'say say--zuno' },
    h('p', { class: 'say__who' }, 'Zuno', demo && h('span', { class: 'demo-chip' }, 'Demonstração')),
    h('p', { class: 'say__text', lang: lang.tag }, text),
    tr, reveal,
    h('div', { class: 'say__tools' }, VoiceControls({ text, lang, personality }), practice),
    practiceSlot,
  );
}

/** Fala do aluno. */
export function UserLine({ text, lang }) {
  return h('article', { class: 'say say--user' },
    h('p', { class: 'say__who' }, 'Você'),
    h('p', { class: 'say__text', lang: lang.tag }, text),
  );
}

/**
 * Correção: "Você escreveu / Forma natural / Por quê / Como um nativo diria".
 * Erros pequenos aparecem em uma linha, sem interromper a conversa.
 */
export function CorrectionBlock({ correction, lang, translation = null }) {
  if (correction.severity === 'minor') {
    return h('div', { class: 'fix fix--minor' },
      h('span', { class: 'fix__tag' }, 'Dica'),
      h('span', {}, h('span', { lang: lang.tag, class: 'fix__natural' }, correction.natural), correction.why && ` · ${correction.why}`),
    );
  }
  const row = (k, v, cls = '', langTag = null) => v && h('div', { class: `fix__row ${cls}` }, h('span', { class: 'fix__k' }, k), h('span', { class: 'fix__v', lang: langTag }, v));
  return h('div', { class: 'fix' },
    row('Você escreveu', correction.you_wrote ?? correction.youWrote, 'fix__row--given', lang.tag),
    row('Forma natural', correction.natural, 'fix__row--right', lang.tag),
    translation && row('Tradução', translation),
    row('Por quê', correction.why),
    row('Como um nativo diria', correction.native, '', lang.tag),
  );
}

/** Palavra/expressão nova: original, tradução, pronúncia, exemplo e contexto. */
export function TeachCard({ teach, lang, personality }) {
  return h('aside', { class: 'teach', 'aria-label': 'Palavra nova' },
    h('p', { class: 'teach__eyebrow' }, 'Palavra nova'),
    h('div', { class: 'teach__head' },
      h('p', { class: 'teach__term', lang: lang.tag }, teach.term),
      VoiceControls({ text: teach.term, lang, personality }),
    ),
    teach.reading && h('p', { class: 'teach__reading' }, teach.reading),
    teach.translation && h('p', { class: 'teach__translation' }, teach.translation),
    teach.example && h('p', { class: 'teach__example', lang: lang.tag }, teach.example),
    teach.example_translation && h('p', { class: 'teach__example-tr' }, teach.example_translation),
    teach.note && h('p', { class: 'teach__note' }, teach.note),
  );
}

/** Estado real da IA quando ela não está disponível (sem fingir). */
export function AIUnavailable({ title = 'A IA do Zuno ainda não está conectada', children } = {}) {
  return h('section', { class: 'ai-off', role: 'status' },
    h('p', { class: 'ai-off__title' }, title),
    h('p', { class: 'ai-off__text' }, children || 'Para conversar com o Zuno, a IA precisa ser configurada no servidor do app (ZUNO_API_BASE). Se você abriu o Zuno como página publicada no Claude, ela funciona aqui mesmo depois que você autorizar o uso.'),
  );
}

/** "8 de 15 mensagens hoje" */
export function UsageMeter({ used, limit, label = 'mensagens hoje' }) {
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  return h('div', { class: 'usage', title: `${used} de ${limit} ${label}` },
    h('span', { class: 'usage__bar' }, h('span', { class: 'usage__fill', style: { width: `${pct}%` } })),
    h('span', { class: 'usage__text' }, `${used}/${limit}`),
  );
}
