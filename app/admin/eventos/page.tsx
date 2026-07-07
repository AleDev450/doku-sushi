import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getEvents } from "@/lib/api";
import { assertSectionAccess } from "@/lib/rbac";
import EventTable from "@/components/admin/EventTable";

export const metadata: Metadata = { title: "Eventos · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminEventosPage() {
  await assertSectionAccess("eventos", "view");
  const events = await getEvents();
  const upcoming = events.filter((e) => e.status === "upcoming").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.9rem] font-semibold">Eventos</h1>
          <p className="text-[0.9rem] text-mist">{events.length} eventos · {upcoming} próximos</p>
        </div>
        <Link href="/admin/eventos/nuevo" className="btn btn-solid !px-5">
          <Plus size={16} /> Nuevo evento
        </Link>
      </div>

      <EventTable events={events} />
    </div>
  );
}
