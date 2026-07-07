"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import type { EventSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { longDate, timeOf } from "@/lib/utils";

export default function EventTable({ events }: { events: EventSummary[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(ev: EventSummary) {
    if (!confirm(`¿Eliminar “${ev.title}”? No se puede deshacer.`)) return;
    setBusy(ev.slug);
    try {
      const res = await fetch(`/api/events/${ev.slug}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "No se pudo eliminar.");
      }
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusy(null);
    }
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--line)] p-12 text-center text-mist">
        Aún no hay eventos. Crea el primero con “Nuevo evento”.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-ink">
      <table className="w-full min-w-[680px] text-left text-[0.86rem]">
        <thead>
          <tr className="border-b border-[var(--line)] text-[0.72rem] uppercase tracking-wider text-mist-2">
            <th className="px-5 py-3 font-medium">Evento</th>
            <th className="px-3 py-3 font-medium">Fecha</th>
            <th className="px-3 py-3 font-medium">Estado</th>
            <th className="px-5 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.slug} className={cn("border-b border-[var(--line)] last:border-none transition-opacity", busy === ev.slug && "opacity-50")}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-ink-3">
                    {ev.cover && <Image src={ev.cover} alt="" fill sizes="64px" className="object-cover" />}
                  </span>
                  <div>
                    <div className="font-medium">{ev.title}</div>
                    <div className="text-[0.76rem] text-mist-2">{ev.location}</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-mist">
                {ev.startsAt ? `${longDate(ev.startsAt)} · ${timeOf(ev.startsAt)}` : "—"}
              </td>
              <td className="px-3 py-3">
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-[0.7rem] font-medium",
                  ev.status === "upcoming" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-mist"
                )}>
                  {ev.status === "upcoming" ? "Próximo" : "Pasado"}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-2">
                  <a href={`/eventos/${ev.slug}`} target="_blank" rel="noreferrer" className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:text-white" title="Ver en el sitio">
                    <ExternalLink size={15} />
                  </a>
                  <Link href={`/admin/eventos/${ev.slug}`} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:text-white" aria-label="Editar">
                    <Pencil size={15} />
                  </Link>
                  <button onClick={() => remove(ev)} disabled={busy === ev.slug} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:border-seal/50 hover:text-seal" aria-label="Eliminar">
                    {busy === ev.slug ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
