-- =====================================================================
-- ZUNO · Esquema do banco (Supabase / PostgreSQL)
-- Como aplicar: Supabase → SQL Editor → cole este arquivo → Run.
-- Depois rode supabase/seed.sql (gerado por: npm run seed).
-- =====================================================================

-- ---------- CONTEÚDO (leitura pública) ----------

create table if not exists public.languages (
  code        text primary key,                 -- 'en', 'ja', ...
  name_pt     text not null,                    -- 'Inglês'
  name_native text not null,                    -- 'English'
  flag        text not null,                    -- 'us'
  sort        int  not null default 0,
  is_active   boolean not null default true
);

create table if not exists public.levels (
  id            text primary key,               -- 'en-a1'
  language_code text not null references public.languages(code) on delete cascade,
  cefr          text not null check (cefr in ('A1','A2','B1','B2','C1','C2')),
  sort          int  not null,
  is_active     boolean not null default true,  -- C2 nasce false
  unique (language_code, cefr)
);

create table if not exists public.units (
  id       text primary key,                    -- 'en-a1-u1'
  level_id text not null references public.levels(id) on delete cascade,
  sort     int  not null,
  title    text not null,
  unique (level_id, sort)
);

create table if not exists public.lessons (
  id      text primary key,                     -- 'en-a1-u1-l1'
  unit_id text not null references public.units(id) on delete cascade,
  sort    int  not null,
  title   text not null,
  tier    text not null default 'plus' check (tier in ('free','plus')),
  xp      int  not null default 10,
  words   text[] not null default '{}',         -- vocabulário ensinado na aula
  unique (unit_id, sort)
);

create table if not exists public.exercises (
  id          text primary key,                 -- 'en-a1-u1-l1-e1'
  lesson_id   text not null references public.lessons(id) on delete cascade,
  sort        int  not null,
  type        text not null default 'choice',   -- choice | translate | listen | speak | match | write
  kind        text,                             -- complete | meaning | translate
  instruction text not null,
  prompt      text not null,
  reading     text,                             -- romaji / pinyin / romanização
  explanation text,
  unique (lesson_id, sort)
);

create table if not exists public.exercise_options (
  id          text primary key,                 -- 'en-a1-u1-l1-e1-o1'
  exercise_id text not null references public.exercises(id) on delete cascade,
  sort        int  not null,
  label       text not null,
  is_correct  boolean not null default false
);

-- ---------- USUÁRIO ----------

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  plan        text not null default 'free' check (plan in ('free','plus')),
  personality text not null default 'light' check (personality in ('light','provocador','ofensivo')),
  created_at  timestamptz not null default now()
);

-- Idiomas que o usuário acompanha
create table if not exists public.user_languages (
  user_id          uuid not null default auth.uid() references auth.users(id) on delete cascade,
  language_code    text not null references public.languages(code),
  current_level    text not null default 'A1',
  started_at       timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  primary key (user_id, language_code)
);

-- Totais por usuário e idioma
create table if not exists public.user_progress (
  user_id          uuid not null references auth.users(id) on delete cascade,
  language_code    text not null references public.languages(code),
  xp               int  not null default 0,
  seconds_studied  int  not null default 0,
  words_learned    text[] not null default '{}',
  last_lesson_id   text references public.lessons(id),
  last_activity_at timestamptz not null default now(),
  primary key (user_id, language_code)
);

-- Uma linha por aula por usuário
create table if not exists public.lesson_progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    text not null references public.lessons(id) on delete cascade,
  status       text not null default 'completed' check (status in ('started','completed')),
  correct      int  not null default 0,
  total        int  not null default 0,
  xp_earned    int  not null default 0,
  seconds      int  not null default 0,
  attempts     int  not null default 0,
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.streaks (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  current        int  not null default 0,
  longest        int  not null default 0,
  last_study_day date
);

create index if not exists idx_levels_lang     on public.levels(language_code);
create index if not exists idx_units_level     on public.units(level_id);
create index if not exists idx_lessons_unit    on public.lessons(unit_id);
create index if not exists idx_exercises_lesson on public.exercises(lesson_id);
create index if not exists idx_options_ex      on public.exercise_options(exercise_id);

