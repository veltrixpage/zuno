/**
 * Tela da aula (layout de foco). Três modos:
 *   #aula-<id>       aula normal
 *   #dificil-<id>    ⚡ Modo Difícil da mesma aula
 *   #revisao-<code>  revisão dos erros guardados de um idioma
 *
 *  topo:   fechar · idioma · unidade · "Atividade 3 de 8"
 *          barra fina de progresso
 *  corpo:  [ Zuno (coluna própria à esquerda) ] [ pergunta · respostas · feedback ]
 *
 * O Zuno é dirigido pelo ZunoBrain (personalidade + histórico da aula).
 * No erro, a reação acontece em etapas: olha a resposta, pausa, olha para você,
 * muda a expressão e só então fala. Depois, a tela ensina a resposta certa.
 */
import { h } from '../../core/dom.js';
import { getLanguage } from '../../domain/languages.js';
import { findLesson, findExercise, lessonState, nextLesson, pad2 } from '../../domain/course.js';
import { hardenLesson, canUseHardMode, HARD_MODE } from '../../domain/hardMode.js';
import { canAccessLesson } from '../../services/access/AccessPolicy.js';
import { ProgressService } from '../../services/progress/ProgressService.js';
import { SettingsService, prefersReducedMotion } from '../../services/settings/SettingsService.js';
import { AudioService } from '../../services/audio/AudioService.js';
import { VoiceService } from '../../services/voice/VoiceService.js';
import { getItem } from '../../zuno/evolution.js';
import { myEvolution } from '../../zuno/myZuno.js';
import { SpeechService } from '../../services/audio/SpeechService.js';
import { LessonLayout } from '../../layouts/LessonLayout.js';
import { renderExercise } from '../../components/exercises/index.js';
import { fillBlank, stripReading } from '../../components/exercises/shared.js';
import { Button, ProgressBar, Placeholder } from '../../components/ui.js';
import { Flag } from '../../components/flags.js';
import { icon } from '../../components/icons.js';
import { createZunoBrain } from '../../zuno/brain.js';
import { renderLine } from '../../zuno/reactions.js';
import { ZunoCharacter } from '../../zuno/ZunoCharacter.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const IDLE_1 = 25000;
const IDLE_2 = 60000;

/* ======================= Entradas (rotas) ======================= */

export function LessonPage(props) {
  return openLesson(props, false);
}

export function HardLessonPage(props) {
  return openLesson(props, true);
}

function openLesson({ user, params, setTitle }, hard) {
  const ctx = findLesson(params[0]);
  if (!ctx) {
    return h('div', { class: 'lesson-screen lesson-screen--center' },
      Placeholder({ title: 'Aula não encontrada', text: 'Ela pode ter mudado de lugar. Volte para Aprender.' }),
      Button({ label: 'Ir para Aprender', href: '#aprender' }));
  }
  const { code, lesson } = ctx;
  const lang = getLanguage(code);
  const backHref = `#idioma-${code}`;
  setTitle(`${hard ? 'Modo Difícil · ' : ''}${lesson.title} · ${lang.name}`);

  if (!canAccessLesson(user, lesson).allowed) return PlusGate({ backHref });
  if (hard && !canUseHardMode(user, lesson).allowed) {
    return PlusGate({ backHref, title: 'O Modo Difícil completo é Plus.', text: 'No Free, você experimenta o Modo Difícil na primeira aula de cada idioma.' });
  }

  const progress = ProgressService.load(user.id);
  if (lessonState(ctx, progress, user) === 'locked') {
    return Notice({ lang, backHref, title: 'Uma aula de cada vez', text: 'Conclua a aula anterior para liberar esta.' });
  }
  if (!lesson.exercises.length) {
    return Notice({ lang, backHref, title: 'Esta aula está em preparação', text: 'Os exercícios chegam nas próximas atualizações.' });
  }

  const playable = hard ? hardenLesson(lesson, code) : lesson;
  return LessonRunner({
    user, lang, backHref, mode: hard ? 'hard' : 'normal',
    unitLabel: `Unidade ${pad2(ctx.unit.order)} · ${ctx.unit.title}`,
    title: `Aula ${pad2(lesson.order)} · ${lesson.title}`,
    where: {
      kicker: `Unidade ${pad2(ctx.unit.order)}`,
      title: ctx.unit.title,
      lesson: lesson.review ? 'Revisão' : `Aula ${pad2(lesson.order)}`,
      sub: lesson.review ? '' : lesson.title,
    },
    exercises: playable.exercises,
    lessonCtx: { ...ctx, lesson: playable },
  });
}

