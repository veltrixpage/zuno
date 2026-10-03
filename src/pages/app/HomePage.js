/**
 * Home: "Seu mundo está ficando maior."
 * Continue aprendendo (idioma atual, próxima aula, progresso, sequência, XP),
 * Seus idiomas e Adicionar idioma. Tudo vem do progresso real.
 *
 * Sono do Zuno: sem estudar há dias, ele fica sonolento; depois, dorme.
 * Quando você volta, ele acorda aos poucos e reconhece a ausência.
 */
import { h } from '../../core/dom.js';
import { APP } from '../../config/app.config.js';
import { getLanguage } from '../../domain/languages.js';
import { languageSummary, pad2 } from '../../domain/course.js';
import { ProgressService } from '../../services/progress/ProgressService.js';
import { SettingsService, prefersReducedMotion } from '../../services/settings/SettingsService.js';
import { Button, ProgressBar } from '../../components/ui.js';
import { MyLanguages } from '../../components/LanguageList.js';
import { Flag } from '../../components/flags.js';
import { ZunoCharacter } from '../../zuno/ZunoCharacter.js';
import { myEvolution } from '../../zuno/myZuno.js';
import { absenceLine, absenceBucket } from '../../zuno/lines/absence.js';
import { icon } from '../../components/icons.js';
import { LEVEL_INFO } from '../../content/curriculum/levels.js';

const firstName = (name = '') => name.trim().split(/\s+/)[0] || '';
const today = () => new Date().toISOString().slice(0, 10);

export function HomePage({ user }) {
  const progress = ProgressService.load(user.id);
  const mine = ProgressService.languagesByRecent(progress).map((l) => l.code);
  const lastCode = progress.lastLanguage && progress.languages[progress.lastLanguage] ? progress.lastLanguage : mine[0];

  const header = h('header', { class: 'home__header' },
    h('p', { class: 'eyebrow' }, `Olá, ${firstName(user.name)}`),
    h('h1', { class: 'home__title' }, APP.tagline),
  );

  const zunoBox = h('div', { class: 'focus__zuno' });
  wakeSequence(user, progress, zunoBox);

  const continueBlock = lastCode ? ContinueCard(lastCode, progress, zunoBox) : StartCard(zunoBox);

  const languages = h('section', { class: 'languages', 'aria-labelledby': 'languages-title' },
    h('div', { class: 'section-head' },
      h('h2', { class: 'section-title', id: 'languages-title' }, 'Seus idiomas'),
      h('a', { class: 'btn btn--ghost', href: '#aprender' }, icon('plus'), h('span', { class: 'btn__label' }, 'Adicionar idioma')),
    ),
    mine.length
      ? MyLanguages({ progress, codes: mine })
      : h('p', { class: 'muted' }, 'Os idiomas que você começar aparecem aqui.'),
  );

  return h('div', { class: 'page home' }, header, continueBlock, languages);
}

/** Dorme → acorda aos poucos → reage à volta. Uma vez por dia de retorno. */
function wakeSequence(user, progress, box) {
  const days = ProgressService.daysAway(progress);
  const bucket = absenceBucket(days);
  const personality = SettingsService.personalityFor(user);
  const evolution = myEvolution(user);
  const note = h('p', { class: 'focus__mood', 'aria-live': 'polite' });

  if (!bucket) {
    const streak = progress.streak.current;
    const zuno = ZunoCharacter({ size: 'lg', state: streak > 1 ? 'proud' : 'neutral', decorative: true, evolution });
    if (streak > 1) note.textContent = `${streak} dias seguidos.`;
    box.replaceChildren(zuno, note);
    return;
  }

  const startState = bucket === 'short' ? 'sleepy' : 'sleeping';
  const zuno = ZunoCharacter({ size: 'lg', state: startState, decorative: true, evolution });
  note.textContent = bucket === 'short' ? 'Zzz… (o Zuno está com sono)' : 'Zzz…';
  box.replaceChildren(zuno, note);

  const alreadyWoke = progress.zuno?.wokeAt === today();
  const line = absenceLine(personality, days);
  if (alreadyWoke || prefersReducedMotion()) {
    zuno.setState('happy');
    note.textContent = line;
    return;
  }
  // Acorda aos poucos
  setTimeout(() => { if (!box.isConnected) return; zuno.setState('sleepy'); note.textContent = '…hm?'; }, 1400);
  setTimeout(() => { if (!box.isConnected) return; zuno.setState('surprised'); zuno.play('pop'); note.textContent = '!'; }, 2600);
  setTimeout(() => {
    if (!box.isConnected) return;
    zuno.setState('happy');
    zuno.play('celebrate');
    note.textContent = line;
    ProgressService.markWoke(user.id);
  }, 3600);
}

function ContinueCard(code, progress, zunoBox) {
  const lang = getLanguage(code);
  const s = languageSummary(code, progress);
  const next = s.next;
  const totals = ProgressService.totals(progress);

  const info = h('div', { class: 'focus__info' },
    h('div', { class: 'focus__lang' },
      Flag({ country: lang.flag, size: 'md' }),
      h('span', { class: 'focus__lang-name', lang: lang.tag }, lang.native),
      h('span', { class: 'level-chip' }, s.cefr),
      h('span', { class: 'focus__level-title' }, LEVEL_INFO[s.cefr]?.title),
    ),
    next
      ? h('div', { class: 'focus__where' },
          h('p', { class: 'eyebrow eyebrow--muted' }, `Unidade ${pad2(next.unit.order)} · ${next.unit.title}`),
          h('h3', { class: 'focus__name' }, next.lesson.review ? next.lesson.title : `Próxima aula: ${next.lesson.title}`),
        )
      : h('div', { class: 'focus__where' },
          h('h3', { class: 'focus__name' }, `Você concluiu o curso de ${lang.name.toLowerCase()} até aqui!`),
        ),
    h('div', { class: 'focus__progress' },
      ProgressBar({ value: s.percent, label: `Progresso em ${lang.name}` }),
      h('p', { class: 'focus__pct' }, h('strong', {}, `${s.percent}%`), ` do ${s.cefr} concluído`),
    ),
    h('ul', { class: 'mini-stats', role: 'list' },
      h('li', {}, icon('flame'), h('strong', {}, String(totals.streak)), totals.streak === 1 ? ' dia seguido' : ' dias seguidos'),
      h('li', {}, icon('bolt'), h('strong', {}, String(totals.xp)), ' XP'),
    ),
    Button({ label: 'Continuar', href: next ? `#aula-${next.lesson.id}` : `#idioma-${code}`, iconAfter: 'arrowRight', size: 'lg' }),
  );

  return h('section', { class: 'continue', 'aria-labelledby': 'continue-title' },
    h('h2', { class: 'section-title', id: 'continue-title' }, 'Continue aprendendo'),
    h('div', { class: 'focus' }, info, zunoBox),
  );
}

function StartCard(zunoBox) {
  return h('section', { class: 'continue', 'aria-labelledby': 'continue-title' },
    h('h2', { class: 'section-title', id: 'continue-title' }, 'Continue aprendendo'),
    h('div', { class: 'focus' },
      h('div', { class: 'focus__info' },
        h('p', { class: 'eyebrow' }, 'Primeiro passo'),
        h('h3', { class: 'focus__name' }, 'Escolha um idioma para começar'),
        h('p', { class: 'focus__next' }, 'São 9 idiomas. Você pode experimentar todos.'),
        Button({ label: 'Ver idiomas', href: '#aprender', iconAfter: 'arrowRight', size: 'lg' }),
      ),
      zunoBox,
    ),
  );
}
