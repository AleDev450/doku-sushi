// Helpers de sesión/rol para el servidor (Server Components, layouts, actions).
// Lee el profile vía service_role para evitar fricción con RLS.

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type Role = "superadmin" | "editor";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  active: boolean;
};

/** Perfil del usuario logueado, o null si no hay sesión / no tiene profile. */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await createAdminClient()
    .from("profiles")
    .select("id, email, full_name, role, active")
    .eq("id", user.id)
    .maybeSingle();

  return (data as Profile) ?? null;
});

/** True si el profile puede acceder al panel admin (activo y con rol válido). */
export function canAccessAdmin(profile: Profile | null): profile is Profile {
  return Boolean(profile && profile.active);
}
