/**
 * Página do idioma: progresso do nível, seletor A1–C1 e a trilha de unidades.
 */
import { h } from '../../core/dom.js';
import { getLanguage } from '../../domain/languages.js';
import { getCourse } from '../../content/index.js';
import { activeLevels, getLevel, levelLessons, levelPercent, nextLesson, lessonState, pad2, recommendedUnits, placementOf } from '../../domain/course.js';
import { ProgressService } from '../../services/progress/ProgressService.js';
import { isPlus } from '../../services/access/AccessPolicy.js';
import { SettingsService } from '../../services/settings/SettingsService.js';
import { canUseHardMode, HARD_MODE } from '../../domain/hardMode.js';
import { Button, ProgressBar, Placeholder } from '../../components/ui.js';
import { Flag } from '../../components/flags.js';
import { icon } from '../../components/icons.js';

const STATE_LABEL = {
  completed: 'Concluída',
  current: 'Próxima',
  available: 'Disponível',
  locked: 'Bloqueada: conclua a aula anterior',
  plus: 'Bloqueada: Zuno Plus',
  soon: 'Em preparação',
};

const STATE_ICON = { completed: 'check', current: 'arrowRight', available: 'arrowRight', locked: 'lock', plus: 'lock', soon: 'clock' };

export function LanguagePage({ user, params, go, setTitle }) {
  const code = params[0];
  const lang = getLanguage(code);
  const course = getCourse(code);
  if (!lang || !course) {
    return h('div', { class: 'page' }, Placeholder({ title: 'Idioma não encontrado', text: 'Volte para Aprender e escolha um idioma da lista.' }));
  }
  setTitle(lang.name);

  let progress = ProgressService.load(user.id);
  const userLevel = progress.languages[code]?.level || 'A1';
  let selected = userLevel;

  const root = h('div', { class: 'page language' });

  function render() {
    progress = ProgressService.load(user.id);
    const added = Boolean(progress.languages[code]);
    const level = getLevel(course, selected);
    const percent = levelPercent(course, selected, progress);
    const flat = levelLessons(level);
    const doneCount = flat.filter((l) => progress.lessons[l.id]?.status === 'completed').length;
    const next = nextLesson(course, selected, progress);
    const hardOn = Boolean(SettingsService.get(user.id).hardMode);
    const pending = ProgressService.pendingMistakes(progress, code).length;

    const header = h('header', { class: 'language__head' },
      h('a', { class: 'back-link', href: '#aprender' }, icon('arrowLeft'), 'Aprender'),
      h('div', { class: 'language__id' },
        Flag({ country: lang.flag, size: 'lg' }),
        h('div', { class: 'language__names' },
          h('h1', { class: 'language__native', lang: lang.tag }, lang.native),
          h('p', { class: 'language__pt' }, lang.name),
        ),
        !added && h('button', { class: 'btn btn--secondary language__add', type: 'button', onClick: () => { ProgressService.addLanguage(user.id, code); render(); } },
          icon('plus'), h('span', { class: 'btn__label' }, 'Adicionar aos meus idiomas')),
      ),
    );

    const summary = h('section', { class: 'level-summary', 'aria-label': 'Seu progresso' },
      h('div', { class: 'level-summary__top' },
        h('p', { class: 'eyebrow' }, 'Seu progresso'),
        h('span', { class: 'level-summary__count' }, `${doneCount} de ${flat.length} aulas`),
      ),
      h('div', { class: 'level-summary__row' },
        h('span', { class: 'level-chip level-chip--lg' }, selected),
        h('span', { class: 'level-summary__title' }, level.title),
        h('div', { class: 'level-summary__bar' }, ProgressBar({ value: percent, label: `Progresso no ${selected}` })),
        h('strong', { class: 'level-summary__pct' }, `${percent}%`),
      ),
      next && next.exercises.length
        ? Button({ label: doneCount ? `Continuar · ${next.title}` : 'Começar a primeira aula', href: `#${hardOn && canUseHardMode(user, next).allowed ? 'dificil' : 'aula'}-${next.id}`, iconAfter: 'arrowRight', size: 'lg' })
        : null,
    );

    const placed = placementOf(progress, code);
    const placement = h('p', { class: 'placement-row' },
      placed
        ? [h('span', {}, 'Ponto de partida do teste: '), h('strong', {}, `${placed.estimated} · ${placed.bucket}`), ' · ', h('a', { class: 'link', href: `#nivel-${code}` }, 'refazer o teste')]
        : [h('span', {}, 'Já sabe um pouco? '), h('a', { class: 'link link--strong', href: `#nivel-${code}` }, 'Fazer o teste de nível')]);

    const review = pending > 0 && h('a', { class: 'review-row', href: `#revisao-${code}` },
      h('span', { class: 'review-row__icon' }, icon('lessons')),
      h('span', { class: 'review-row__text' },
        h('strong', {}, 'Vamos revisar isso?'),
        h('span', {}, `${pending} ${pending === 1 ? 'erro guardado' : 'erros guardados'} para praticar`),
      ),
      h('span', { class: 'review-row__go' }, 'Revisar', icon('arrowRight')),
    );

    const hardInput = h('input', { type: 'checkbox', id: 'hard-toggle', class: 'switch__input', checked: hardOn });
    hardInput.addEventListener('change', () => { SettingsService.update(user.id, { hardMode: hardInput.checked }); render(); });
    const hardCard = h('section', { class: `hard-card${hardOn ? ' is-on' : ''}`, 'aria-labelledby': 'hard-title' },
      h('label', { class: 'switch hard-card__switch', for: 'hard-toggle' },
        h('span', { class: 'switch__text' },
          h('span', { class: 'hard-card__title', id: 'hard-title' }, h('span', { class: 'hard-card__bolt', 'aria-hidden': 'true' }, icon('bolt')), HARD_MODE.label),
          h('span', { class: 'switch__hint' }, `${HARD_MODE.tagline} Menos dicas e tradução, mais escrita e listening. +50% de XP.`),
        ),
        hardInput,
        h('span', { class: 'switch__track', 'aria-hidden': 'true' }, h('span', { class: 'switch__thumb' })),
      ),
      hardOn && !isPlus(user) && h('p', { class: 'hard-card__note' }, 'No Free, o Modo Difícil vale para a Aula 01. O modo completo é Plus.'),
    );

    const tabs = h('div', { class: 'level-tabs', role: 'tablist', 'aria-label': 'Níveis' },
      activeLevels(course).map((lv) => {
        return h('button', {
          class: `level-tab${lv.cefr === selected ? ' is-active' : ''}`,
          type: 'button',
          role: 'tab',
          'aria-selected': String(lv.cefr === selected),
          onClick: () => { selected = lv.cefr; render(); },
        },
          h('span', { class: 'level-tab__code' }, lv.cefr),
          h('span', { class: 'level-tab__title' }, lv.title),
        );
      }),
    );

    let path;
    if (!level.units.length) {
      path = h('div', { class: 'level-empty' },
        Placeholder({
          iconName: 'lock',
          title: `O nível ${selected} está em preparação`,
          text: isPlus(user)
            ? 'As unidades deste nível chegam nas próximas atualizações.'
            : 'Quando for lançado, o nível ficará disponível no Zuno Plus.',
        }),
        !isPlus(user) && Button({ label: 'Conhecer o Plus', variant: 'secondary', href: '#plus' }),
      );
    } else {
      const recommended = recommendedUnits(progress, code);
      path = h('div', { class: 'path' }, level.units.map((unit) => UnitBlock({ unit, flat, progress, user, hardOn, code, level, recommended: recommended.has(unit.id) })));
    }

    root.replaceChildren(header, summary, placement, review || '', hardCard, h('div', { class: 'language__course' }, tabs, path));
  }

  render();
  return root;
}

