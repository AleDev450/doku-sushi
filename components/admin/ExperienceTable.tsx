"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Loader2, ExternalLink, Star, Camera } from "lucide-react";
import type { ExperienceSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ExperienceTable({ experiences }: { experiences: ExperienceSummary[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(x: ExperienceSummary) {
    if (!confirm(`¿Eliminar “${x.eventTitle}”? No se puede deshacer.`)) return;
    setBusy(x.slug);
    try {
      const res = await fetch(`/api/experiences/${x.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar.");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusy(null);
    }
  }

  if (experiences.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--line)] p-12 text-center text-mist">
        Aún no hay experiencias. Crea la primera con “Nueva experiencia”.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-ink">
      <table className="w-full min-w-[640px] text-left text-[0.86rem]">
        <thead>
          <tr className="border-b border-[var(--line)] text-[0.72rem] uppercase tracking-wider text-mist-2">
            <th className="px-5 py-3 font-medium">Experiencia</th>
            <th className="px-3 py-3 font-medium">Fecha</th>
            <th className="px-3 py-3 font-medium">Métricas</th>
            <th className="px-5 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {experiences.map((x) => (
            <tr key={x.slug} className={cn("border-b border-[var(--line)] last:border-none transition-opacity", busy === x.slug && "opacity-50")}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-ink-3">
                    {x.cover && <Image src={x.cover} alt="" fill sizes="64px" className="object-cover" />}
                  </span>
                  <div className="font-medium">{x.eventTitle}</div>
                </div>
              </td>
              <td className="px-3 py-3 text-mist">{x.date || "—"}</td>
              <td className="px-3 py-3 text-mist">
                <span className="inline-flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><Star size={13} className="text-seal" /> {x.rating}</span>
                  <span className="inline-flex items-center gap-1"><Camera size={13} /> {x.photos}</span>
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-2">
                  <a href={`/experiencias/${x.slug}`} target="_blank" rel="noreferrer" className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:text-white" title="Ver en el sitio">
                    <ExternalLink size={15} />
                  </a>
                  <Link href={`/admin/experiencias/${x.slug}`} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:text-white" aria-label="Editar">
                    <Pencil size={15} />
                  </Link>
                  <button onClick={() => remove(x)} disabled={busy === x.slug} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:border-seal/50 hover:text-seal" aria-label="Eliminar">
                    {busy === x.slug ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