export function ReviewPage({ user, params, setTitle }) {
  const code = params[0];
  const lang = getLanguage(code);
  const backHref = `#idioma-${code}`;
  if (!lang) return Notice({ lang: { name: 'Aprender' }, backHref: '#aprender', title: 'Idioma não encontrado', text: '' });
  setTitle(`Revisão · ${lang.name}`);

  const p = ProgressService.load(user.id);
  const items = ProgressService.pendingMistakes(p, code)
    .map((m) => findExercise(m.exerciseId))
    .filter((x) => x && canAccessLesson(user, x.lesson).allowed)
    .slice(0, 10);

  if (!items.length) {
    return Notice({ lang, backHref, title: 'Nada para revisar', text: 'Você não tem erros pendentes neste idioma. Bom sinal.' });
  }
  return LessonRunner({
    user, lang, backHref, mode: 'review',
    unitLabel: 'Revisão de erros',
    title: `${items.length} ${items.length === 1 ? 'pergunta' : 'perguntas'} que você errou`,
    exercises: items.map((x) => x.exercise),
  });
}

/* ======================= Motor da aula ======================= */

/**
 * Topo da aula com hierarquia clara:
 *   idioma  ·  UNIDADE 01  ·  título da unidade  ·  Aula 01 (+ palavras da aula, discretas)
 *   barra fina de progresso  ·  "Atividade 1 de 11"
 */
function TopBar({ lang, unitLabel, title, where, backHref, hard }) {
  const counter = h('span', { class: 'lesson-bar__count', 'aria-live': 'polite' });
  const bar = ProgressBar({ value: 0, label: 'Progresso da aula' });
  const w = where || { kicker: '', title: unitLabel, lesson: '', sub: title };
  const root = h('header', { class: 'lesson-bar' },
    h('div', { class: 'lesson-bar__row' },
      h('a', { class: 'icon-btn', href: backHref, 'aria-label': 'Sair da aula' }, icon('close')),
      h('div', { class: 'lesson-bar__where' },
        Flag({ country: lang.flag, size: 'sm' }),
        h('span', { class: 'lesson-bar__lang', lang: lang.tag }, lang.native),
      ),
      hard && h('span', { class: 'hard-chip' }, icon('bolt'), 'Difícil'),
    ),
    h('div', { class: 'lesson-head' },
      (w.kicker || w.lesson) && h('p', { class: 'lesson-head__kicker' },
        w.kicker && h('span', {}, w.kicker),
        w.kicker && w.lesson && h('span', { class: 'lesson-head__dot', 'aria-hidden': 'true' }, '·'),
        w.lesson && h('span', { class: 'lesson-head__lesson' }, w.lesson)),
      h('h1', { class: 'lesson-head__title' }, w.title),
      w.sub && h('p', { class: 'lesson-head__sub', lang: lang.tag, title: w.sub }, w.sub),
    ),
    h('div', { class: 'lesson-bar__track' }, h('div', { class: 'lesson-bar__progress' }, bar), counter),
  );
  root.set = (done, total) => {
    const pct = Math.round((done / total) * 100);
    bar.setAttribute('aria-valuenow', String(pct));
    bar.querySelector('.progress__fill').style.width = `${pct}%`;
    counter.textContent = done >= total ? 'Concluída' : `Atividade ${Math.min(done + 1, total)} de ${total}`;
  };
  return root;
}