function UnitBlock({ unit, flat, progress, user, hardOn, code, level, recommended }) {
  const done = unit.lessons.filter((l) => progress.lessons[l.id]?.status === 'completed').length;
  const allPlus = !isPlus(user) && unit.lessons.every((l) => l.tier === 'plus');

  return h('section', { class: `unit${allPlus ? ' unit--locked' : ''}`, 'aria-labelledby': `${unit.id}-t` },
    h('header', { class: 'unit__head' },
      h('div', {},
        h('p', { class: 'eyebrow' }, `Unidade ${pad2(unit.order)}`),
        h('h2', { class: 'unit__title', id: `${unit.id}-t` }, unit.title),
        (unit.skills || recommended) && h('ul', { class: 'skill-chips skill-chips--sm', role: 'list' },
          recommended && h('li', { class: 'is-reco' }, 'Recomendado para você'),
          (unit.skills || []).map((s) => h('li', {}, s))),
      ),
      allPlus
        ? h('span', { class: 'plus-chip' }, icon('lock'), 'Plus')
        : h('span', { class: 'unit__count' }, `${done}/${unit.lessons.length}`),
    ),
    h('ol', { class: 'path__list' },
      unit.lessons.map((lesson) => {
        const state = lessonState({ lesson, flat, index: flat.indexOf(lesson), code, level }, progress, user);
        const clickable = ['completed', 'current', 'available', 'plus'].includes(state);
        const hardLocked = hardOn && state !== 'plus' && !canUseHardMode(user, lesson).allowed;
        const prefix = hardOn && state !== 'plus' ? 'dificil' : 'aula';
        const inner = [
          h('span', { class: 'node__dot' }, icon(STATE_ICON[state])),
          h('span', { class: 'node__text' },
            h('span', { class: 'node__label' }, lesson.review ? 'Revisão' : `Aula ${pad2(lesson.order)}`),
            h('span', { class: 'node__title' }, lesson.title),
          ),
          (state === 'plus' || (hardLocked && clickable)) && h('span', { class: 'plus-chip plus-chip--sm' }, hardLocked && state !== 'plus' ? '⚡ Plus' : 'Plus'),
          hardOn && clickable && !hardLocked && state !== 'plus' && h('span', { class: 'hard-chip hard-chip--sm' }, icon('bolt')),
          state === 'soon' && h('span', { class: 'node__tag' }, 'Em breve'),
          state === 'current' && h('span', { class: 'node__tag node__tag--go' }, 'Começar'),
          h('span', { class: 'sr-only' }, `, ${STATE_LABEL[state]}`),
        ];
        return h('li', { class: 'node', dataset: { state } },
          clickable
            ? h('a', { class: 'node__link', href: `#${prefix}-${lesson.id}` }, inner)
            : h('div', { class: 'node__link', 'aria-disabled': 'true' }, inner),
        );
      }),
    ),
  );
}
