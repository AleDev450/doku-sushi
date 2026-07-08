import type { Metadata } from "next";
import { listReservations } from "@/lib/operations";
import { assertSectionAccess } from "@/lib/rbac";
import ReservationTable from "@/components/admin/ReservationTable";

export const metadata: Metadata = { title: "Reservas · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminReservasPage() {
  await assertSectionAccess("reservas", "view");
  const reservations = await listReservations();
  const pending = reservations.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.9rem] font-semibold">Reservas</h1>
        <p className="text-[0.9rem] text-mist">{reservations.length} en total · {pending} pendientes</p>
      </div>
      <ReservationTable reservations={reservations} />
    </div>
  );
}
