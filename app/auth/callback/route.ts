// Callback de OAuth / confirmación de email: intercambia el code por sesión.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";
  // Facebook/Supabase manda el motivo del fallo aquí cuando no hay code.
  const providerError = searchParams.get("error_description") || searchParams.get("error");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    return NextResponse.redirect(`${origin}/login?error=oauth&reason=${encodeURIComponent(error.message)}`);
  }

  const suffix = providerError ? `&reason=${encodeURIComponent(providerError)}` : "";
  return NextResponse.redirect(`${origin}/login?error=oauth${suffix}`);
}
