// PATCH  /api/events/:slug  -> actualiza el evento
// DELETE /api/events/:slug  -> elimina el evento

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateEvent, deleteEvent, parseEventInput } from "@/lib/api";
import { requirePermission } from "@/lib/rbac";

type Ctx = { params: { slug: string } };

function revalidateEvents(slug?: string) {
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");
  if (slug) revalidatePath(`/eventos/${slug}`);
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await requirePermission("eventos", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parseEventInput(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 422 });

  try {
    const event = await updateEvent(params.slug, parsed.data);
    if (!event) return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
    revalidateEvents(params.slug);
    revalidateEvents(event.slug);
    return NextResponse.json(event);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo actualizar." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requirePermission("eventos", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const ok = await deleteEvent(params.slug);
    if (!ok) return NextResponse.json({ error: "Evento no encontrado." }, { status: 404 });
    revalidateEvents(params.slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo eliminar." },
      { status: 500 }
    );
  }
}
