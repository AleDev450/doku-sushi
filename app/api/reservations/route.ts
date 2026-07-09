// POST /api/reservations  -> crear reserva (público)
// GET  /api/reservations  -> listar (staff)

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createReservation, listReservations } from "@/lib/operations";
import { requirePermission } from "@/lib/rbac";
import { isBotSubmission } from "@/lib/antibot";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  if (!(await requirePermission("reservas", "view"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }
  return NextResponse.json(await listReservations());
}

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  // Anti-bot: si es spam automatizado, fingimos éxito y no guardamos nada.
  if (isBotSubmission(b)) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const date = typeof b.date === "string" ? b.date : "";
  if (!name) return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 422 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Correo inválido." }, { status: 422 });
  if (!date) return NextResponse.json({ error: "La fecha es obligatoria." }, { status: 422 });

  try {
    const reservation = await createReservation({
      name,
      email,
      phone: typeof b.phone === "string" ? b.phone.trim() : "",
      date,
      time: typeof b.time === "string" ? b.time.trim() : "",
      people: Number(b.people) || 2,
      eventSlug: typeof b.eventSlug === "string" ? b.eventSlug : null,
      notes: typeof b.notes === "string" ? b.notes.trim() : "",
    });
    revalidatePath("/admin/reservas");
    return NextResponse.json(reservation, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo reservar." }, { status: 500 });
  }
}
