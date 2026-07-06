"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Loader2, Star } from "lucide-react";
import type { Dish } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<string, string> = {
  entradas: "Entradas", makis: "Makis", nigiris: "Nigiris", sashimis: "Sashimis",
  calientes: "Calientes", postres: "Postres", bebidas: "Bebidas",
};

export default function DishTable({ dishes }: { dishes: Dish[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function remove(dish: Dish) {
    if (!confirm(`¿Eliminar “${dish.name}”? Esta acción no se puede deshacer.`)) return;
    setBusyId(dish.id);
    try {
      const res = await fetch(`/api/dishes/${dish.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo eliminar.");
      }
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar.");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFeatured(dish: Dish) {
    setBusyId(dish.id);
    try {
      const res = await fetch(`/api/dishes/${dish.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !dish.featured }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar.");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusyId(null);
    }
  }

  if (dishes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--line)] p-12 text-center text-mist">
        No hay platos todavía. Crea el primero con “Nuevo plato”.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-ink">
      <table className="w-full min-w-[640px] text-left text-[0.86rem]">
        <thead>
          <tr className="border-b border-[var(--line)] text-[0.72rem] uppercase tracking-wider text-mist-2">
            <th className="px-5 py-3 font-medium">Plato</th>
            <th className="px-3 py-3 font-medium">Categoría</th>
            <th className="px-3 py-3 font-medium">Precio</th>
            <th className="px-3 py-3 font-medium">Destacado</th>
            <th className="px-5 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((d) => (
            <tr key={d.id} className={cn("border-b border-[var(--line)] last:border-none transition-opacity", busyId === d.id && "opacity-50")}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-ink-3">
                    {d.image && <Image src={d.image} alt="" fill sizes="44px" className="object-cover" />}
                  </span>
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="line-clamp-1 max-w-[280px] text-[0.76rem] text-mist-2">{d.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-mist">{CATEGORY_LABEL[d.category] ?? d.category}</td>
              <td className="px-3 py-3 font-medium">{d.price}</td>
              <td className="px-3 py-3">
                <button
                  onClick={() => toggleFeatured(d)}
                  disabled={busyId === d.id}
                  aria-label={d.featured ? "Quitar de destacados" : "Marcar como destacado"}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-md border transition-colors",
                    d.featured ? "border-seal/40 bg-seal/10 text-seal" : "border-[var(--line)] text-mist-2 hover:text-white"
                  )}
                >
                  <Star size={15} className={d.featured ? "fill-seal" : ""} />
                </button>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/carta/${d.id}`} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:text-white" aria-label="Editar">
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => remove(d)}
                    disabled={busyId === d.id}
                    className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:border-seal/50 hover:text-seal"
                    aria-label="Eliminar"
                  >
                    {busyId === d.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