function LessonRunner({ user, lang, backHref, mode, unitLabel, title, where, exercises, lessonCtx }) {
  const settings = SettingsService.get(user.id);
  const personality = SettingsService.personalityFor(user);
  const progress = ProgressService.load(user.id);
  const hard = mode === 'hard';
  const reduced = () => prefersReducedMotion();
  const voiceOn = settings.voice !== false;
  // Abaixo do nível que o teste mostrou: o ensino continua, mas em "revisão rápida".
  const ORDER = { A1: 1, A2: 2, B1: 3, B2: 4, C2: 5 };
  const placedAt = ORDER[progress.languages[lang.code]?.placement?.estimated] || 0;
  const quick = Boolean(lessonCtx && placedAt > (ORDER[lessonCtx.level.cefr] || 0));
  const isGraded = (e) => e.type !== 'teach' && e.type !== 'speak';
  const gradedTotal = exercises.filter(isGraded).length;

  const brain = createZunoBrain({
    personality,
    hard,
    beginner: ProgressService.totals(progress).lessonsCompleted < 2,
    daysAway: mode === 'normal' ? ProgressService.daysAway(progress) || 0 : 0,
  });

  const total = exercises.length;
  const queue = [...exercises];
  const answers = [];
  const missed = new Map(); // exerciseId → { exercise, given }
  let done = 0;
  let current = null;
  let idleTimers = [];
  const startedAt = Date.now();

  const top = TopBar({ lang, unitLabel, title, where, backHref, hard });
  const stage = h('div', { class: 'lesson-stage' });
  const layout = LessonLayout({ body: stage, langTag: lang.tag, flag: lang.flag, evolution: myEvolution(user), hideTranslation: hard || !settings.showTranslation });
  const zuno = layout.companion;
  const root = h('div', { class: `lesson-screen${hard ? ' lesson-screen--hard' : ''}` }, top, layout);
  top.set(0, total);

  /** Aplica uma reação do cérebro no Zuno (expressão, olhar, movimento, fala, risada). */
  function apply(reaction) {
    if (!reaction) return;
    if (reaction.state) zuno.setState(reaction.state);
    zuno.look(reaction.look === 'question' ? 'question' : null);
    if (reaction.motion) zuno.play(reaction.motion);
    const spoken = reaction.line ? renderLine(reaction.line, lang.code) : null;
    zuno.say(spoken, reaction.laugh);
    // O Zuno FALA a reação no idioma estudado (voz real; ver VoiceService)
    if (spoken && voiceOn) VoiceService.speak(spoken.text, lang.code, { personality });
    if (reaction.laugh) AudioService.play(`laugh_${reaction.laugh}`, { enabled: settings.sound });
    if (reaction.then) setTimeout(() => root.isConnected && zuno.setState(reaction.then), 1600);
  }

  /** Sequência do erro: olha a resposta → pausa → olha para você → muda a expressão → fala. */
  async function errorSequence(reaction) {
    if (reduced()) {
      await sleep(120);
      apply({ ...reaction, look: null });
      return;
    }
    zuno.say(null);
    zuno.look('answer');
    await sleep(650);       // percebe o erro
    await sleep(380);       // pausa curta
    zuno.look('user');      // olha para você
    zuno.setState(reaction.state);
    await sleep(260);       // expressão muda
    apply({ ...reaction, look: null });
  }

  function clearIdle() {
    idleTimers.forEach(clearTimeout);
    idleTimers = [];
  }

  function armIdle() {
    clearIdle();
    idleTimers.push(setTimeout(() => root.isConnected && apply(brain.idle(1)), IDLE_1));
    idleTimers.push(setTimeout(() => root.isConnected && apply(brain.idle(2)), IDLE_2));
  }

  function showNext(first = false) {
    current?.destroy?.();
    const exercise = queue.shift();
    if (first) apply(brain.start());
    else apply(brain.next());

    const feedback = h('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
    feedback.hidden = true;

    current = renderExercise({
      exercise,
      lang,
      personality,
      quick,
      voiceOn,
      onAnswer: async ({ correct, given, expected, ungraded }) => {
        clearIdle();
        if (ungraded) {
          // Ensino e fala: não valem ponto, só avançam
          done += 1;
          top.set(done, total);
          if (queue.length) showNext(); else finish();
          return;
        }
        answers.push({ exerciseId: exercise.id, given, correct, at: new Date().toISOString() });
        if (correct) done += 1;
        else {
          if (!missed.has(exercise.id)) missed.set(exercise.id, { exercise, given });
          queue.push(exercise); // volta no fim
        }

        const reaction = brain.answer({ correct, exerciseId: exercise.id });
        if (reaction.sequence === 'error') await errorSequence(reaction);
        else apply({ ...reaction, look: null });
        if (!root.isConnected) return;

        top.set(done, total);
        renderFeedback(feedback, { exercise, correct, given, expected });
        feedback.hidden = false;
        const btn = feedback.querySelector('.btn');
        btn.focus({ preventScroll: true });
        feedback.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
      },
    });

    stage.replaceChildren(current, feedback);
    armIdle();
  }

  function renderFeedback(el, { exercise, correct, given, expected }) {
    const blank = exercise.prompt?.includes('___');
    const correctText = blank ? fillBlank(exercise.prompt, expected) : stripReading(expected);
    const givenText = blank ? fillBlank(exercise.prompt, given) : given;
    const explanation = exercise.explanation
      || (!correct && blank ? `Aqui a forma certa é “${stripReading(expected)}”.` : null);
    const sentenceLang = exercise.typedTranslation || ['listen', 'complete', 'write', 'order', 'translate', 'phrase'].includes(exercise.kind) || blank ? lang.tag : null;

    const next = Button({ label: 'Continuar', size: 'lg', block: true, onClick: () => (queue.length ? showNext() : finish()) });
    el.className = `feedback feedback--${correct ? 'right' : 'wrong'}`;

    const rows = [];
    if (!correct) {
      rows.push(h('div', { class: 'feedback__row' }, h('span', { class: 'feedback__k' }, 'Você respondeu'), h('span', { class: 'feedback__v feedback__v--given', lang: sentenceLang }, givenText)));
      rows.push(h('div', { class: 'feedback__row' }, h('span', { class: 'feedback__k' }, 'Correto'), h('span', { class: 'feedback__v feedback__v--right', lang: sentenceLang },
        correctText,
        canSpeakSentence(sentenceLang) && h('button', { class: 'feedback__say', type: 'button', 'aria-label': 'Ouvir a frase certa', onClick: () => SpeechService.speak(correctText, lang.code) }, icon('sound')),
      )));
    }
    if (exercise.translation && exercise.translation !== correctText) {
      rows.push(h('div', { class: 'feedback__row' }, h('span', { class: 'feedback__k' }, 'Tradução'), h('span', { class: 'feedback__v' }, exercise.translation)));
    }
    if (explanation && (!correct || exercise.kind === 'open')) {
      rows.push(h('p', { class: 'feedback__explain' }, explanation));
    }
    if (exercise.kind === 'open') {
      rows.push(h('div', { class: 'feedback__row' }, h('span', { class: 'feedback__k' }, 'Exemplo'), h('span', { class: 'feedback__v', lang: lang.tag }, exercise.sample)));
    }
    if (!correct) rows.push(h('p', { class: 'feedback__hint' }, 'Essa pergunta volta no fim da aula.'));

    el.replaceChildren(
      h('div', { class: 'feedback__text' },
        h('p', { class: 'feedback__label' }, h('span', { class: 'feedback__icon' }, icon(correct ? 'check' : 'close')), correct ? 'Correto' : 'Incorreto'),
        ...rows,
      ),
      next,
    );
  }

  const canSpeakSentence = (tag) => tag && SpeechService.canSpeak(lang.code);

  function finish() {
    clearIdle();
    current?.destroy?.();
    const seconds = (Date.now() - startedAt) / 1000;
    const wrongCount = answers.filter((a) => !a.correct).length;
    const correctFirst = Math.max(0, gradedTotal - missed.size);

    if (mode === 'review') {
      const r = ProgressService.completeReview(user.id, lang.code, { answers, seconds });
      apply(brain.complete({ perfect: wrongCount === 0 }));
      ProgressService.setZunoState(user.id, 'happy');
      top.set(total, total);
      stage.replaceChildren(Summary({
        title: 'Revisão concluída',
        stats: [['XP ganho', `+${r.xpEarned}`], ['Revisados', `${r.resolved}/${total}`], ['Erros', String(wrongCount)]],
        primary: Button({ label: 'Continuar', href: backHref, iconAfter: 'arrowRight', size: 'lg' }),
        secondary: Button({ label: 'Voltar', href: backHref, variant: 'secondary', size: 'lg' }),
      }));
      return;
    }

    const { code, cefr, course } = { code: lessonCtx.code, cefr: lessonCtx.level.cefr, course: lessonCtx.course };
    const result = ProgressService.completeLesson(user.id, { code, cefr, lesson: lessonCtx.lesson }, { correct: correctFirst, total: gradedTotal, seconds, answers, hard, plan: user.plan });
    const reaction = brain.complete({ perfect: wrongCount === 0 });
    apply(reaction);
    ProgressService.setZunoState(user.id, reaction.state);
    top.set(total, total);

    const after = ProgressService.load(user.id);
    const following = nextLesson(course, cefr, after);
    const nextHref = following ? `#aula-${following.id}` : backHref;

    stage.replaceChildren(Summary({
      title: hard ? '⚡ Modo Difícil concluído.' : 'Boa! Aula concluída.',
      subtitle: lessonCtx.lesson.title,
      stats: [
        ['XP ganho', `+${result.xpEarned}`],
        ['Acertos', `${correctFirst}/${gradedTotal}`],
        ['Erros', String(wrongCount)],
        ['Palavras novas', String(result.newWords.length)],
      ],
      words: result.newWords,
      unlocked: result.unlocked,
      lang,
      review: missed.size ? [...missed.values()] : null,
      onReview: () => restartWith([...missed.values()].map((m) => m.exercise)),
      primary: Button({ label: 'Continuar', href: nextHref, iconAfter: 'arrowRight', size: 'lg' }),
      secondary: Button({ label: 'Voltar', href: backHref, variant: 'secondary', size: 'lg' }),
    }));
  }

  /** "Repetir agora": a revisão roda aqui mesmo, sem sair da tela. */
  function restartWith(list) {
    const review = LessonRunner({ user, lang, backHref, mode: 'review', unitLabel: 'Revisão de erros', title: 'Vamos revisar isso', exercises: list });
    root.replaceWith(review);
    window.scrollTo({ top: 0 });
  }

  showNext(true);
  return root;
}

/* ======================= Telas auxiliares ======================= */

function Summary({ title, subtitle, stats, words = [], unlocked = [], lang, review, onReview, primary, secondary }) {
  return h('div', { class: 'summary' },
    h('div', { class: 'summary__head' },
      h('h1', { class: 'summary__title' }, title),
      subtitle && h('p', { class: 'summary__sub' }, subtitle),
    ),
    h('dl', { class: 'summary__stats' }, stats.map(([k, v]) => h('div', { class: 'summary__stat' }, h('dt', {}, k), h('dd', {}, v)))),
    words.length > 0 && h('ul', { class: 'word-chips', role: 'list', 'aria-label': 'Palavras novas' }, words.map((w) => h('li', { lang: lang?.tag }, w))),
    unlocked.length > 0 && h('div', { class: 'unlock-note', role: 'status' },
      h('span', { class: 'unlock-note__k' }, 'O Zuno evoluiu'),
      h('span', {}, unlocked.map((i) => getItem(i.id)?.label || i.label).join(' · ')),
      h('a', { class: 'link link--strong', href: '#perfil' }, 'Ver no perfil'),
    ),
    h('div', { class: 'summary__actions' }, primary, secondary),
    review && h('section', { class: 'review-box', 'aria-labelledby': 'review-title' },
      h('h2', { class: 'review-box__title', id: 'review-title' }, 'Vamos revisar isso?'),
      h('p', { class: 'review-box__text' }, 'Guardamos estes erros para você revisar depois também.'),
      h('ul', { class: 'review-list', role: 'list' }, review.map(({ exercise, given }) => {
        const blank = exercise.prompt?.includes('___');
        return h('li', { class: 'review-item' },
          h('span', { class: 'review-item__q', lang: lang?.tag }, blank ? fillBlank(exercise.prompt, exercise.answer) : stripReading(exercise.answer)),
          h('span', { class: 'review-item__a' }, `Você respondeu: ${blank ? fillBlank(exercise.prompt, given) : given}`),
        );
      })),
      Button({ label: 'Repetir agora', variant: 'secondary', icon: 'arrowRight', onClick: onReview }),
    ),
  );
}

/** Tela de bloqueio do conteúdo Plus: sem pop-up, uma tela calma. */
export function PlusGate({ backHref, title = 'Você chegou até aqui.', text = 'Continue sua jornada com Zuno Plus.' }) {
  const back = () => (history.length > 1 ? history.back() : (location.hash = backHref));
  return h('div', { class: 'lesson-screen lesson-screen--center' },
    h('div', { class: 'gate' },
      ZunoCharacter({ size: 'lg', state: 'neutral', decorative: true, className: 'gate__zuno' }),
      h('p', { class: 'plus-chip' }, icon('lock'), 'Conteúdo Plus'),
      h('h1', { class: 'gate__title' }, title),
      h('p', { class: 'gate__text' }, text),
      h('div', { class: 'gate__actions' },
        Button({ label: 'Conhecer o Plus', href: '#plus', size: 'lg', block: true }),
        Button({ label: 'Voltar', variant: 'secondary', size: 'lg', block: true, onClick: back }),
      ),
    ),
  );
}

function Notice({ lang, backHref, title, text }) {
  return h('div', { class: 'lesson-screen lesson-screen--center' },
    h('div', { class: 'gate' },
      ZunoCharacter({ size: 'lg', state: 'neutral', decorative: true, className: 'gate__zuno' }),
      h('h1', { class: 'gate__title' }, title),
      text && h('p', { class: 'gate__text' }, text),
      h('div', { class: 'gate__actions' }, Button({ label: `Voltar para ${lang.name}`, href: backHref, size: 'lg', block: true })),
    ),
  );
}

export { HARD_MODE };
