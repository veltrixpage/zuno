/**
 * Prática de pronúncia: Zuno fala → você ouve → "Praticar" → grava → análise.
 * A gravação é real (microfone). A ANÁLISE depende do servidor de voz; sem
 * ele, a tela mostra os campos que serão preenchidos e diz que falta configurar.
 */
import { h } from '../../core/dom.js';
import { icon } from '../icons.js';
import { VoiceService } from '../../services/voice/VoiceService.js';
import { PronunciationService } from '../../services/voice/PronunciationService.js';

export function PronunciationPanel({ text, translation, lang, personality = 'light', compact = false }) {
  const status = h('p', { class: 'pron__status', 'aria-live': 'polite' });
  const playback = h('div', { class: 'pron__playback' });
  const result = h('div', { class: 'pron__result' });
  let recording = null;

  const listen = h('button', { class: 'btn btn--secondary', type: 'button', onClick: () => VoiceService.speak(text, lang.code, { personality }) },
    h('span', { 'aria-hidden': 'true' }, '🔊'), h('span', { class: 'btn__label' }, 'Ouvir'));
  const slow = h('button', { class: 'btn btn--ghost', type: 'button', onClick: () => VoiceService.speak(text, lang.code, { slow: true, personality }) },
    h('span', { 'aria-hidden': 'true' }, '🐢'), h('span', { class: 'btn__label' }, 'Devagar'));
  const practice = h('button', { class: 'btn btn--primary', type: 'button' }, h('span', { 'aria-hidden': 'true' }, '🎙️'), h('span', { class: 'btn__label' }, 'Praticar'));

  const canRecord = PronunciationService.canRecord();
  if (!canRecord) {
    practice.disabled = true;
    status.textContent = 'Este navegador não permite gravar áudio aqui.';
  }

  practice.addEventListener('click', async () => {
    if (recording) {
      const blob = await recording.stop();
      recording = null;
      practice.querySelector('.btn__label').textContent = 'Praticar de novo';
      practice.classList.remove('is-recording');
      status.textContent = 'Gravação pronta. Ouça como ficou:';
      const audio = h('audio', { controls: true, src: URL.createObjectURL(blob) });
      playback.replaceChildren(audio);
      analyze(blob);
      return;
    }
    try {
      recording = await PronunciationService.start(8000);
      practice.classList.add('is-recording');
      practice.querySelector('.btn__label').textContent = 'Parar';
      status.textContent = 'Gravando… fale a frase.';
      result.replaceChildren();
    } catch {
      status.textContent = 'Não foi possível usar o microfone. Verifique a permissão do navegador.';
    }
  });

  async function analyze(blob) {
    try {
      const r = await PronunciationService.analyze(blob, { text, code: lang.code });
      result.replaceChildren(ResultView(r));
    } catch (e) {
      result.replaceChildren(PendingView(e.code === 'not_configured'));
    }
  }

  return h('div', { class: `pron${compact ? ' pron--compact' : ''}` },
    !compact && h('p', { class: 'pron__phrase', lang: lang.tag }, text),
    !compact && translation && h('p', { class: 'pron__translation' }, translation),
    h('div', { class: 'pron__actions' }, listen, slow, practice),
    status, playback, result,
  );
}

/** Sem servidor de voz: mostra a estrutura, sem números inventados. */
function PendingView(notConfigured) {
  const item = (label) => h('div', { class: 'pron__metric is-pending' }, h('span', { class: 'pron__metric-k' }, label), h('span', { class: 'pron__metric-v' }, '—'));
  return h('div', { class: 'pron__analysis' },
    h('p', { class: 'pron__note' }, icon('lock'), notConfigured
      ? 'A análise automática de pronúncia ainda não está configurada no servidor. Por enquanto, compare a sua gravação com a fala do Zuno.'
      : 'Não foi possível analisar agora. Tente de novo.'),
    h('div', { class: 'pron__metrics' }, item('Pronúncia'), item('Clareza'), item('Palavras'), item('Pontos para melhorar')),
  );
}

function ResultView(r) {
  const metric = (k, v) => h('div', { class: 'pron__metric' }, h('span', { class: 'pron__metric-k' }, k), h('span', { class: 'pron__metric-v' }, v));
  return h('div', { class: 'pron__analysis' },
    h('div', { class: 'pron__metrics' },
      metric('Pronúncia', `${Math.round(r.pronunciation)}/100`),
      metric('Clareza', `${Math.round(r.clarity)}/100`),
    ),
    Array.isArray(r.words) && h('p', { class: 'pron__words' }, r.words.map((w) => h('span', { class: `pron__word${w.ok ? '' : ' is-off'}`, title: w.heard ? `Ouvido: ${w.heard}` : '' }, w.word))),
    Array.isArray(r.tips) && h('ul', { class: 'pron__tips' }, r.tips.map((t) => h('li', {}, t))),
  );
}
