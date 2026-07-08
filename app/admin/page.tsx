import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays, Mail, Users, MessageSquare, UtensilsCrossed, Ticket, ArrowUpRight,
} from "lucide-react";
import { tableCount, listReservations } from "@/lib/operations";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUS_CLS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  confirmed: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-seal/10 text-seal",
};
const STATUS_LABEL: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmada", cancelled: "Cancelada" };

export default async function AdminDashboard() {
  const [
    reservas, pendientes, mensajes, sinLeer, comunidad, feedback, platos, eventos,
  ] = await Promise.all([
    tableCount("reservations"),
    tableCount("reservations", (q) => q.eq("status", "pending")),
    tableCount("contact_messages"),
    tableCount("contact_messages", (q) => q.eq("read", false)),
    tableCount("profiles", (q) => q.eq("role", "user")),
    tableCount("feedback"),
    tableCount("dishes"),
    tableCount("events"),
  ]);

  let recientes: Awaited<ReturnType<typeof listReservations>> = [];
  try {
    recientes = (await listReservations()).slice(0, 6);
  } catch {
    /* tabla aún no creada */
  }

  const cards = [
    { label: "Reservas", value: reservas, sub: `${pendientes} pendientes`, icon: CalendarDays, href: "/admin/reservas" },
    { label: "Mensajes", value: mensajes, sub: `${sinLeer} sin leer`, icon: Mail, href: "/admin/mensajes" },
    { label: "Comunidad", value: comunidad, sub: "usuarios", icon: Users, href: "/admin/usuarios" },
    { label: "Feedback", value: feedback, sub: "comentarios", icon: MessageSquare, href: "/admin/comentarios" },
    { label: "Platos", value: platos, sub: "en la carta", icon: UtensilsCrossed, href: "/admin/carta" },
    { label: "Eventos", value: eventos, sub: "en agenda", icon: Ticket, href: "/admin/eventos" },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-[1.9rem] font-semibold">Dashboard</h1>
        <p className="text-[0.9rem] text-mist">Resumen general de Doko · datos en vivo</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group rounded-xl border border-[var(--line)] bg-ink p-5 transition-colors hover:border-white/20">
            <div className="mb-4 flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-seal/12 text-seal"><c.icon size={19} /></span>
              <ArrowUpRight size={16} className="text-mist-2 transition-colors group-hover:text-white" />
            </div>
            <div className="font-display text-[2rem] font-bold leading-none">{c.value}</div>
            <div className="mt-1.5 text-[0.82rem] text-mist">{c.label} <span className="text-mist-2">· {c.sub}</span></div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-ink p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-[1.15rem] font-semibold">Reservas recientes</h3>
          <Link href="/admin/reservas" className="text-[0.78rem] text-mist hover:text-white">Ver todas</Link>
        </div>
        {recientes.length === 0 ? (
          <p className="py-6 text-center text-[0.85rem] text-mist-2">Aún no hay reservas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.85rem]">
              <thead>
                <tr className="border-b border-[var(--line)] text-[0.72rem] uppercase tracking-wider text-mist-2">
                  <th className="pb-3 pr-4 font-medium">Cliente</th>
                  <th className="pb-3 pr-4 font-medium">Fecha</th>
                  <th className="pb-3 pr-4 font-medium">Pers.</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recientes.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--line)] last:border-none">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-[0.74rem] text-mist-2">{r.email}</div>
                    </td>
                    <td className="py-3 pr-4 text-mist">{r.date}{r.time ? ` · ${r.time}` : ""}</td>
                    <td className="py-3 pr-4 text-mist">{r.people}</td>
                    <td className="py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-[0.7rem] font-medium", STATUS_CLS[r.status])}>{STATUS_LABEL[r.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
