// PATCH  /api/contact/:id  -> marcar leído/no leído (staff)
// DELETE /api/contact/:id  -> eliminar (staff)

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { setMessageRead, deleteMessage } from "@/lib/operations";
import { requirePermission } from "@/lib/rbac";

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await requirePermission("mensajes", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }
  const m = await setMessageRead(Number(params.id), Boolean(b.read));
  if (!m) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  revalidatePath("/admin/mensajes");
  return NextResponse.json(m);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requirePermission("mensajes", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const ok = await deleteMessage(Number(params.id));
  if (!ok) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  revalidatePath("/admin/mensajes");
  return NextResponse.json({ ok: true });
}
