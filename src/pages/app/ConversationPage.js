/**
 * Conversa com o Zuno (layout de foco), usada por:
 *   #conversa-<idioma>-<nível>-<tema>   Conversar com Zuno
 *   #cena-<idioma>-<situação>            🌎 Modo Mundo
 *   #sessao-<id>                         retomar uma conversa recente
 *
 *  [ Zuno à esquerda: reage, fica quieto, se surpreende ] [ falas · correções · palavras novas · resposta ]
 *
 * A IA real é chamada só quando a pessoa age (Começar / Enviar).
 */
import { h } from '../../core/dom.js';
import { getLanguage } from '../../domain/languages.js';
import { getSituation, getTopic, WORLD_PLACES, READY } from '../../domain/world.js';
import { CEFR_LEVELS } from '../../domain/models.js';
import { AIService } from '../../services/ai/AIService.js';
import { UsageService } from '../../services/ai/UsageService.js';
import { SessionStore } from '../../services/ai/SessionStore.js';
import { learnerContext } from '../../services/ai/learnerContext.js';
import { SettingsService, prefersReducedMotion } from '../../services/settings/SettingsService.js';
import { AudioService, PERSONALITY_SOUNDS } from '../../services/audio/AudioService.js';
import { LessonLayout } from '../../layouts/LessonLayout.js';
import { ZunoLine, UserLine, CorrectionBlock, TeachCard, AIUnavailable, UsageMeter } from '../../components/ai/blocks.js';
import { Button, Placeholder } from '../../components/ui.js';
import { Flag } from '../../components/flags.js';
import { icon } from '../../components/icons.js';
import { presentEmotion } from '../../zuno/zuno.states.js';
import { renderLine } from '../../zuno/reactions.js';
import { PlusGate } from './LessonPage.js';

/* ======================= Rotas ======================= */

export function ChatPage({ user, params, setTitle }) {
  const [code, level, topicId] = params;
  const lang = getLanguage(code);
  const topic = getTopic(topicId);
  if (!lang || !topic || !CEFR_LEVELS.includes(level.toUpperCase())) return NotFound();
  setTitle(`Conversar · ${topic.label}`);
  const session = SessionStore.create(user.id, { kind: 'chat', code, level: level.toUpperCase(), topic: topic.id });
  return Conversation({ user, session });
}

export function ScenePage({ user, params, setTitle }) {
  const [code, situationId] = params;
  const lang = getLanguage(code);
  const situation = getSituation(situationId);
  if (!lang || !situation) return NotFound();
  setTitle(`Modo Mundo · ${situation.label}`);
  if (!situation.free && user.plan !== 'plus') {
    return PlusGate({ backHref: '#mundo', title: 'Essa situação é do Modo Mundo completo.', text: 'No Free você vive Cafeteria, Aeroporto e Restaurante. O Plus libera o mundo inteiro.' });
  }
  const p = learnerContext(user, code);
  const session = SessionStore.create(user.id, { kind: 'world', code, level: p.level, situation: situation.id });
  return Conversation({ user, session });
}

export function ResumePage({ user, params, setTitle }) {
  const session = SessionStore.get(user.id, params[0]);
  if (!session) return NotFound('Conversa não encontrada', 'Ela pode ter sido apagada deste aparelho.');
  setTitle('Conversa');
  if (session.kind === 'world' && !getSituation(session.situation)?.free && user.plan !== 'plus') return PlusGate({ backHref: '#mundo' });
  return Conversation({ user, session, resumed: true });
}

function NotFound(title = 'Conversa não encontrada', text = 'Volte para o Modo Mundo e comece de novo.') {
  return h('div', { class: 'lesson-screen lesson-screen--center' },
    Placeholder({ title, text }), Button({ label: 'Ir para o Modo Mundo', href: '#mundo' }));
}

/* ======================= Conversa ======================= */

