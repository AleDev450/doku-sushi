// Cliente de Supabase con service_role.
//
// ⚠️ SOLO server-side (Route Handlers). La service_role key OMITE RLS y da
// acceso total a la base de datos: NUNCA la importes en componentes "use client"
// ni expongas SUPABASE_SERVICE_ROLE_KEY al navegador (no lleva prefijo NEXT_PUBLIC
// justamente por eso). Se usa para las escrituras del panel admin.

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
