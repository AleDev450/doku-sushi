// DELETE /api/feedback/:id  -> borra tu propio feedback (o cualquiera si eres staff)

import { NextResponse } from "next/server";
import { requireUser, canAccessAdmin } from "@/lib/auth";
import { deleteFeedbackById } from "@/lib/feedback";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const me = await requireUser();
  if (!me) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  try {
    const ok = await deleteFeedbackById(Number(params.id), me.id, canAccessAdmin(me));
    if (!ok) return NextResponse.json({ error: "No encontrado o sin permiso." }, { status: 403 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error." }, { status: 500 });
  }
}
