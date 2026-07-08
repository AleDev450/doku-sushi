// PATCH  /api/reservations/:id  -> cambiar estado (staff)
// DELETE /api/reservations/:id  -> eliminar (staff)

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { ReservationStatus } from "@/lib/types";
import { updateReservationStatus, deleteReservation } from "@/lib/operations";
import { requirePermission } from "@/lib/rbac";

const STATUSES: ReservationStatus[] = ["pending", "confirmed", "cancelled"];
type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await requirePermission("reservas", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }
  if (!STATUSES.includes(b.status as ReservationStatus)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 422 });
  }
  const r = await updateReservationStatus(Number(params.id), b.status as ReservationStatus);
  if (!r) return NextResponse.json({ error: "No encontrada." }, { status: 404 });
  revalidatePath("/admin/reservas");
  return NextResponse.json(r);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requirePermission("reservas", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const ok = await deleteReservation(Number(params.id));
  if (!ok) return NextResponse.json({ error: "No encontrada." }, { status: 404 });
  revalidatePath("/admin/reservas");
  return NextResponse.json({ ok: true });
}
