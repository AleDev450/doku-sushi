// RBAC: resolución de permisos, guards y gestión de usuarios.
// Solo servidor (usa service_role). No importar desde componentes "use client".

import { cache } from "react";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile, canAccessAdmin, type Profile, type Role } from "@/lib/auth";
import { SECTIONS, type SectionKey, type PermissionMap } from "@/lib/sections";

/** Permisos resueltos del profile: superadmin todo; editor desde role_permissions. */
export const getPermissions = cache(async (profile: Profile): Promise<PermissionMap> => {
  const map: PermissionMap = {};
  for (const s of SECTIONS) map[s.key] = { view: false, edit: false };

  if (profile.role === "superadmin") {
    for (const s of SECTIONS) map[s.key] = { view: true, edit: true };
    return map;
  }

  const { data } = await createAdminClient()
    .from("role_permissions")
    .select("section, can_view, can_edit")
    .eq("role", profile.role);

  for (const row of data ?? []) {
    map[row.section as string] = { view: row.can_view, edit: row.can_edit };
  }
  return map;
});

/* ----------------------------- Guards ----------------------------- */

/** Devuelve el profile si es superadmin activo; si no, null (para APIs → 401/403). */
export async function requireSuperadmin(): Promise<Profile | null> {
  const p = await getCurrentProfile();
  return p && canAccessAdmin(p) && p.role === "superadmin" ? p : null;
}

/** Devuelve el profile si tiene el permiso pedido sobre la sección; si no, null. */
export async function requirePermission(
  section: SectionKey,
  action: "view" | "edit"
): Promise<Profile | null> {
  const p = await getCurrentProfile();
  if (!canAccessAdmin(p)) return null;
  if (p.role === "superadmin") return p;
  const perms = await getPermissions(p);
  const perm = perms[section];
  if (!perm) return null;
  return (action === "edit" ? perm.edit : perm.view) ? p : null;
}

/** Para páginas server: redirige a /admin si no hay acceso a la sección. */
export async function assertSectionAccess(section: SectionKey, action: "view" | "edit") {
  if (!(await requirePermission(section, action))) redirect("/admin");
}

/* --------------------- Gestión de usuarios (superadmin) --------------------- */

export async function listProfiles(): Promise<Profile[]> {
  const { data } = await createAdminClient()
    .from("profiles")
    .select("id, email, full_name, role, active")
    .order("created_at", { ascending: true });
  return (data as Profile[]) ?? [];
}

export async function createUser(input: {
  email: string;
  password: string;
  fullName: string;
  role: Role;
}): Promise<{ error?: string }> {
  const sb = createAdminClient();
  const { data, error } = await sb.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.fullName },
  });
  if (error) return { error: error.message };

  // El trigger creó el profile (editor, inactivo). Lo dejamos activo con su rol.
  const { error: upErr } = await sb
    .from("profiles")
    .update({ role: input.role, active: true, full_name: input.fullName || null })
    .eq("id", data.user.id);
  if (upErr) return { error: upErr.message };
  return {};
}

export async function updateUser(
  id: string,
  patch: { role?: Role; active?: boolean; full_name?: string }
): Promise<void> {
  await createAdminClient().from("profiles").update(patch).eq("id", id);
}

export async function deleteUser(id: string): Promise<void> {
  // Borra el usuario de auth; el profile cae en cascada.
  await createAdminClient().auth.admin.deleteUser(id);
}

/* ----------------------------- Permisos ----------------------------- */

export async function getRolePermissions(): Promise<
  { role: string; section: string; can_view: boolean; can_edit: boolean }[]
> {
  const { data } = await createAdminClient().from("role_permissions").select("*");
  return data ?? [];
}

export async function setRolePermission(
  role: Role,
  section: string,
  perm: { can_view: boolean; can_edit: boolean }
): Promise<void> {
  await createAdminClient()
    .from("role_permissions")
    .upsert({ role, section, can_view: perm.can_view, can_edit: perm.can_edit }, { onConflict: "role,section" });
}
