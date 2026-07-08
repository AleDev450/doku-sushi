"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Loader2, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function TestimonialTable({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  async function remove(t: Testimonial) {
    if (!confirm(`¿Eliminar el testimonio de ${t.name}?`)) return;
    setBusy(t.id);
    try {
      const res = await fetch(`/api/testimonials/${t.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar.");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusy(null);
    }
  }

  if (testimonials.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--line)] p-12 text-center text-mist">
        Aún no hay testimonios. Crea el primero.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-ink">
      <table className="w-full min-w-[640px] text-left text-[0.86rem]">
        <thead>
          <tr className="border-b border-[var(--line)] text-[0.72rem] uppercase tracking-wider text-mist-2">
            <th className="px-5 py-3 font-medium">Persona</th>
            <th className="px-3 py-3 font-medium">Rating</th>
            <th className="px-3 py-3 font-medium">Cita</th>
            <th className="px-5 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <tr key={t.id} className={cn("border-b border-[var(--line)] last:border-none transition-opacity", busy === t.id && "opacity-50")}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-ink-3">
                    {t.avatar && <Image src={t.avatar} alt="" fill sizes="40px" className="object-cover" />}
                  </span>
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-[0.76rem] text-mist-2">{t.role}</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={13} className={n <= Math.round(t.rating) ? "fill-seal text-seal" : "text-mist-2"} />
                  ))}
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="line-clamp-1 max-w-[320px] text-mist">{t.quote}</div>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/testimonios/${t.id}`} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:text-white" aria-label="Editar">
                    <Pencil size={15} />
                  </Link>
                  <button onClick={() => remove(t)} disabled={busy === t.id} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:border-seal/50 hover:text-seal" aria-label="Eliminar">
                    {busy === t.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
