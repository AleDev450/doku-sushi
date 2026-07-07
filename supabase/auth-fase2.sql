-- ============================================================
--  Doko · Auth Fase 2 · Permisos configurables por rol
--  Pegar en Supabase → SQL Editor → Run. Idempotente.
--  Requiere haber corrido antes auth.sql (usa is_superadmin()).
-- ============================================================

create table if not exists public.role_permissions (
  role     text not null check (role in ('superadmin','editor')),
  section  text not null,
  can_view boolean not null default false,
  can_edit boolean not null default false,
  primary key (role, section)
);

-- Semilla por defecto: superadmin todo; editor abierto en contenido
-- (el superadmin luego LIMITA desde el panel). Idempotente.
insert into public.role_permissions (role, section, can_view, can_edit) values
  ('superadmin', 'carta',        true, true),
  ('superadmin', 'blog',         true, true),
  ('superadmin', 'eventos',      true, true),
  ('superadmin', 'galeria',      true, true),
  ('superadmin', 'experiencias', true, true),
  ('editor',     'carta',        true, true),
  ('editor',     'blog',         true, true),
  ('editor',     'eventos',      true, true),
  ('editor',     'galeria',      true, true),
  ('editor',     'experiencias', true, true)
on conflict (role, section) do nothing;

-- RLS: cualquier logueado puede leer; solo el superadmin escribe.
-- (El panel opera con service_role, que omite RLS; esto es defensa en profundidad.)
alter table public.role_permissions enable row level security;

drop policy if exists "perms read"            on public.role_permissions;
drop policy if exists "perms write superadmin" on public.role_permissions;

create policy "perms read"
  on public.role_permissions for select
  using (auth.uid() is not null);

create policy "perms write superadmin"
  on public.role_permissions for all
  using (public.is_superadmin())
  with check (public.is_superadmin());
