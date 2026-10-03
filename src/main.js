/**
 * Ponto de entrada do Zuno.
 * 1. Restaura a sessão (se houver).
 * 2. Sobe o roteador. Sem sessão, a primeira tela é sempre o Login.
 */
import './styles/index.css';
import { APP } from './config/app.config.js';
import { appStore } from './core/store.js';
import { createRouter } from './core/router.js';
import { AuthService } from './services/auth/AuthService.js';
import { sync } from './services/progress/sync/index.js';
import { ROUTES, DEFAULT_GUEST, DEFAULT_PRIVATE } from './routes.js';
import { AuthLayout } from './layouts/AuthLayout.js';
import { AppLayout } from './layouts/AppLayout.js';
import { FocusLayout } from './layouts/FocusLayout.js';
import { preloadZunoArt } from './zuno/zuno.states.js';
import { SettingsService, applyMotion } from './services/settings/SettingsService.js';
import { ProgressService } from './services/progress/ProgressService.js';

const root = document.getElementById('app');
let shell = null; // casca do app logado (reaproveitada entre páginas)

async function signOut() {
  await AuthService.signOut();
  appStore.set({ user: null });
  applyMotion(false);
  shell = null;
  router.go(DEFAULT_GUEST);
}

function onAuthenticated(user) {
  appStore.set({ user });
  SettingsService.apply(user.id);
  router.go(DEFAULT_PRIVATE);
}

async function render(route, params = [], token = route.path) {
  document.title = `${route.title} · ${APP.name}`;
  const { user } = appStore.get();
  const rerender = () => render(route, params, token);
  const go = (p) => router.go(p);

  if (route.layout === 'auth') {
    shell = null;
    root.replaceChildren(AuthLayout(route.page({ onAuthenticated }), { compactZuno: route.compactZuno }));
    root.dataset.layout = 'auth';
    return;
  }

  // Primeira vez: antes de qualquer tela do app, o quiz inicial.
  if (!route.onboarding && !ProgressService.load(user.id).onboarded) {
    router.go('comecar');
    return;
  }

  const ctx = { user, params, signOut, rerender, go, setTitle: (t) => { document.title = `${t} · ${APP.name}`; } };

  if (route.layout === 'focus') {
    shell = null;
    root.replaceChildren(FocusLayout(route.page(ctx)));
    root.dataset.layout = 'focus';
    window.scrollTo({ top: 0 });
    return;
  }

  if (!shell) {
    shell = AppLayout({ user, onSignOut: signOut });
    root.replaceChildren(shell);
    root.dataset.layout = 'app';
  }
  shell.mount(route.page(ctx), route.nav || route.path, { wide: route.wide });
}

const router = createRouter({
  routes: ROUTES,
  fallbackGuest: DEFAULT_GUEST,
  fallbackPrivate: DEFAULT_PRIVATE,
  isAuthenticated: () => Boolean(appStore.get().user),
  onRender: render,
});

(async function boot() {
  preloadZunoArt();
  try {
    const user = await AuthService.restore();
    if (user) {
      appStore.set({ user });
      SettingsService.apply(user.id);
      sync.flush();
    }
  } catch {
    /* sem sessão válida: segue para o login */
  }
  root.removeAttribute('aria-busy');
  router.start();
})();
