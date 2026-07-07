import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Corre sobre /admin (candado) y /login (para refrescar/leer sesión).
  matcher: ["/admin/:path*", "/login"],
};
