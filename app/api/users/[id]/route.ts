// PATCH  /api/users/:id  -> actualiza rol / activo / nombre (superadmin)
// DELETE /api/users/:id  -> elimina el usuario (superadmin)

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Role } from "@/lib/auth";
import { requireSuperadmin, updateUser, deleteUser } from "@/lib/rbac";

const ROLES: Role[] = ["superadmin", "editor"];

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
  const me = await requireSuperadmin();
  if (!me) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  // Evitar auto-bloqueo: no puedes cambiar tu propio rol/estado.
  if (me.id === params.id) {
    return NextResponse.json({ error: "No puedes modificar tu propia cuenta." }, { status: 422 });
  }

  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const patch: { role?: Role; active?: boolean; full_name?: string } = {};
  if (b.role !== undefined) {
    if (!ROLES.includes(b.role as Role)) return NextResponse.json({ error: "Rol inválido." }, { status: 422 });
    patch.role = b.role as Role;
  }
  if (typeof b.active === "boolean") patch.active = b.active;
  if (typeof b.full_name === "string") patch.full_name = b.full_name.trim();

  await updateUser(params.id, patch);
  revalidatePath("/admin/usuarios");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const me = await requireSuperadmin();
  if (!me) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

  if (me.id === params.id) {
    return NextResponse.json({ error: "No puedes eliminar tu propia cuenta." }, { status: 422 });
  }

  await deleteUser(params.id);
  revalidatePath("/admin/usuarios");
  return NextResponse.json({ ok: true });
}
