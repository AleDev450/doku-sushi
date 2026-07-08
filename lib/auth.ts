// Helpers de sesión/rol para el servidor (Server Components, layouts, actions).
// Lee el propio perfil con la sesión del usuario (RLS), sin service_role.

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Role = "superadmin" | "editor" | "user";
export type StaffRole = "superadmin" | "editor";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  active: boolean;
};

/** Perfil del usuario logueado, o null si no hay sesión / no tiene profile. */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // Lee el propio perfil con la sesión (RLS "read own profile" lo permite).
    // No depende de la service_role, así funciona aunque falte esa env var.
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, role, active")
      .eq("id", user.id)
      .maybeSingle();

    return (data as Profile) ?? null;
  } catch {
    // Nunca reventar por un fallo de sesión/entorno: se trata como "no logueado".
    return null;
  }
});

/** True si el profile es STAFF (superadmin/editor) activo → puede entrar al /admin. */
export function canAccessAdmin(profile: Profile | null): profile is Profile {
  return Boolean(profile && profile.active && (profile.role === "superadmin" || profile.role === "editor"));
}

/** Guard para acciones de cualquier usuario logueado y activo (incluye rol 'user'). */
export async function requireUser(): Promise<Profile | null> {
  const profile = await getCurrentProfile();
  return profile && profile.active ? profile : null;
}

/**
 * Guard para Route Handlers de escritura: devuelve el profile si el usuario
 * está logueado y activo, o null si no está autorizado (responder 401).
 */
export async function requireAdmin(): Promise<Profile | null> {
  const profile = await getCurrentProfile();
  return canAccessAdmin(profile) ? profile : null;
}
