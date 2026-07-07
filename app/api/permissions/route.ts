// GET   /api/permissions  -> matriz completa (superadmin)
// PATCH /api/permissions  -> actualiza permisos de un rol (superadmin)
//   body: { role: "editor", items: [{ section, can_view, can_edit }] }

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Role } from "@/lib/auth";
import { requireSuperadmin, getRolePermissions, setRolePermission } from "@/lib/rbac";
import { SECTIONS } from "@/lib/sections";

const ROLES: Role[] = ["superadmin", "editor"];
const SECTION_KEYS = SECTIONS.map((s) => s.key) as string[];

export async function GET() {
  if (!(await requireSuperadmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }
  return NextResponse.json(await getRolePermissions());
}

export async function PATCH(req: Request) {
  if (!(await requireSuperadmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const role = b.role as Role;
  if (!ROLES.includes(role)) return NextResponse.json({ error: "Rol inválido." }, { status: 422 });
  // El superadmin siempre tiene todo: no se edita.
  if (role === "superadmin") {
    return NextResponse.json({ error: "El superadmin no se puede limitar." }, { status: 422 });
  }
  if (!Array.isArray(b.items)) return NextResponse.json({ error: "Falta 'items'." }, { status: 422 });

  for (const raw of b.items) {
    if (typeof raw !== "object" || raw === null) continue;
    const it = raw as Record<string, unknown>;
    const section = String(it.section);
    if (!SECTION_KEYS.includes(section)) continue;
    await setRolePermission(role, section, {
      can_view: Boolean(it.can_view),
      can_edit: Boolean(it.can_edit),
    });
  }

  revalidatePath("/admin", "layout");
  return NextResponse.json({ ok: true });
}
