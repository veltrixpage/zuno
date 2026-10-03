/**
 * Escolha única. Cobre: múltipla escolha, complete a frase, verdadeiro ou falso,
 * escutar e responder, leitura e identificação de frase.
 * Ao tocar numa opção: trava, marca certa/errada e chama onAnswer.
 * Teclado: 1–4 escolhem a opção.
 */
import { h } from '../../core/dom.js';
import { icon } from '../icons.js';
import { SpeechService } from '../../services/audio/SpeechService.js';
import { shuffle, promptWithBlank, bindKeys, Header, stripReading } from './shared.js';

export function ChoiceExercise({ exercise, lang, onAnswer }) {
  const keepOrder = exercise.statement; // Verdadeiro/Falso fica sempre na mesma ordem
  const options = keepOrder
    ? ['Verdadeiro', 'Falso'].map((l) => exercise.options.find((o) => o.label === l))
    : shuffle(exercise.options);
  let answered = false;

  const targetLangPrompt = !['translate', 'phrase', 'reading', 'listen'].includes(exercise.kind) && !exercise.statement;
  const promptEl = h('p', { class: `ex__prompt${exercise.statement ? ' ex__prompt--statement' : ''}`, lang: targetLangPrompt ? lang.tag : 'pt-BR' }, promptWithBlank(exercise.prompt));

  // Opções no idioma estudado quando a pergunta é em português
  const optionsInTarget = ['translate', 'phrase', 'listen', 'complete'].includes(exercise.kind);

  const buttons = options.map((opt, i) =>
    h('button', { class: 'option', type: 'button', dataset: { correct: String(opt.correct) }, onClick: () => choose(opt, i) },
      h('span', { class: 'option__key', 'aria-hidden': 'true' }, String(i + 1)),
      h('span', { class: 'option__label', lang: optionsInTarget ? lang.tag : null }, opt.label),
      h('span', { class: 'option__mark', 'aria-hidden': 'true' }),
    ),
  );

  function choose(opt, i) {
    if (answered) return;
    answered = true;
    unbind();
    SpeechService.stop();
    buttons.forEach((b, bi) => {
      b.disabled = true;
      const isRight = b.dataset.correct === 'true';
      if (isRight) {
        b.classList.add('is-correct');
        b.querySelector('.option__mark').replaceChildren(icon('check'));
      } else if (bi === i) {
        b.classList.add('is-wrong');
        b.querySelector('.option__mark').replaceChildren(icon('close'));
      } else b.classList.add('is-dim');
    });
    if (exercise.prompt.includes('___')) promptEl.replaceChildren(...promptWithBlank(exercise.prompt, stripReading(exercise.answer)));
    onAnswer({ correct: opt.correct, given: opt.label, expected: exercise.answer });
  }

  let unbind = () => {};

  const extras = [];
  if (exercise.passage) {
    extras.push(h('blockquote', { class: 'ex__passage', lang: lang.tag }, exercise.passage));
  }
  if (exercise.say) extras.push(ListenControl(exercise.say, lang));

  const root = h('div', { class: 'ex' },
    h('p', { class: 'ex__instruction' }, exercise.instruction),
    ...extras,
    h('div', { class: 'ex__question' }, promptEl, exercise.reading && h('p', { class: 'ex__reading' }, exercise.reading)),
    h('div', { class: `ex__options${exercise.statement ? ' ex__options--tf' : ''}`, role: 'group', 'aria-label': 'Opções de resposta' }, buttons),
  );
  unbind = bindKeys(root, (e) => {
    const n = Number(e.key);
    if (!answered && n >= 1 && n <= buttons.length && !e.target.closest?.('input, textarea')) {
      e.preventDefault();
      buttons[n - 1].click();
    }
  });
  root.destroy = () => { unbind(); SpeechService.stop(); };
  return root;
}

/** Botões de áudio. Sem voz no aparelho, mostra o texto (sem fingir). */
export function ListenControl(text, lang) {
  if (!SpeechService.canSpeak(lang.code)) {
    return h('div', { class: 'listen listen--fallback' },
      h('p', { class: 'listen__note' }, 'Seu aparelho não tem voz para este idioma. Leia em vez de ouvir:'),
      h('p', { class: 'listen__text', lang: lang.tag }, text),
    );
  }
  const play = (rate) => SpeechService.speak(text, lang.code, { rate });
  const root = h('div', { class: 'listen' },
    h('button', { class: 'listen__play', type: 'button', onClick: () => play(0.9), 'aria-label': 'Ouvir' }, icon('sound'), h('span', {}, 'Ouvir')),
    h('button', { class: 'listen__slow', type: 'button', onClick: () => play(0.6) }, 'Ouvir devagar'),
  );
  // Toca uma vez ao aparecer (depois de uma interação, que já aconteceu ao abrir a aula)
  setTimeout(() => root.isConnected && play(0.9), 450);
  return root;
}
