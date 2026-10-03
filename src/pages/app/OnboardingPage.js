/**
 * Quiz inicial (logo depois do cadastro) e teste de nível de um idioma.
 *   #comecar      → escolhe UM idioma → como você se descreve → teste → resultado
 *   #nivel-<code> → mesmo teste, para um idioma específico
 *
 * O Zuno acompanha à esquerda. O nível estimado personaliza o caminho,
 * mas não pula o ensino.
 */
import { h } from '../../core/dom.js';
import { LANGUAGES, getLanguage } from '../../domain/languages.js';
import { createPlacementTest, startingLesson, SELF_REPORT } from '../../domain/placement.js';
import { ProgressService } from '../../services/progress/ProgressService.js';
import { SettingsService } from '../../services/settings/SettingsService.js';
import { VoiceService } from '../../services/voice/VoiceService.js';
import { LessonLayout } from '../../layouts/LessonLayout.js';
import { renderExercise } from '../../components/exercises/index.js';
import { Button } from '../../components/ui.js';
import { Flag } from '../../components/flags.js';
import { icon } from '../../components/icons.js';
import { LEVEL_INFO } from '../../content/curriculum/levels.js';

export function OnboardingPage({ user, setTitle, signOut }) {
  setTitle('Seu ponto de partida');
  return PlacementFlow({ user, code: null, onboarding: true, signOut });
}

export function LevelTestPage({ user, params, setTitle }) {
  const lang = getLanguage(params[0]);
  setTitle(`Teste de nível · ${lang?.name || ''}`);
  return PlacementFlow({ user, code: lang ? lang.code : null, onboarding: false });
}

