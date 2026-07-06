-- ============================================================
--  Doko · Esquema Supabase (Postgres)
--  Cómo usarlo: Supabase Dashboard → SQL Editor → New query →
--  pega TODO esto → Run. Es idempotente (se puede volver a correr).
--
--  Diseño: los campos escalares son columnas; las estructuras
--  anidadas (galería, álbum, cronograma, etc.) van como jsonb para
--  coincidir 1:1 con los tipos de lib/types.ts sin fricción.
-- ============================================================

-- ----------------------------- CARTA -----------------------------
create table if not exists public.dishes (
  id          bigint generated always as identity primary key,
  name        text    not null,
  description text    not null default '',
  price       text    not null,
  category    text    not null check (category in
              ('entradas','makis','nigiris','sashimis','calientes','postres','bebidas')),
  image       text    not null default '',
  featured    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------- EVENTOS ----------------------------
create table if not exists public.events (
  id                bigint generated always as identity primary key,
  slug              text unique not null,
  title             text not null,
  starts_at         timestamptz not null,
  location          text not null default '',
  short_description text not null default '',
  cover             text not null default '',
  attendees_count   int  not null default 0,
  status            text not null default 'upcoming' check (status in ('upcoming','past')),
  attendees_preview jsonb not null default '[]'::jsonb,  -- Attendee[]
  full_description  text  not null default '',
  gallery           jsonb not null default '[]'::jsonb,  -- string[]
  videos            jsonb not null default '[]'::jsonb,  -- { thumbnail, url }[]
  schedule          jsonb not null default '[]'::jsonb,  -- ScheduleItem[]
  guest_chef        jsonb,                                -- { name, role, photo, bio } | null
  special_menu      jsonb not null default '[]'::jsonb,  -- { name, description }[]
  map               jsonb,                                -- { lat, lng, address }
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------- GALERÍA ----------------------------
create table if not exists public.gallery (
  id         bigint generated always as identity primary key,
  src        text not null,
  "full"     text not null default '',
  caption    text not null default '',
  filter     text not null check (filter in ('comida','eventos','clientes','chef','restaurante')),
  span       text check (span in ('tall','wide')),
  created_at timestamptz not null default now()
);

-- -------------------------- TESTIMONIOS --------------------------
create table if not exists public.testimonials (
  id         bigint generated always as identity primary key,
  name       text not null,
  role       text not null default '',
  avatar     text not null default '',
  rating     numeric(2,1) not null default 5,
  quote      text not null default '',
  created_at timestamptz not null default now()
);

-- -------------------------- EXPERIENCIAS -------------------------
create table if not exists public.experiences (
  id           bigint generated always as identity primary key,
  slug         text unique not null,
  event_title  text not null,
  "date"       text not null default '',
  cover        text not null default '',
  rating       numeric(2,1) not null default 5,
  reviews      int  not null default 0,
  attendees    int  not null default 0,
  photos       int  not null default 0,
  videos       int  not null default 0,
  album        jsonb not null default '[]'::jsonb,  -- { id, src, full, isVideo? }[]
  top_comments jsonb not null default '[]'::jsonb,  -- ExperienceComment[]
  story        text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------- BLOG -------------------------------
create table if not exists public.posts (
  id           bigint generated always as identity primary key,
  slug         text unique not null,
  title        text not null,
  excerpt      text not null default '',
  body         text not null default '',           -- markdown / html
  cover        text not null default '',
  author       text not null default 'Doko',
  tags         jsonb not null default '[]'::jsonb, -- string[]
  status       text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
--  updated_at automático en cada UPDATE
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['dishes','events','experiences','posts'] loop
    execute format('drop trigger if exists trg_touch on public.%I;', t);
    execute format(
      'create trigger trg_touch before update on public.%I
       for each row execute function public.touch_updated_at();', t);
  end loop;
end $$;

-- ============================================================
--  Row Level Security
--  Lectura pública del contenido; las escrituras se hacen con la
--  service_role key desde los Route Handlers (server-side), que
--  omite RLS. Cuando integremos Supabase Auth añadiremos políticas
--  de escritura por rol admin.
-- ============================================================
alter table public.dishes       enable row level security;
alter table public.events       enable row level security;
alter table public.gallery      enable row level security;
alter table public.testimonials enable row level security;
alter table public.experiences  enable row level security;
alter table public.posts        enable row level security;

drop policy if exists "public read dishes"          on public.dishes;
drop policy if exists "public read events"           on public.events;
drop policy if exists "public read gallery"          on public.gallery;
drop policy if exists "public read testimonials"     on public.testimonials;
drop policy if exists "public read experiences"      on public.experiences;
drop policy if exists "public read published posts"  on public.posts;

create policy "public read dishes"       on public.dishes       for select using (true);
create policy "public read events"        on public.events        for select using (true);
create policy "public read gallery"       on public.gallery       for select using (true);
create policy "public read testimonials"  on public.testimonials  for select using (true);
create policy "public read experiences"   on public.experiences   for select using (true);
-- Del blog solo son públicos los posts publicados:
create policy "public read published posts" on public.posts for select using (status = 'published');

-- ============================================================
--  Índices útiles
-- ============================================================
create index if not exists idx_dishes_category on public.dishes (category);
create index if not exists idx_dishes_featured on public.dishes (featured);
create index if not exists idx_events_status   on public.events (status);
create index if not exists idx_gallery_filter  on public.gallery (filter);
create index if not exists idx_posts_status    on public.posts (status, published_at desc);
