// PATCH  /api/testimonials/:id  -> actualiza un testimonio
// DELETE /api/testimonials/:id  -> elimina un testimonio

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { TestimonialInput } from "@/lib/api";
import { updateTestimonial, deleteTestimonial } from "@/lib/api";
import { requirePermission } from "@/lib/rbac";

type Ctx = { params: { id: string } };

function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/admin/testimonios");
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await requirePermission("testimonios", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const patch: Partial<TestimonialInput> = {};
  if (typeof b.name === "string") {
    if (!b.name.trim()) return NextResponse.json({ error: "El nombre no puede quedar vacío." }, { status: 422 });
    patch.name = b.name.trim();
  }
  if (typeof b.role === "string") patch.role = b.role.trim();
  if (typeof b.avatar === "string") patch.avatar = b.avatar.trim();
  if (typeof b.quote === "string") patch.quote = b.quote.trim();
  if (b.rating !== undefined) {
    const r = Number(b.rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) return NextResponse.json({ error: "Calificación inválida." }, { status: 422 });
    patch.rating = r;
  }

  try {
    const t = await updateTestimonial(Number(params.id), patch);
    if (!t) return NextResponse.json({ error: "Testimonio no encontrado." }, { status: 404 });
    revalidateTestimonials();
    return NextResponse.json(t);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo actualizar." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requirePermission("testimonios", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const ok = await deleteTestimonial(Number(params.id));
    if (!ok) return NextResponse.json({ error: "Testimonio no encontrado." }, { status: 404 });
    revalidateTestimonials();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo eliminar." }, { status: 500 });
  }
}
