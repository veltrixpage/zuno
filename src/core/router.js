/**
 * Roteador por hash (#inicio, #idioma-en, #aula-en-a1-u1-l1...).
 * Funciona em qualquer hospedagem estática, sem configuração de servidor.
 * Os endereços usam só letras, números e hífen, então podem ser compartilhados.
 *
 * Cada rota declara:
 *  - path:    token fixo ('inicio') ou prefixo de rota com parâmetro ('idioma')
 *  - pattern: RegExp opcional para rotas com parâmetro (ex.: /^idioma-([a-z]{2})$/)
 *  - layout:  'auth' | 'app' | 'focus'
 *  - access:  'guest' (só deslogado) | 'private' (só logado)
 *  - page:    (ctx) => Node
 */
export function createRouter({ routes, fallbackGuest, fallbackPrivate, isAuthenticated, onRender }) {
  const byPath = new Map(routes.filter((r) => !r.pattern).map((r) => [r.path, r]));
  const patterned = routes.filter((r) => r.pattern);

  const current = () => decodeURIComponent((location.hash || '').replace(/^#\/?/, '').split('?')[0]);

  function match(token) {
    if (byPath.has(token)) return { route: byPath.get(token), params: [] };
    for (const r of patterned) {
      const m = token.match(r.pattern);
      if (m) return { route: r, params: m.slice(1) };
    }
    return null;
  }

  async function resolve() {
    const authed = isAuthenticated();
    const token = current();
    let found = match(token);

    if (!found) found = { route: byPath.get(authed ? fallbackPrivate : fallbackGuest), params: [] };
    if (found.route.access === 'private' && !authed) found = { route: byPath.get(fallbackGuest), params: [] };
    if (found.route.access === 'guest' && authed) found = { route: byPath.get(fallbackPrivate), params: [] };

    const finalToken = found.route.pattern ? token : found.route.path;
    if (token !== finalToken) history.replaceState(null, '', `#${finalToken}`);
    await onRender(found.route, found.params, finalToken);
  }

  function go(path) {
    if (current() === path) resolve();
    else location.hash = path;
  }

  window.addEventListener('hashchange', resolve);

  return { start: resolve, go, refresh: resolve, current };
}
