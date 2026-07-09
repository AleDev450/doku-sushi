-- ============================================================
--  Doko · FIX — usuarios públicos (Google/registro) deben ser
--  rol 'user' ACTIVO, no 'editor' inactivo.
--  Pegar en Supabase → SQL Editor → Run. Idempotente.
-- ============================================================

-- 1) Corrige el trigger: el 1er usuario = superadmin; el resto = 'user' ACTIVO.
--    (Vuelve a aplicar la versión correcta por si quedó la vieja.)
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) Arregla las cuentas de comunidad ya creadas mal (editor inactivo → user activo).
--    Ojo: si tienes editores REALES pendientes de activar, actívalos desde /admin/usuarios
--    en vez de correr esto, o ajusta el WHERE.
update public.profiles
set role = 'user', active = true
where role = 'editor' and active = false;
