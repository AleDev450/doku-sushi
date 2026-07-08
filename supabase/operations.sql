-- ============================================================
--  Doko · Operaciones (reservas, mensajes de contacto, ajustes)
--  Pegar en Supabase → SQL Editor → Run. Idempotente.
--  Requiere auth.sql + auth-fase2.sql previos.
-- ============================================================

-- 1) Reservas
create table if not exists public.reservations (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  phone      text,
  date       date not null,
  time       text,
  people     int  not null default 2,
  event_slug text,
  notes      text,
  status     text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists idx_reservations_created on public.reservations (created_at desc);

-- 2) Mensajes de contacto
create table if not exists public.contact_messages (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_contact_created on public.contact_messages (created_at desc);

-- 3) Ajustes del sitio (una sola fila, id=1)
create table if not exists public.site_settings (
  id          int primary key default 1,
  brand_name  text not null default 'Doko',
  tagline     text not null default '',
  address     text not null default '',
  phone       text not null default '',
  email       text not null default '',
  instagram   text not null default '',
  facebook    text not null default '',
  hours       text not null default '',
  nav_hidden  jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
-- Por si la tabla ya existía sin la columna:
alter table public.site_settings add column if not exists nav_hidden jsonb not null default '[]'::jsonb;

-- 4) RLS
alter table public.reservations     enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings    enable row level security;

-- helper de staff en línea
-- (reservas y mensajes: inserta cualquiera; lee/gestiona solo staff)
drop policy if exists "res insert public"  on public.reservations;
drop policy if exists "res staff manage"   on public.reservations;
drop policy if exists "msg insert public"   on public.contact_messages;
drop policy if exists "msg staff manage"    on public.contact_messages;
drop policy if exists "settings read"       on public.site_settings;
drop policy if exists "settings superadmin" on public.site_settings;

create policy "res insert public" on public.reservations for insert with check (true);
create policy "res staff manage"  on public.reservations for all
  using (exists (select 1 from public.profiles where id = auth.uid() and active and role in ('superadmin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and active and role in ('superadmin', 'editor')));

create policy "msg insert public" on public.contact_messages for insert with check (true);
create policy "msg staff manage"  on public.contact_messages for all
  using (exists (select 1 from public.profiles where id = auth.uid() and active and role in ('superadmin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and active and role in ('superadmin', 'editor')));

create policy "settings read"       on public.site_settings for select using (true);
create policy "settings superadmin" on public.site_settings for all
  using (public.is_superadmin()) with check (public.is_superadmin());

-- 5) Permisos por defecto de las secciones nuevas (idempotente)
insert into public.role_permissions (role, section, can_view, can_edit) values
  ('superadmin', 'reservas', true, true),
  ('superadmin', 'mensajes', true, true),
  ('editor',     'reservas', true, true),
  ('editor',     'mensajes', true, true)
on conflict (role, section) do nothing;
