-- ============================================================
--  Doko · Contenido editable de páginas (textos + fotos)
--  Pegar en Supabase → SQL Editor → Run. Idempotente.
--  Requiere auth.sql + auth-fase2.sql.
-- ============================================================

-- Cada fila = un bloque editable de una página (key), con su data en jsonb.
create table if not exists public.page_content (
  key        text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.page_content enable row level security;

drop policy if exists "content read"        on public.page_content;
drop policy if exists "content write staff" on public.page_content;

-- Lectura pública (el sitio lo muestra); escritura solo staff.
create policy "content read" on public.page_content for select using (true);
create policy "content write staff" on public.page_content for all
  using (exists (select 1 from public.profiles where id = auth.uid() and active and role in ('superadmin', 'editor')))
  with check (exists (select 1 from public.profiles where id = auth.uid() and active and role in ('superadmin', 'editor')));

-- Permisos por defecto de la sección 'paginas' (idempotente)
insert into public.role_permissions (role, section, can_view, can_edit) values
  ('superadmin', 'paginas', true, true),
  ('editor',     'paginas', true, true)
on conflict (role, section) do nothing;