function PlacementFlow({ user, code: initialCode, onboarding, signOut }) {
  const personality = SettingsService.personalityFor(user);
  let code = initialCode;
  const stage = h('div', { class: 'onb' });
  const layout = LessonLayout({ body: stage, langTag: 'pt-BR' });
  const zuno = layout.companion;
  const progressBar = h('div', { class: 'onb__progress' });

  const close = onboarding ? null : h('a', { class: 'icon-btn', href: `#idioma-${code}`, 'aria-label': 'Fechar' }, icon('close'));
  const root = h('div', { class: 'lesson-screen lesson-screen--free' },
    h('header', { class: 'lesson-bar' }, h('div', { class: 'lesson-bar__row' }, close,
      h('div', { class: 'lesson-bar__where' }, h('span', { class: 'lesson-bar__lang' }, onboarding ? 'Bem-vindo ao Zuno' : 'Teste de nível')),
      onboarding && signOut && h('button', { class: 'btn btn--ghost btn--sm onb__exit', type: 'button', onClick: signOut }, icon('logout'), h('span', { class: 'btn__label' }, 'Sair'))), progressBar),
    layout);

  /* 1) Um idioma só */
  function stepLanguage() {
    zuno.setState('happy');
    zuno.play('pop');
    zuno.say({ text: 'Oi! Eu sou o Zuno. Vou te acompanhar.' });
    let picked = null;
    const go = Button({ label: 'Continuar', size: 'lg', iconAfter: 'arrowRight', onClick: () => picked && stepSelf(picked) });
    go.disabled = true;
    const grid = h('div', { class: 'onb__langs', role: 'radiogroup', 'aria-label': 'Idioma' },
      LANGUAGES.map((l) => {
        const b = h('button', { class: 'onb__lang', type: 'button', role: 'radio', 'aria-checked': 'false' },
          Flag({ country: l.flag, size: 'md' }),
          h('span', { class: 'onb__lang-text' }, h('strong', {}, l.name), h('span', { lang: l.tag }, l.native)));
        b.addEventListener('click', () => {
          picked = l.code;
          grid.querySelectorAll('.onb__lang').forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-checked', String(x === b)); });
          go.disabled = false;
        });
        return b;
      }));
    stage.replaceChildren(
      h('p', { class: 'eyebrow' }, 'Passo 1 de 3'),
      h('h1', { class: 'onb__title' }, 'Vamos descobrir seu ponto de partida.'),
      h('p', { class: 'onb__q' }, 'Qual idioma você quer aprender primeiro?'),
      h('p', { class: 'muted' }, 'Escolha só um agora. Depois você pode adicionar outros.'),
      grid, h('div', { class: 'onb__actions' }, go),
    );
  }

  /* 2) Como você se descreve (ponto de partida do teste) */
  function stepSelf(c) {
    code = c;
    const lang = getLanguage(code);
    zuno.setState('curious');
    zuno.say({ text: `${lang.name}! Boa escolha.` });
    stage.replaceChildren(
      h('p', { class: 'eyebrow' }, onboarding ? 'Passo 2 de 3' : 'Antes do teste'),
      h('h1', { class: 'onb__title' }, `Você já estudou ${lang.name.toLowerCase()}?`),
      h('p', { class: 'muted' }, 'Isso só define por onde o teste começa. As perguntas é que decidem.'),
      h('div', { class: 'onb__self' }, SELF_REPORT.map((s) => h('button', { class: 'pill pill--lg', type: 'button', onClick: () => stepTest(s.id) }, s.label))),
    );
  }

  /* 3) Teste adaptativo */
  function stepTest(declaredId) {
    const lang = getLanguage(code);
    const test = createPlacementTest(code, declaredId);
    zuno.setState('neutral');
    zuno.say({ text: 'Responda sem pressa. Se não souber, tudo bem: toque em “Não sei”.' });

    function ask() {
      if (test.done) return finish();
      const q = test.next();
      if (!q) return finish();
      progressBar.replaceChildren(h('span', { class: 'onb__count' }, `Pergunta ${test.asked + 1} de ${test.total}`));
      let answered = false;
      const decide = (correct) => {
        if (answered) return;
        answered = true;
        test.answer(q, correct);
        zuno.setState(correct ? 'happy' : 'curious');
        if (correct) zuno.play('celebrate');
        setTimeout(() => root.isConnected && ask(), correct ? 700 : 900);
      };
      const view = renderExercise({ exercise: q.exercise, lang, personality, onAnswer: ({ correct }) => decide(correct) });
      const dontKnow = h('button', { class: 'btn btn--ghost', type: 'button', onClick: () => decide(false) }, h('span', { class: 'btn__label' }, 'Não sei'));
      stage.replaceChildren(
        h('p', { class: 'eyebrow' }, onboarding ? 'Passo 3 de 3 · Teste de nível' : 'Teste de nível'),
        h('p', { class: 'onb__level-hint' }, `${q.cefr} · ${q.unitTitle}`),
        view, h('div', { class: 'onb__actions' }, dontKnow),
      );
    }

    function finish() {
      const r = test.result();
      ProgressService.savePlacement(user.id, code, r);
      progressBar.replaceChildren();
      zuno.setState('proud');
      zuno.play('celebrate');
      const line = { text: 'Já temos uma ideia de onde você está.' };
      zuno.say(line);
      const start = startingLesson(code, r.estimated);
      const list = (items, empty) => (items.length
        ? h('ul', { class: 'onb__list', role: 'list' }, items.map((i) => h('li', {}, h('span', { class: 'level-chip' }, i.cefr), ` ${i.title}`)))
        : h('p', { class: 'muted' }, empty));

      stage.replaceChildren(
        h('p', { class: 'eyebrow' }, 'Resultado'),
        h('h1', { class: 'onb__title' }, 'Já temos uma ideia de onde você está.'),
        h('p', { class: 'onb__q' }, 'Vamos montar seu caminho.'),
        h('dl', { class: 'onb__result' },
          h('div', {}, h('dt', {}, 'Idioma'), h('dd', {}, Flag({ country: lang.flag, size: 'sm' }), ` ${lang.name}`)),
          h('div', {}, h('dt', {}, 'Nível estimado'), h('dd', {}, `${r.bucket} · ${r.estimated} (${LEVEL_INFO[r.estimated].title})`)),
          h('div', {}, h('dt', {}, 'Acertos no teste'), h('dd', {}, `${r.correct} de ${r.total}`)),
        ),
        h('section', { class: 'onb__cols' },
          h('div', {}, h('h2', { class: 'setup__title' }, 'Pontos fortes'), list(r.strengths, 'Vamos construir desde o começo.')),
          h('div', {}, h('h2', { class: 'setup__title' }, 'Precisa de prática'), list(r.practice, 'Nada urgente. Bora avançar.')),
        ),
        h('p', { class: 'onb__note' }, r.gaps.length
          ? 'Mesmo no seu nível, vou reforçar o que apareceu como lacuna. Nada é pulado: o que você já sabe vira revisão rápida.'
          : 'O que você já domina vira revisão rápida. O resto, eu ensino passo a passo.'),
        h('div', { class: 'onb__actions' },
          Button({ label: 'Começar com Zuno', size: 'lg', iconAfter: 'arrowRight', href: start ? `#aula-${start.id}` : `#idioma-${code}` }),
          Button({ label: 'Ver o caminho completo', variant: 'secondary', size: 'lg', href: `#idioma-${code}` }),
        ),
      );
      VoiceService.stop();
    }
    ask();
  }

  if (code) stepSelf(code); else stepLanguage();
  return root;
}
