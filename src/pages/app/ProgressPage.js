/** Progresso: cinco números reais e o andamento por idioma. */
import { h } from '../../core/dom.js';
import { ProgressService, formatDuration } from '../../services/progress/ProgressService.js';
import { PageHeader, Stat } from '../../components/ui.js';
import { MyLanguages } from '../../components/LanguageList.js';

export function ProgressPage({ user }) {
  const progress = ProgressService.load(user.id);
  const t = ProgressService.totals(progress);
  const time = formatDuration(t.seconds);
  const codes = ProgressService.languagesByRecent(progress).map((l) => l.code);

  return h('div', { class: 'page' },
    PageHeader({ title: 'Progresso', subtitle: 'Seu ritmo, somando todos os idiomas.' }),
    h('div', { class: 'stats stats--grid' },
      Stat({ iconName: 'flame', value: t.streak, unit: t.streak === 1 ? 'dia' : 'dias', label: 'Sequência' }),
      Stat({ iconName: 'bolt', value: t.xp, unit: 'XP', label: 'Experiência' }),
      Stat({ iconName: 'words', value: t.words, label: 'Palavras aprendidas' }),
      Stat({ iconName: 'lessons', value: t.lessonsCompleted, label: 'Aulas concluídas' }),
      Stat({ iconName: 'clock', value: time.value, unit: time.unit, label: 'Tempo estudado' }),
    ),
    h('section', { class: 'languages' },
      h('div', { class: 'section-head' }, h('h2', { class: 'section-title' }, 'Por idioma')),
      codes.length
        ? MyLanguages({ progress, codes })
        : h('p', { class: 'muted' }, 'Conclua sua primeira aula para ver o progresso aqui.'),
    ),
  );
}
