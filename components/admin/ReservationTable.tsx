"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, Mail, Phone } from "lucide-react";
import type { Reservation, ReservationStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS = {
  pending: { label: "Pendiente", cls: "bg-amber-500/10 text-amber-400" },
  confirmed: { label: "Confirmada", cls: "bg-emerald-500/10 text-emerald-400" },
  cancelled: { label: "Cancelada", cls: "bg-seal/10 text-seal" },
};

export default function ReservationTable({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  async function setStatus(r: Reservation, status: ReservationStatus) {
    setBusy(r.id);
    try {
      const res = await fetch(`/api/reservations/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar.");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusy(null);
    }
  }

  async function remove(r: Reservation) {
    if (!confirm(`¿Eliminar la reserva de ${r.name}?`)) return;
    setBusy(r.id);
    try {
      const res = await fetch(`/api/reservations/${r.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar.");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusy(null);
    }
  }

  if (reservations.length === 0) {
    return <div className="rounded-xl border border-dashed border-[var(--line)] p-12 text-center text-mist">Aún no hay reservas.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-ink">
      <table className="w-full min-w-[760px] text-left text-[0.86rem]">
        <thead>
          <tr className="border-b border-[var(--line)] text-[0.72rem] uppercase tracking-wider text-mist-2">
            <th className="px-5 py-3 font-medium">Cliente</th>
            <th className="px-3 py-3 font-medium">Fecha</th>
            <th className="px-3 py-3 font-medium">Pers.</th>
            <th className="px-3 py-3 font-medium">Estado</th>
            <th className="px-5 py-3 text-right font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} className={cn("border-b border-[var(--line)] align-top last:border-none transition-opacity", busy === r.id && "opacity-50")}>
              <td className="px-5 py-3">
                <div className="font-medium">{r.name}</div>
                <div className="mt-0.5 flex flex-col gap-0.5 text-[0.74rem] text-mist-2">
                  <span className="inline-flex items-center gap-1"><Mail size={11} /> {r.email}</span>
                  {r.phone && <span className="inline-flex items-center gap-1"><Phone size={11} /> {r.phone}</span>}
                </div>
                {r.notes && <div className="mt-1 max-w-[280px] text-[0.76rem] text-mist">“{r.notes}”</div>}
              </td>
              <td className="px-3 py-3 text-mist">
                {r.date}{r.time ? ` · ${r.time}` : ""}
                {r.eventSlug && <div className="text-[0.72rem] text-mist-2">{r.eventSlug}</div>}
              </td>
              <td className="px-3 py-3 text-mist">{r.people}</td>
              <td className="px-3 py-3">
                <select
                  value={r.status}
                  disabled={busy === r.id}
                  onChange={(e) => setStatus(r, e.target.value as ReservationStatus)}
                  className={cn("rounded-full border-0 px-2.5 py-1 text-[0.72rem] font-medium", STATUS[r.status].cls)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </td>
              <td className="px-5 py-3 text-right">
                <button onClick={() => remove(r)} disabled={busy === r.id} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:border-seal/50 hover:text-seal" aria-label="Eliminar">
                  {busy === r.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
