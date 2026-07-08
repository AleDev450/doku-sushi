import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Corre en todo el sitio (menos assets estáticos) para mantener la sesión
  // siempre fresca — patrón oficial de @supabase/ssr. El candado de /admin
  // se aplica dentro de updateSession.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
