/** Evolução equipada do usuário, pronta para passar ao <ZunoCharacter>. */
import { ProgressService } from '../services/progress/ProgressService.js';
import { getLanguage } from '../domain/languages.js';

export function myEvolution(user) {
  const p = ProgressService.load(user.id);
  const code = p.lastLanguage;
  return { equipped: p.evolution?.equipped || [], flag: code ? getLanguage(code)?.flag : null };
}
