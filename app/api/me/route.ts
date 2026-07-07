// GET /api/me -> estado del usuario actual (para la UI de comunidad)
import { NextResponse } from "next/server";
import { getCurrentProfile, canAccessAdmin } from "@/lib/auth";

export async function GET() {
  const me = await getCurrentProfile();
  if (!me) return NextResponse.json({ loggedIn: false });
  return NextResponse.json({
    loggedIn: true,
    id: me.id,
    name: me.full_name || me.email.split("@")[0],
    avatar: me.avatar_url,
    isStaff: canAccessAdmin(me),
  });
}
