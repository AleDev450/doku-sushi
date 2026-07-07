import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getDishes } from "@/lib/api";
import { assertSectionAccess } from "@/lib/rbac";
import DishTable from "@/components/admin/DishTable";

export const metadata: Metadata = { title: "Carta · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminCartaPage() {
  await assertSectionAccess("carta", "view");
  const dishes = await getDishes();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.9rem] font-semibold">Carta</h1>
          <p className="text-[0.9rem] text-mist">{dishes.length} platos · gestiona el menú de Doko</p>
        </div>
        <Link href="/admin/carta/nuevo" className="btn btn-solid !px-5">
          <Plus size={16} /> Nuevo plato
        </Link>
      </div>

      <DishTable dishes={dishes} />
    </div>
  );
}
