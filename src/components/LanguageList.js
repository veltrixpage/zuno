/**
 * Listas de idiomas.
 * - LanguageCatalog: todos os idiomas disponíveis (página Aprender).
 * - MyLanguages: idiomas que o usuário acompanha (Home e Progresso).
 */
import { h } from '../core/dom.js';
import { LANGUAGES, getLanguage } from '../domain/languages.js';
import { languageSummary } from '../domain/course.js';
import { Flag } from './flags.js';
import { ProgressBar } from './ui.js';
import { icon } from './icons.js';

export function LanguageCatalog({ progress }) {
  return h('ul', { class: 'catalog', role: 'list' },
    LANGUAGES.map((lang) => {
      const started = Boolean(progress.languages[lang.code]);
      const s = started ? languageSummary(lang.code, progress) : null;
      return h('li', {},
        h('a', { class: `catalog__item${started ? ' is-started' : ''}`, href: `#idioma-${lang.code}` },
          Flag({ country: lang.flag }),
          h('span', { class: 'catalog__names' },
            h('span', { class: 'catalog__native', lang: lang.tag }, lang.native),
            h('span', { class: 'catalog__pt' }, lang.name),
          ),
          h('span', { class: 'catalog__meta' },
            h('span', { class: 'level-chip' }, s ? s.cefr : 'A1'),
            h('span', { class: 'catalog__status' }, s ? `${s.percent}% concluído` : 'Começar'),
          ),
          h('span', { class: 'catalog__chev' }, icon('chevronRight')),
        ),
      );
    }),
  );
}

export function MyLanguages({ progress, codes }) {
  return h('ul', { class: 'my-langs', role: 'list' },
    codes.map((code) => {
      const lang = getLanguage(code);
      const s = languageSummary(code, progress);
      return h('li', {},
        h('a', { class: 'my-langs__item', href: `#idioma-${code}` },
          Flag({ country: lang.flag }),
          h('span', { class: 'my-langs__text' },
            h('span', { class: 'my-langs__name', lang: lang.tag }, lang.native),
            h('span', { class: 'my-langs__meta' }, `${s.cefr} · ${s.percent}%`),
          ),
          h('span', { class: 'my-langs__bar' }, ProgressBar({ value: s.percent, label: `Progresso em ${lang.name}` })),
        ),
      );
    }),
  );
}
