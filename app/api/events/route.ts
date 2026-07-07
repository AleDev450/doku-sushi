// POST /api/events  -> crea un evento

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createEvent, parseEventInput } from "@/lib/api";
import { requirePermission } from "@/lib/rbac";

function revalidateEvents(slug?: string) {
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");
  if (slug) revalidatePath(`/eventos/${slug}`);
}

export async function POST(req: Request) {
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
    const event = await createEvent(parsed.data);
    revalidateEvents(event.slug);
    return NextResponse.json(event, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo crear el evento." },
      { status: 500 }
    );
  }
}
