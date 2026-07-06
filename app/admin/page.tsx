import type { Metadata } from "next";
import {
  CalendarDays, Users, Star, DollarSign, TrendingUp, MessageSquare, ArrowUpRight,
} from "lucide-react";
import { ReservasChart, VentasChart } from "@/components/admin/DashboardCharts";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  robots: { index: false },
};

const stats = [
  { label: "Reservas del mes", value: "468", delta: "+14%", icon: CalendarDays },
  { label: "Usuarios activos", value: "2,340", delta: "+8%", icon: Users },
  { label: "Rating promedio", value: "4.9", delta: "+0.2", icon: Star },
  { label: "Ventas (mes)", value: "S/ 92.4k", delta: "+21%", icon: DollarSign },
  { label: "Nuevas reseñas", value: "96", delta: "+31%", icon: MessageSquare },
  { label: "Tasa ocupación", value: "87%", delta: "+5%", icon: TrendingUp },
];

const reservasRecientes = [
  { name: "Camila Rivas", people: 4, date: "18 Jul · 20:00", event: "Omakase a Ciegas", status: "Confirmada" },
  { name: "Diego Salazar", people: 2, date: "18 Jul · 20:30", event: "Omakase a Ciegas", status: "Confirmada" },
  { name: "Valeria Chang", people: 6, date: "26 Jul · 21:00", event: "Robata & Pisco", status: "Pendiente" },
  { name: "Jorge Medina", people: 2, date: "26 Jul · 21:00", event: "Robata & Pisco", status: "Confirmada" },
  { name: "Rosa Núñez", people: 3, date: "27 Jul · 20:00", event: "Reserva general", status: "Pendiente" },
];

const topDishes = [
  { name: "Maki Acevichado", orders: 142, pct: 92 },
  { name: "Nigiri de Toro", orders: 118, pct: 76 },
  { name: "Robata de Pulpo", orders: 97, pct: 63 },
  { name: "Tiradito Doko", orders: 84, pct: 54 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-[1.9rem] font-semibold">Dashboard</h1>
        <p className="text-[0.9rem] text-mist">Resumen general de Doko · Julio 2026</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--line)] bg-ink p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-seal/12 text-seal"><s.icon size={19} /></span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[0.72rem] font-medium text-emerald-400">
                <ArrowUpRight size={12} /> {s.delta}
              </span>
            </div>
            <div className="font-display text-[2rem] font-bold leading-none">{s.value}</div>
            <div className="mt-1.5 text-[0.82rem] text-mist">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-ink p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-[1.15rem] font-semibold">Reservas por mes</h3>
            <span className="text-[0.76rem] text-mist">Últimos 7 meses</span>
          </div>
          <ReservasChart />
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-ink p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-[1.15rem] font-semibold">Ventas por categoría</h3>
            <span className="text-[0.76rem] text-mist">% del total</span>
          </div>
          <VentasChart />
        </div>
      </div>

      {/* Tablas */}
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        {/* Reservas recientes */}
        <div className="rounded-xl border border-[var(--line)] bg-ink p-5">
          <h3 className="mb-4 font-display text-[1.15rem] font-semibold">Reservas recientes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.85rem]">
              <thead>
                <tr className="border-b border-[var(--line)] text-[0.72rem] uppercase tracking-wider text-mist-2">
                  <th className="pb-3 pr-4 font-medium">Cliente</th>
                  <th className="pb-3 pr-4 font-medium">Pers.</th>
                  <th className="pb-3 pr-4 font-medium">Fecha</th>
                  <th className="pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservasRecientes.map((r) => (
                  <tr key={r.name} className="border-b border-[var(--line)] last:border-none">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-[0.74rem] text-mist-2">{r.event}</div>
                    </td>
                    <td className="py-3 pr-4 text-mist">{r.people}</td>
                    <td className="py-3 pr-4 text-mist">{r.date}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${r.status === "Confirmada" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top platos */}
        <div className="rounded-xl border border-[var(--line)] bg-ink p-5">
          <h3 className="mb-4 font-display text-[1.15rem] font-semibold">Platos más pedidos</h3>
          <div className="space-y-4">
            {topDishes.map((d) => (
              <div key={d.name}>
                <div className="mb-1.5 flex items-center justify-between text-[0.85rem]">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-mist">{d.orders}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-seal" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
