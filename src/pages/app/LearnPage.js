/**
 * Aprender: todos os idiomas disponíveis. Todos podem ser experimentados
 * no plano Free; o bloqueio acontece dentro do curso.
 */
import { h } from '../../core/dom.js';
import { ProgressService } from '../../services/progress/ProgressService.js';
import { PageHeader } from '../../components/ui.js';
import { LanguageCatalog } from '../../components/LanguageList.js';

export function LearnPage({ user }) {
  const progress = ProgressService.load(user.id);
  return h('div', { class: 'page' },
    PageHeader({ title: 'Aprender', subtitle: 'Escolha um idioma. Você pode estudar vários ao mesmo tempo.' }),
    LanguageCatalog({ progress }),
  );
}
