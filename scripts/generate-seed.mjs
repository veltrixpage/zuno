/**
 * Gera supabase/seed.sql a partir do conteúdo do app (src/content).
 * Assim o banco e o app usam exatamente os mesmos IDs.
 *   npm run seed
 */
import { writeFile } from 'node:fs/promises';
import { LANGUAGES } from '../src/domain/languages.js';
import { en, es, it, fr, de, pt } from '../src/content/courses/latin.js';
import { ja, ko, zh } from '../src/content/courses/asian.js';

const COURSES = { en, es, it, fr, de, ja, ko, zh, pt };
const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const arr = (a) => `array[${a.map(q).join(',')}]::text[]`;

const out = ['-- Gerado por scripts/generate-seed.mjs. Não edite à mão.', 'begin;'];

LANGUAGES.forEach((l, i) => out.push(
  `insert into public.languages (code,name_pt,name_native,flag,sort) values (${q(l.code)},${q(l.name)},${q(l.native)},${q(l.flag)},${i + 1}) on conflict (code) do update set name_pt=excluded.name_pt,name_native=excluded.name_native,flag=excluded.flag,sort=excluded.sort;`,
));

for (const course of Object.values(COURSES)) {
  for (const lv of course.levels) {
    out.push(`insert into public.levels (id,language_code,cefr,sort,is_active) values (${q(lv.id)},${q(course.language)},${q(lv.cefr)},${lv.order},${lv.active}) on conflict (id) do update set is_active=excluded.is_active;`);
    for (const u of lv.units) {
      out.push(`insert into public.units (id,level_id,sort,title,skills,grammar) values (${q(u.id)},${q(lv.id)},${u.order},${q(u.title)},${arr(u.skills || [])},${q(u.grammar)}) on conflict (id) do update set title=excluded.title,sort=excluded.sort,skills=excluded.skills,grammar=excluded.grammar;`);
      for (const l of u.lessons) {
        out.push(`insert into public.lessons (id,unit_id,sort,title,tier,xp,words,is_review) values (${q(l.id)},${q(u.id)},${l.order},${q(l.title)},${q(l.tier)},${l.xp},${arr(l.words)},${Boolean(l.review)}) on conflict (id) do update set title=excluded.title,tier=excluded.tier,xp=excluded.xp,words=excluded.words,is_review=excluded.is_review;`);
        for (const e of l.exercises) {
          const data = {};
          for (const k of ['title', 'text', 'skills', 'target', 'tokens', 'distractors', 'join', 'pairs', 'accept', 'passage', 'say', 'sample', 'keywords', 'target', 'sentence', 'statement', 'typedTranslation']) {
            if (e[k] !== undefined && e[k] !== null) data[k] = e[k];
          }
          out.push(`insert into public.exercises (id,lesson_id,sort,type,kind,instruction,prompt,reading,explanation,translation,data) values (${q(e.id)},${q(l.id)},${e.order},${q(e.type)},${q(e.kind)},${q(e.instruction)},${q(e.prompt)},${q(e.reading)},${q(e.explanation)},${q(e.translation)},${q(JSON.stringify(data))}::jsonb) on conflict (id) do update set prompt=excluded.prompt,reading=excluded.reading,explanation=excluded.explanation,translation=excluded.translation,data=excluded.data,type=excluded.type,kind=excluded.kind;`);
          (e.options || []).forEach((o, oi) => out.push(
            `insert into public.exercise_options (id,exercise_id,sort,label,is_correct) values (${q(o.id)},${q(e.id)},${oi + 1},${q(o.label)},${o.correct}) on conflict (id) do update set label=excluded.label,is_correct=excluded.is_correct;`,
          ));
        }
      }
    }
  }
}
out.push('commit;');
await writeFile('supabase/seed.sql', `${out.join('\n')}\n`);
console.log(`seed ok · ${out.length - 3} comandos`);
