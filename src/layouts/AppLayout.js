/**
 * Casca do aplicativo logado.
 * - Desktop (≥ 1100px): menu lateral com ícone + texto.
 * - Tablet (768–1099px): menu lateral compacto (só ícones, com rótulo acessível).
 * - Celular (< 768px): barra inferior fixa + topo leve.
 * A casca é criada uma vez; só o conteúdo troca entre páginas.
 */
import { h } from '../core/dom.js';
import { icon } from '../components/icons.js';
import { Wordmark } from '../components/ui.js';
import { ZunoCharacter } from '../zuno/ZunoCharacter.js';
import { NAV_ITEMS } from '../config/navigation.js';

export function AppLayout({ user, onSignOut }) {
  const link = (item, variant) =>
    h(
      'a',
      { class: `nav__link nav__link--${variant}`, href: `#${item.path}`, dataset: { path: item.path }, title: item.label },
      icon(item.icon),
      h('span', { class: 'nav__label' }, variant === 'bar' ? item.shortLabel || item.label : item.label),
    );

  const sidebar = h(
    'nav',
    { class: 'sidebar', 'aria-label': 'Navegação principal' },
    h('a', { class: 'sidebar__brand', href: '#inicio', 'aria-label': 'Zuno, início' },
      ZunoCharacter({ size: 'xs', decorative: true, className: 'sidebar__zuno' }),
      Wordmark({ size: 'sm' }),
    ),
    h('div', { class: 'sidebar__links' }, NAV_ITEMS.map((i) => link(i, 'side'))),
    h('button', { class: 'nav__link nav__link--side sidebar__logout', type: 'button', onClick: onSignOut, title: 'Sair' },
      icon('logout'), h('span', { class: 'nav__label' }, 'Sair')),
  );

  const topbar = h(
    'header',
    { class: 'topbar' },
    h('a', { class: 'topbar__brand', href: '#inicio', 'aria-label': 'Zuno, início' }, Wordmark({ size: 'sm' })),
    h('a', { class: 'topbar__avatar', href: '#perfil', 'aria-label': 'Perfil' }, (user.name || '?').trim().charAt(0).toUpperCase()),
  );

  const bottombar = h('nav', { class: 'bottombar', 'aria-label': 'Navegação principal' }, NAV_ITEMS.map((i) => link(i, 'bar')));

  const content = h('main', { class: 'app__content', id: 'main', tabindex: '-1' });

  const root = h('div', { class: 'app' }, sidebar, h('div', { class: 'app__main' }, topbar, content), bottombar);

  root.mount = (pageNode, path, { wide = false } = {}) => {
    content.classList.toggle('app__content--wide', wide);
    content.replaceChildren(pageNode);
    root.querySelectorAll('.nav__link[data-path]').forEach((a) => {
      const active = a.dataset.path === path;
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0 });
  };

  return root;
}
