// GET   /api/me -> estado del usuario actual (para la UI de comunidad)
// PATCH /api/me -> el propio usuario edita su nombre
import { NextResponse } from "next/server";
import { getCurrentProfile, canAccessAdmin, requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const me = await getCurrentProfile();
  if (!me) return NextResponse.json({ loggedIn: false });
  return NextResponse.json({
    loggedIn: true,
    id: me.id,
    name: me.full_name || me.email.split("@")[0],
    avatar: me.avatar_url,
    role: me.role,
    isStaff: canAccessAdmin(me),
  });
}

export async function PATCH(req: Request) {
  const me = await requireUser();
  if (!me) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const fullName = typeof b.full_name === "string" ? b.full_name.trim() : "";
  if (!fullName) return NextResponse.json({ error: "El nombre no puede quedar vacío." }, { status: 422 });

  const sb = createAdminClient();
  await sb.from("profiles").update({ full_name: fullName }).eq("id", me.id);
  await sb.auth.admin.updateUserById(me.id, { user_metadata: { full_name: fullName } });
  return NextResponse.json({ ok: true, name: fullName });
}
