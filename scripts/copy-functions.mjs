/**
 * Copia o módulo de prompts do app para a função do servidor,
 * para que app e servidor usem exatamente as mesmas regras do Zuno.
 *   npm run functions
 */
import { copyFile, mkdir } from 'node:fs/promises';
await mkdir('supabase/functions/_shared', { recursive: true });
await copyFile('src/services/ai/prompts.js', 'supabase/functions/_shared/prompts.js');
console.log('prompts copiados para supabase/functions/_shared/prompts.js');
