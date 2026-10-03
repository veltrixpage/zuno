/**
 * Acesso seguro ao armazenamento do navegador.
 * Em janelas privadas ou com dados bloqueados o acesso pode falhar;
 * nesse caso tudo continua funcionando em memória.
 */
const memory = { local: new Map(), session: new Map() };

function area(kind) {
  try {
    const s = kind === 'session' ? window.sessionStorage : window.localStorage;
    const probe = '__zuno_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

function make(kind) {
  const prefix = 'zuno:';
  return {
    get(key, fallback = null) {
      try {
        const s = area(kind);
        const raw = s ? s.getItem(prefix + key) : memory[kind].get(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      const raw = JSON.stringify(value);
      try {
        const s = area(kind);
        if (s) s.setItem(prefix + key, raw);
        else memory[kind].set(key, raw);
      } catch {
        memory[kind].set(key, raw);
      }
    },
    remove(key) {
      try { area(kind)?.removeItem(prefix + key); } catch { /* ignora */ }
      memory[kind].delete(key);
    },
  };
}

export const local = make('local');
export const session = make('session');
