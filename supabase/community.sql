-- ============================================================
--  Doko · Comunidad (usuarios públicos + feedback)
--  Pegar en Supabase → SQL Editor → Run. Idempotente.
--  Requiere auth.sql y auth-fase2.sql previos.
-- ============================================================

-- 1) Rol 'user' para usuarios públicos + avatar en profiles
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('superadmin', 'editor', 'user'));
alter table public.profiles add column if not exists avatar_url text;

-- 2) Trigger: el 1er usuario = superadmin; el resto = 'user' ACTIVO.
--    (El staff editor/superadmin se crea desde el admin, que fija el rol luego.)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  is_first boolean;
begin
  select count(*) = 0 into is_first from public.profiles;
  insert into public.profiles (id, email, full_name, avatar_url, role, active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    case when is_first then 'superadmin' else 'user' end,
    true
  );
  return new;
end $$;

-- 3) Feedback (comentarios de usuarios sobre eventos/experiencias)
create table if not exists public.feedback (
  id            bigint generated always as identity primary key,
  target_type   text not null check (target_type in ('event', 'experience')),
  target_slug   text not null,
  user_id       uuid not null references auth.users (id) on delete cascade,
  author_name   text not null,
  author_avatar text,
  rating        int  not null check (rating between 1 and 5),
  text          text not null,
  created_at    timestamptz not null default now()
);
create index if not exists idx_feedback_target
  on public.feedback (target_type, target_slug, created_at desc);

-- 4) Likes (uno por usuario y comentario; sin respuestas)
create table if not exists public.feedback_likes (
  feedback_id bigint not null references public.feedback (id) on delete cascade,
  user_id     uuid   not null references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (feedback_id, user_id)
);

-- 5) RLS
alter table public.feedback       enable row level security;
alter table public.feedback_likes enable row level security;

drop policy if exists "feedback read"          on public.feedback;
drop policy if exists "feedback insert own"     on public.feedback;
drop policy if exists "feedback delete own/staff" on public.feedback;
drop policy if exists "likes read"             on public.feedback_likes;
drop policy if exists "likes write own"         on public.feedback_likes;

-- Lectura pública del feedback y los likes
create policy "feedback read" on public.feedback for select using (true);
create policy "likes read"    on public.feedback_likes for select using (true);

-- Escritura ligada al usuario (defensa en profundidad; el server usa service_role)
create policy "feedback insert own" on public.feedback for insert
  with check (auth.uid() = user_id);

create policy "feedback delete own/staff" on public.feedback for delete
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and active and role in ('superadmin', 'editor')
    )
  );

create policy "likes write own" on public.feedback_likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
