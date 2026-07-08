"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, Heart, Star, ExternalLink } from "lucide-react";
import type { FeedbackAdminItem } from "@/lib/feedback";
import { cn } from "@/lib/utils";

export default function FeedbackModeration({ items }: { items: FeedbackAdminItem[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  async function remove(it: FeedbackAdminItem) {
    if (!confirm(`¿Eliminar el comentario de ${it.authorName}?`)) return;
    setBusy(it.id);
    try {
      const res = await fetch(`/api/feedback/${it.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar.");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusy(null);
    }
  }

  if (items.length === 0) {
    return <div className="rounded-xl border border-dashed border-[var(--line)] p-12 text-center text-mist">Aún no hay comentarios de la comunidad.</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((it) => {
        const url = it.targetType === "event" ? `/eventos/${it.targetSlug}` : `/experiencias/${it.targetSlug}`;
        return (
          <div key={it.id} className={cn("rounded-xl border border-[var(--line)] bg-ink p-5 transition-opacity", busy === it.id && "opacity-50")}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{it.authorName}</span>
                  <span className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={12} className={n <= it.rating ? "fill-seal text-seal" : "text-mist-2"} />)}
                  </span>
                  <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[0.7rem] text-mist-2 hover:text-white">
                    {it.targetType === "event" ? "Evento" : "Experiencia"}: {it.targetSlug} <ExternalLink size={10} />
                  </a>
                </div>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-neutral-300">{it.text}</p>
                <div className="mt-2 flex items-center gap-4 text-[0.72rem] text-mist-2">
                  <span className="inline-flex items-center gap-1"><Heart size={12} /> {it.likes}</span>
                  <span>{new Date(it.createdAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              </div>
              <button onClick={() => remove(it)} disabled={busy === it.id} className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:border-seal/50 hover:text-seal" title="Eliminar">
                {busy === it.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
