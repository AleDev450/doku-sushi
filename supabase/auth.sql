-- ============================================================
--  Doko · Auth & Roles (Fase 1)
--  Pegar en Supabase → SQL Editor → Run. Idempotente.
--
--  Modelo: Supabase Auth maneja las credenciales (auth.users).
--  Aquí agregamos `profiles` (1:1) con el rol de cada usuario.
--  El PRIMER usuario que se cree se vuelve 'superadmin' automáticamente;
--  los siguientes entran como 'editor' INACTIVOS (el superadmin los activa).
-- ============================================================

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  role       text not null default 'editor' check (role in ('superadmin','editor')),
  active     boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at automático
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_touch on public.profiles;
create trigger trg_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
--  Crear el profile automáticamente al registrarse un usuario.
--  El primero = superadmin activo; el resto = editor inactivo.
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  is_first boolean;
begin
  select count(*) = 0 into is_first from public.profiles;
  insert into public.profiles (id, email, full_name, role, active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    case when is_first then 'superadmin' else 'editor' end,
    is_first
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
--  RLS: cada quien lee su propio profile; el superadmin lee/gestiona todos.
--  (Las operaciones del panel usan service_role, que omite RLS; esto es
--   defensa en profundidad para accesos con la anon key.)
-- ------------------------------------------------------------
alter table public.profiles enable row level security;

-- Helper: ¿el usuario actual es superadmin activo?
create or replace function public.is_superadmin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'superadmin' and active
  );
$$;

drop policy if exists "read own profile"     on public.profiles;
drop policy if exists "superadmin reads all" on public.profiles;
drop policy if exists "superadmin writes all" on public.profiles;

create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "superadmin reads all"
  on public.profiles for select
  using (public.is_superadmin());

create policy "superadmin writes all"
  on public.profiles for all
  using (public.is_superadmin())
  with check (public.is_superadmin());