function Conversation({ user, session, resumed = false }) {
  const lang = getLanguage(session.code);
  const settings = SettingsService.get(user.id);
  const personality = SettingsService.personalityFor(user);
  const isWorld = session.kind === 'world';
  const situation = isWorld ? getSituation(session.situation) : null;
  const topic = !isWorld ? getTopic(session.topic) : null;
  const place = WORLD_PLACES[lang.code];
  const feature = isWorld ? 'world' : 'chat';
  const hideTr = !settings.showTranslation;

  let busy = false;
  let ctl = null;

  /* ---------- topo ---------- */
  const meterSlot = h('span', { class: 'talk-bar__meter' });
  const top = h('header', { class: 'lesson-bar' },
    h('div', { class: 'lesson-bar__row' },
      h('a', { class: 'icon-btn', href: '#mundo', 'aria-label': 'Sair da conversa' }, icon('close')),
      h('div', { class: 'lesson-bar__where' },
        Flag({ country: lang.flag, size: 'sm' }),
        h('span', { class: 'lesson-bar__lang', lang: lang.tag }, lang.native),
        h('span', { class: 'lesson-bar__sep', 'aria-hidden': 'true' }, '·'),
        h('span', { class: 'lesson-bar__unit' }, isWorld ? `${situation.emoji} ${situation.label}` : `${topic.emoji} ${topic.label}`),
      ),
      h('span', { class: 'level-chip' }, session.level),
    ),
    h('div', { class: 'talk-bar__sub' }, meterSlot),
  );

  function refreshMeter() {
    const lim = UsageService.limitsFor(user)[feature];
    const used = UsageService.read(user.id)[feature] || 0;
    meterSlot.replaceChildren(h('span', { class: 'talk-bar__label' }, isWorld ? 'Modo Mundo hoje' : 'Mensagens hoje'), UsageMeter({ used, limit: lim }));
  }

  /* ---------- corpo ---------- */
  const transcript = h('div', { class: 'talk__log', 'aria-live': 'polite' });
  const wordsBox = h('div', { class: 'talk__words' });
  const notice = h('div', { class: 'talk__notice' });
  const thinking = h('p', { class: 'talk__thinking' }, h('span', { class: 'dots', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')), 'Zuno está pensando…');
  thinking.hidden = true;

  const input = h('textarea', { class: 'field__input talk__input', id: 'talk-input', rows: '1', lang: lang.tag, placeholder: `Responda em ${lang.name.toLowerCase()}…`, autocomplete: 'off' });
  const send = h('button', { class: 'btn btn--primary talk__send', type: 'submit', 'aria-label': 'Enviar' }, icon('arrowRight'));
  const composer = h('form', { class: 'talk__composer', novalidate: true },
    h('label', { class: 'sr-only', for: 'talk-input' }, 'Sua resposta'), input, send);
  composer.hidden = true;

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); composer.requestSubmit(); }
  });
  composer.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy) return;
    input.value = '';
    input.style.height = 'auto';
    turn(text);
  });

  const intro = Intro();
  const body = h('div', { class: 'talk' }, intro, transcript, thinking, notice, wordsBox, composer);
  const layout = LessonLayout({ body, langTag: lang.tag, flag: lang.flag, hideTranslation: hideTr });
  const zuno = layout.companion;
  const root = h('div', { class: 'lesson-screen talk-screen' }, top, layout);

  /* ---------- abertura ---------- */
  function Intro() {
    if (resumed && session.turns.length) return h('div');
    const startBtn = Button({ label: isWorld ? 'Começar a situação' : 'Começar conversa', size: 'lg', iconAfter: 'arrowRight', onClick: () => { startBtn.remove(); turn(null); } });
    if (isWorld) {
      return h('section', { class: 'scene' },
        h('p', { class: 'scene__place' }, Flag({ country: lang.flag, size: 'sm' }), place.country.toUpperCase()),
        h('h1', { class: 'scene__title' }, h('span', { 'aria-hidden': 'true' }, situation.emoji), ` ${situation.label}`),
        h('p', { class: 'scene__text' }, situation.scene.replace('{city}', place.city)),
        h('p', { class: 'scene__goal' }, h('strong', {}, 'Seu objetivo: '), situation.goal, '.'),
        startBtn,
      );
    }
    return h('section', { class: 'scene' },
      h('p', { class: 'scene__place' }, 'Conversar com Zuno'),
      h('h1', { class: 'scene__title' }, h('span', { 'aria-hidden': 'true' }, topic.emoji), ` ${topic.label}`),
      h('p', { class: 'scene__text' }, `Uma conversa em ${lang.name.toLowerCase()} no nível ${session.level}. O Zuno pergunta, você responde. Ele corrige só o que importa.`),
      startBtn,
    );
  }

  /* ---------- render de falas ---------- */
  function renderTurn(t) {
    if (t.role === 'user') {
      const block = h('div', { class: 'talk__turn talk__turn--user' }, UserLine({ text: t.text, lang }));
      if (t.correction) block.append(CorrectionBlock({ correction: t.correction, lang }));
      return block;
    }
    if (t.role === 'zuno') {
      return h('div', { class: 'talk__turn' },
        ZunoLine({ text: t.text, translation: t.translation, lang, personality, hideTranslation: hideTr, demo: t.demo }),
        t.teach && TeachCard({ teach: t.teach, lang, personality }),
      );
    }
    if (t.role === 'done') {
      return h('div', { class: 'scene-done' },
        h('p', { class: 'scene-done__title' }, isWorld ? 'Situação concluída' : 'Boa conversa'),
        h('p', { class: 'scene-done__text' }, `Palavras novas: ${session.words.length ? session.words.join(', ') : 'nenhuma'}.`),
        h('div', { class: 'scene-done__actions' },
          Button({ label: 'Nova situação', href: '#mundo', iconAfter: 'arrowRight' }),
          Button({ label: 'Continuar conversando', variant: 'secondary', onClick: () => { composer.hidden = false; input.focus(); } }),
        ),
      );
    }
    return null;
  }

  function renderWords() {
    wordsBox.replaceChildren(...(session.words.length ? [
      h('p', { class: 'talk__words-k' }, isWorld ? 'Palavras desta situação' : 'Palavras desta conversa'),
      h('ul', { class: 'word-chips', role: 'list' }, session.words.map((w) => h('li', { lang: lang.tag }, w))),
    ] : []));
  }

  /* ---------- ciclo da conversa ---------- */
  function contextFor(userMessage) {
    const base = learnerContext(user, lang.code, { level: session.level });
    return {
      ...base,
      mode: isWorld ? 'world' : 'chat',
      difficulty: session.difficulty,
      situation: isWorld ? { ...situation, scene: situation.scene.replace('{city}', place.city) } : null,
      topic,
      session: SessionStore.memory(session),
      userMessage,
    };
  }

  async function turn(userText) {
    if (busy) return;
    notice.replaceChildren();
    const status = await AIService.status();
    if (!status.ready) {
      notice.replaceChildren(AIUnavailable());
      zuno.setState('confused');
      return;
    }
    busy = true;
    send.disabled = true;

    let userTurn = null;
    if (userText) {
      userTurn = { role: 'user', text: userText, at: new Date().toISOString() };
      session.turns.push(userTurn);
      const node = renderTurn(userTurn);
      transcript.append(node);
      userTurn.node = node;
    }
    zuno.say(null);
    zuno.setState('curious');
    zuno.look(userText ? 'answer' : 'question');
    thinking.hidden = false;
    thinking.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });

    ctl = new AbortController();
    try {
      const r = await AIService.converse(contextFor(userText), { user, signal: ctl.signal });
      if (!root.isConnected) return;
      applyResult(r, userTurn);
    } catch (e) {
      if (!root.isConnected || e.code === 'cancelled') return;
      if (userTurn) userTurn.failed = true;
      notice.replaceChildren(h('p', { class: `talk__error${e.code === 'limit' ? ' is-limit' : ''}` }, e.message,
        e.code === 'limit' && user.plan !== 'plus' ? h('a', { class: 'link link--strong', href: '#plus' }, ' Conhecer o Plus') : null));
      zuno.setState('confused');
    } finally {
      if (userTurn) delete userTurn.node;
      busy = false;
      send.disabled = false;
      thinking.hidden = true;
      zuno.look(null);
      refreshMeter();
    }
  }

  function applyResult(r, userTurn) {
    // 1) Zuno reage (ou fica quieto)
    const shown = presentEmotion(r.emotion, personality);
    if (r.surprise) zuno.surprise(shown === 'surprised' ? 'happy' : shown);
    else zuno.setState(shown);
    if (r.laugh) {
      zuno.play(r.laugh === 'big' ? 'laugh-big' : 'laugh');
      AudioService.play(PERSONALITY_SOUNDS[personality].laugh, { enabled: settings.sound });
    } else if (shown === 'happy' || shown === 'proud') zuno.play('celebrate');
    zuno.say(r.reaction ? { text: r.reaction.text, translation: lang.code === 'pt' ? null : r.reaction.translation } : null, r.laugh);

    // 2) correção ligada à fala do aluno
    if (userTurn && r.correction) {
      userTurn.correction = r.correction;
      userTurn.node.append(CorrectionBlock({ correction: r.correction, lang }));
    }
    if (userTurn) delete userTurn.node;

    // 3) resposta do Zuno + palavra nova
    const zt = { role: 'zuno', text: r.reply.text, translation: lang.code === 'pt' ? null : r.reply.translation, teach: r.teach, demo: r.demo, at: new Date().toISOString() };
    session.turns.push(zt);
    transcript.append(renderTurn(zt));

    // 4) memória e dificuldade adaptativa
    if (r.summary) session.summary = r.summary;
    const words = [...r.newWords, ...(r.teach ? [r.teach.term] : [])];
    session.words = [...new Set([...session.words, ...words])].slice(-40);
    if (r.correction?.severity === 'major') {
      session.errors = [...session.errors, `${r.correction.you_wrote || ''} → ${r.correction.natural}`].slice(-10);
      session.badStreak += 1;
      session.goodStreak = 0;
    } else if (userTurn) {
      session.goodStreak += 1;
      session.badStreak = 0;
    }
    if (r.difficulty === 'harder' || session.goodStreak >= 3) { session.difficulty = Math.min(2, session.difficulty + 1); session.goodStreak = 0; }
    if (r.difficulty === 'easier' || session.badStreak >= 2) { session.difficulty = Math.max(-2, session.difficulty - 1); session.badStreak = 0; }

    if (r.goalDone && !session.goalDone) {
      session.goalDone = true;
      session.turns.push({ role: 'done' });
      transcript.append(renderTurn({ role: 'done' }));
      composer.hidden = true;
    } else {
      composer.hidden = false;
    }
    renderWords();
    SessionStore.save(user.id, session);
    transcript.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    if (!composer.hidden && window.matchMedia('(hover: hover)').matches) input.focus({ preventScroll: true });
  }

  /* ---------- estado inicial ---------- */
  refreshMeter();
  if (resumed && session.turns.length) {
    session.turns.forEach((t) => { const n = renderTurn(t); if (n) transcript.append(n); });
    composer.hidden = session.goalDone;
    renderWords();
  } else {
    // O Zuno aparece ao lado e cumprimenta no idioma estudado ("Bonjour! Pronto?")
    const [txt, tr] = READY[lang.code];
    zuno.say(renderLine({ text: { [lang.code]: txt, pt: tr || txt } }, lang.code));
    zuno.play('pop');
  }
  AIService.status().then((s) => {
    if (!s.ready && root.isConnected) notice.replaceChildren(AIUnavailable());
  });

  return root;
}
