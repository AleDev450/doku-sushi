// Cliente de Supabase para el navegador (componentes "use client").
// Usa la anon key: las lecturas respetan RLS (solo contenido público).

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
