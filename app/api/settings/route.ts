// GET /api/settings  -> ajustes del sitio (público)
// PUT /api/settings  -> actualizar (solo superadmin)

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { SiteSettings } from "@/lib/types";
import { getSettings, updateSettings } from "@/lib/operations";
import { requireSuperadmin } from "@/lib/rbac";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PUT(req: Request) {
  if (!(await requireSuperadmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }
  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }
  const s = (k: string) => (typeof b[k] === "string" ? (b[k] as string).trim() : "");
  const input: SiteSettings = {
    brandName: s("brandName") || "Doko",
    tagline: s("tagline"),
    address: s("address"),
    phone: s("phone"),
    email: s("email"),
    instagram: s("instagram"),
    facebook: s("facebook"),
    hours: s("hours"),
  };
  try {
    const settings = await updateSettings(input);
    revalidatePath("/", "layout");
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo guardar." }, { status: 500 });
  }
}