-- ---------- SEGURANÇA (RLS) ----------
-- Conteúdo: qualquer pessoa logada lê. Dados do usuário: só o dono.

alter table public.languages        enable row level security;
alter table public.levels           enable row level security;
alter table public.units            enable row level security;
alter table public.lessons          enable row level security;
alter table public.exercises        enable row level security;
alter table public.exercise_options enable row level security;
alter table public.profiles         enable row level security;
alter table public.user_languages   enable row level security;
alter table public.user_progress    enable row level security;
alter table public.lesson_progress  enable row level security;
alter table public.streaks          enable row level security;

do $$
declare t text;
begin
  foreach t in array array['languages','levels','units','lessons','exercises','exercise_options'] loop
    execute format('drop policy if exists "read content" on public.%I', t);
    execute format('create policy "read content" on public.%I for select to authenticated using (true)', t);
  end loop;
end $$;

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select using (id = auth.uid());
-- (o plano só muda pelo servidor/assinatura; o usuário não pode se dar Plus)

drop policy if exists "own languages" on public.user_languages;
create policy "own languages" on public.user_languages for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own progress read" on public.user_progress;
create policy "own progress read" on public.user_progress for select using (user_id = auth.uid());
drop policy if exists "own lessons read" on public.lesson_progress;
create policy "own lessons read" on public.lesson_progress for select using (user_id = auth.uid());
drop policy if exists "own streak read" on public.streaks;
create policy "own streak read" on public.streaks for select using (user_id = auth.uid());
-- Escrita de progresso só pela função complete_lesson (abaixo).

