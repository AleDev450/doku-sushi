// Cliente de Supabase para el servidor (Server Components y Route Handlers).
// Basado en cookies (@supabase/ssr) para respetar la sesión del usuario y RLS.
// Usa la anon key: pensado para LECTURAS de contenido público y, más adelante,
// operaciones ligadas a la sesión cuando integremos Supabase Auth.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // En Server Components no siempre se pueden escribir cookies;
          // el middleware se encarga de refrescar la sesión. Ignoramos el error.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* noop */
          }
        },
      },
    }
  );
}
