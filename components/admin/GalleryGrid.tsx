"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTER_LABEL: Record<string, string> = {
  comida: "Comida", eventos: "Eventos", clientes: "Clientes", chef: "Chef", restaurante: "Restaurante",
};

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  async function remove(img: GalleryImage) {
    if (!confirm("¿Eliminar esta imagen? No se puede deshacer.")) return;
    setBusy(img.id);
    try {
      const res = await fetch(`/api/gallery/${img.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar.");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusy(null);
    }
  }

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--line)] p-12 text-center text-mist">
        La galería está vacía. Añade la primera imagen.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((img) => (
        <div key={img.id} className={cn("group relative overflow-hidden rounded-lg border border-[var(--line)] bg-ink", busy === img.id && "opacity-50")}>
          <div className="relative aspect-square">
            {img.src && <Image src={img.src} alt={img.caption} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Link href={`/admin/galeria/${img.id}`} className="grid h-8 w-8 place-items-center rounded-md bg-black/60 text-white backdrop-blur hover:bg-black/80" aria-label="Editar">
                <Pencil size={14} />
              </Link>
              <button onClick={() => remove(img)} disabled={busy === img.id} className="grid h-8 w-8 place-items-center rounded-md bg-black/60 text-white backdrop-blur hover:bg-seal" aria-label="Eliminar">
                {busy === img.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          </div>
          <div className="p-2.5">
            <div className="truncate text-[0.8rem] font-medium">{img.caption || "Sin descripción"}</div>
            <div className="mt-0.5 text-[0.68rem] uppercase tracking-wider text-mist-2">{FILTER_LABEL[img.filter] ?? img.filter}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