-- Perfil criado automaticamente no cadastro
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name) values (new.id, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- CONCLUSÃO DE AULA (regra no servidor) ----------
-- Valida Free × Plus, calcula XP, soma tempo e palavras e atualiza a sequência.
create or replace function public.complete_lesson(
  p_lesson_id text, p_correct int, p_total int, p_seconds int, p_words text[] default '{}'
) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_user   uuid := auth.uid();
  v_lesson public.lessons%rowtype;
  v_lang   text;
  v_plan   text;
  v_first  boolean;
  v_xp     int;
  v_secs   int := least(greatest(coalesce(p_seconds, 0), 0), 1800);
  v_today  date := (now() at time zone 'America/Sao_Paulo')::date;
  v_streak public.streaks%rowtype;
begin
  if v_user is null then raise exception 'not authenticated'; end if;

  select * into v_lesson from public.lessons where id = p_lesson_id;
  if not found then raise exception 'lesson not found'; end if;

  select coalesce(plan, 'free') into v_plan from public.profiles where id = v_user;
  if v_lesson.tier = 'plus' and coalesce(v_plan, 'free') <> 'plus' then
    raise exception 'plus required';
  end if;

  select l.language_code into v_lang
  from public.units u join public.levels l on l.id = u.level_id
  where u.id = v_lesson.unit_id;

  v_first := not exists (select 1 from public.lesson_progress where user_id = v_user and lesson_id = p_lesson_id and status = 'completed');
  v_xp := greatest(p_correct, 0) * 2 + case when v_first then v_lesson.xp else 0 end;

  insert into public.lesson_progress as lp (user_id, lesson_id, status, correct, total, xp_earned, seconds, attempts, completed_at, updated_at)
  values (v_user, p_lesson_id, 'completed', p_correct, p_total, v_xp, v_secs, 1, now(), now())
  on conflict (user_id, lesson_id) do update set
    status = 'completed', correct = excluded.correct, total = excluded.total,
    xp_earned = lp.xp_earned + v_xp, seconds = lp.seconds + v_secs,
    attempts = lp.attempts + 1, completed_at = coalesce(lp.completed_at, now()), updated_at = now();

  insert into public.user_languages (user_id, language_code) values (v_user, v_lang)
  on conflict (user_id, language_code) do update set last_activity_at = now();

  insert into public.user_progress as up (user_id, language_code, xp, seconds_studied, words_learned, last_lesson_id, last_activity_at)
  values (v_user, v_lang, v_xp, v_secs, coalesce(p_words, '{}'), p_lesson_id, now())
  on conflict (user_id, language_code) do update set
    xp = up.xp + v_xp,
    seconds_studied = up.seconds_studied + v_secs,
    words_learned = (select array(select distinct unnest(up.words_learned || coalesce(p_words, '{}')))),
    last_lesson_id = p_lesson_id,
    last_activity_at = now();

  select * into v_streak from public.streaks where user_id = v_user;
  if not found then
    insert into public.streaks (user_id, current, longest, last_study_day) values (v_user, 1, 1, v_today);
  elsif v_streak.last_study_day is distinct from v_today then
    update public.streaks set
      current = case when v_streak.last_study_day = v_today - 1 then v_streak.current + 1 else 1 end,
      longest = greatest(v_streak.longest, case when v_streak.last_study_day = v_today - 1 then v_streak.current + 1 else 1 end),
      last_study_day = v_today
    where user_id = v_user;
  end if;

  return json_build_object('xp_earned', v_xp, 'first_time', v_first);
end $$;

grant execute on function public.complete_lesson(text, int, int, int, text[]) to authenticated;

-- =====================================================================
-- PROMPT 3 · Personalidade, preferências, respostas, erros e estado do Zuno
-- (seguro rodar de novo: usa "if not exists")
-- =====================================================================

alter table public.profiles add column if not exists reduce_motion    boolean not null default false;
alter table public.profiles add column if not exists show_translation boolean not null default true;
alter table public.profiles add column if not exists sound            boolean not null default true;
alter table public.profiles add column if not exists hard_mode        boolean not null default false;
alter table public.profiles add column if not exists zuno_state       text not null default 'neutral';
alter table public.profiles add column if not exists zuno_state_at    timestamptz;

-- Dados próprios de cada tipo de atividade (ordenar, associar, escrever, ouvir...)
alter table public.exercises add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.exercises add column if not exists translation text;

alter table public.lesson_progress add column if not exists wrong          int not null default 0;
alter table public.lesson_progress add column if not exists hard_completed boolean not null default false;

-- Cada resposta dada (histórico para revisão e para a IA no futuro)
create table if not exists public.lesson_answers (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  exercise_id text not null references public.exercises(id) on delete cascade,
  given       text,
  correct     boolean not null,
  hard        boolean not null default false,
  answered_at timestamptz not null default now()
);
create index if not exists idx_answers_user on public.lesson_answers(user_id, answered_at desc);

-- Erros guardados para "Vamos revisar isso?"
create table if not exists public.user_mistakes (
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  exercise_id text not null references public.exercises(id) on delete cascade,
  count       int  not null default 1,
  last_given  text,
  last_at     timestamptz not null default now(),
  resolved    boolean not null default false,
  resolved_at timestamptz,
  primary key (user_id, exercise_id)
);

alter table public.lesson_answers enable row level security;
alter table public.user_mistakes  enable row level security;
drop policy if exists "own answers" on public.lesson_answers;
create policy "own answers" on public.lesson_answers for select using (user_id = auth.uid());
drop policy if exists "own mistakes" on public.user_mistakes;
create policy "own mistakes" on public.user_mistakes for select using (user_id = auth.uid());

-- Preferências: uma personalidade por vez; Ofensivo só com Plus (validado aqui).
create or replace function public.set_preferences(
  p_personality text, p_reduce_motion boolean, p_show_translation boolean, p_sound boolean, p_hard_mode boolean
) returns void
language plpgsql security definer set search_path = public as $$
declare v_plan text;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select plan into v_plan from public.profiles where id = auth.uid();
  if p_personality = 'ofensivo' and coalesce(v_plan, 'free') <> 'plus' then raise exception 'plus required'; end if;
  update public.profiles set
    personality = coalesce(p_personality, personality),
    reduce_motion = coalesce(p_reduce_motion, reduce_motion),
    show_translation = coalesce(p_show_translation, show_translation),
    sound = coalesce(p_sound, sound),
    hard_mode = coalesce(p_hard_mode, hard_mode)
  where id = auth.uid();
end $$;
grant execute on function public.set_preferences(text, boolean, boolean, boolean, boolean) to authenticated;

-- Registra respostas e erros de uma aula ou revisão
-- Na aula, erros são guardados; na revisão (p_review), acertos resolvem os erros.
create or replace function public.record_answers(p_answers jsonb, p_hard boolean default false, p_review boolean default false, p_zuno_state text default null)
returns void
language plpgsql security definer set search_path = public as $$
declare a jsonb;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  for a in select * from jsonb_array_elements(coalesce(p_answers, '[]'::jsonb)) loop
    insert into public.lesson_answers (user_id, exercise_id, given, correct, hard)
    values (auth.uid(), a->>'exerciseId', a->>'given', (a->>'correct')::boolean, p_hard);
    if (a->>'correct')::boolean then
      if p_review then
        update public.user_mistakes set resolved = true, resolved_at = now()
        where user_id = auth.uid() and exercise_id = a->>'exerciseId' and resolved = false;
      end if;
    else
      insert into public.user_mistakes as m (user_id, exercise_id, count, last_given, last_at, resolved)
      values (auth.uid(), a->>'exerciseId', 1, a->>'given', now(), false)
      on conflict (user_id, exercise_id) do update set count = m.count + 1, last_given = excluded.last_given, last_at = now(), resolved = false;
    end if;
  end loop;
  if p_zuno_state is not null then
    update public.profiles set zuno_state = p_zuno_state, zuno_state_at = now() where id = auth.uid();
  end if;
end $$;
grant execute on function public.record_answers(jsonb, boolean, boolean, text) to authenticated;

-- =====================================================================
-- PROMPT 4 · IA: limites configuráveis, uso, sessões de conversa
-- =====================================================================

-- Limites por plano e recurso. Mude aqui (não no app) para ajustar custos.
create table if not exists public.ai_limits (
  plan           text not null check (plan in ('free','plus')),
  feature        text not null check (feature in ('chat','world','correct','sessions','tts','pronunciation')),
  max_per_period int  not null,
  period         text not null default 'day' check (period in ('day','week','month')),
  primary key (plan, feature)
);
insert into public.ai_limits (plan, feature, max_per_period, period) values
  ('free','chat',15,'day'), ('free','world',15,'day'), ('free','correct',5,'day'), ('free','sessions',3,'day'),
  ('plus','chat',300,'day'), ('plus','world',300,'day'), ('plus','correct',100,'day'), ('plus','sessions',40,'day')
on conflict (plan, feature) do nothing;

create table if not exists public.ai_usage (
  user_id      uuid not null references auth.users(id) on delete cascade,
  feature      text not null,
  period_start date not null,
  used         int  not null default 0,
  primary key (user_id, feature, period_start)
);

alter table public.ai_limits enable row level security;
alter table public.ai_usage  enable row level security;
drop policy if exists "read limits" on public.ai_limits;
create policy "read limits" on public.ai_limits for select to authenticated using (true);
drop policy if exists "own usage" on public.ai_usage;
create policy "own usage" on public.ai_usage for select using (user_id = auth.uid());

-- Consome 1 uso se ainda houver saldo no período. Chamada SÓ pela função do servidor.
create or replace function public.ai_consume(p_feature text) returns json
language plpgsql security definer set search_path = public as $$
declare
  v_plan text; v_max int; v_period text; v_start date; v_used int;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select coalesce(plan, 'free') into v_plan from public.profiles where id = auth.uid();
  select max_per_period, period into v_max, v_period from public.ai_limits where plan = coalesce(v_plan, 'free') and feature = p_feature;
  if v_max is null then return json_build_object('allowed', false, 'used', 0, 'limit', 0); end if;
  v_start := case v_period when 'week' then date_trunc('week', now())::date when 'month' then date_trunc('month', now())::date else current_date end;

  insert into public.ai_usage (user_id, feature, period_start, used) values (auth.uid(), p_feature, v_start, 0)
  on conflict (user_id, feature, period_start) do nothing;
  select used into v_used from public.ai_usage where user_id = auth.uid() and feature = p_feature and period_start = v_start for update;
  if v_used >= v_max then return json_build_object('allowed', false, 'used', v_used, 'limit', v_max); end if;
  update public.ai_usage set used = used + 1 where user_id = auth.uid() and feature = p_feature and period_start = v_start;
  return json_build_object('allowed', true, 'used', v_used + 1, 'limit', v_max);
end $$;
revoke all on function public.ai_consume(text) from public, anon;
grant execute on function public.ai_consume(text) to authenticated;

create or replace function public.ai_usage_today() returns json
language sql security definer set search_path = public as $$
  select coalesce(json_object_agg(feature, used), '{}'::json) from public.ai_usage where user_id = auth.uid() and period_start = current_date;
$$;
grant execute on function public.ai_usage_today() to authenticated;

-- Conversas (Conversar com Zuno e Modo Mundo) e suas falas
create table if not exists public.chat_sessions (
  id            text primary key,
  user_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind          text not null check (kind in ('chat','world')),
  language_code text not null references public.languages(code),
  level         text not null,
  topic         text,
  situation     text,
  summary       text,
  words         text[] not null default '{}',
  difficulty    int not null default 0,
  goal_done     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create table if not exists public.chat_messages (
  id          bigint generated always as identity primary key,
  session_id  text not null references public.chat_sessions(id) on delete cascade,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  role        text not null check (role in ('user','zuno')),
  text        text not null,
  translation text,
  correction  jsonb,
  teach       jsonb,
  emotion     text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_chat_sessions_user on public.chat_sessions(user_id, updated_at desc);
create index if not exists idx_chat_messages_session on public.chat_messages(session_id, id);

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
drop policy if exists "own sessions" on public.chat_sessions;
create policy "own sessions" on public.chat_sessions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "own messages" on public.chat_messages;
create policy "own messages" on public.chat_messages for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table public.profiles add column if not exists goal text;

-- =====================================================================
-- PROMPT 5 · Teste de nível, evolução do Zuno, voz, níveis A1–C2
-- =====================================================================
alter table public.user_languages add column if not exists placement jsonb;          -- { estimated, bucket, strengths, gaps, ... }
alter table public.profiles add column if not exists onboarded boolean not null default false;
alter table public.profiles add column if not exists voice boolean not null default true;
alter table public.profiles add column if not exists evolution_unlocked text[] not null default '{}';
alter table public.profiles add column if not exists evolution_equipped text[] not null default '{}';
alter table public.units add column if not exists skills text[] not null default '{}';
alter table public.units add column if not exists grammar text;
alter table public.lessons add column if not exists is_review boolean not null default false;

-- Plano Plus: preço configurável (o app lê de config/plans.js; aqui fica a referência do servidor)
create table if not exists public.plans (
  id         text primary key check (id in ('free','plus')),
  price_cents int not null default 0,
  currency   text not null default 'BRL',
  period     text not null default 'month'
);
insert into public.plans (id, price_cents) values ('free', 0), ('plus', 1990) on conflict (id) do nothing;
alter table public.plans enable row level security;
drop policy if exists "read plans" on public.plans;
create policy "read plans" on public.plans for select using (true);

-- Salva o resultado do teste de nível (ponto de partida; não pula o ensino)
create or replace function public.save_placement(p_language text, p_placement jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into public.user_languages (user_id, language_code, current_level, placement)
  values (auth.uid(), p_language, p_placement->>'estimated', p_placement)
  on conflict (user_id, language_code) do update set current_level = excluded.current_level, placement = excluded.placement, last_activity_at = now();
  update public.profiles set onboarded = true where id = auth.uid();
end $$;
grant execute on function public.save_placement(text, jsonb) to authenticated;
