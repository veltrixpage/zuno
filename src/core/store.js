/**
 * Store reativo simples (padrão observer).
 * Guarda o estado global da sessão: usuário, progresso, estado do Zuno.
 */
export function createStore(initial) {
  let state = { ...initial };
  const listeners = new Set();

  return {
    get: () => state,
    set(patch) {
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

export const appStore = createStore({
  user: null,          // { id, name, email, plan }
  progress: null,      // ver services/progress
  zuno: { state: 'neutral', personality: 'default' },
});
