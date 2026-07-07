"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import type { GalleryImage, GalleryFilter } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";

const FILTERS: { key: GalleryFilter; label: string }[] = [
  { key: "comida", label: "Comida" },
  { key: "eventos", label: "Eventos" },
  { key: "clientes", label: "Clientes" },
  { key: "chef", label: "Chef" },
  { key: "restaurante", label: "Restaurante" },
];

export default function GalleryForm({ initial }: { initial?: GalleryImage }) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [image, setImage] = useState(initial?.src ?? "");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [filter, setFilter] = useState<GalleryFilter>(initial?.filter ?? "comida");
  const [span, setSpan] = useState<"" | "tall" | "wide">(initial?.span ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = { src: image, full: image, caption, filter, span: span || undefined };
      const res = await fetch(editing ? `/api/gallery/${initial!.id}` : "/api/gallery", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      router.push("/admin/galeria");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/galeria" className="mb-4 inline-flex items-center gap-1.5 text-[0.82rem] text-mist hover:text-white">
          <ArrowLeft size={15} /> Volver a la galería
        </Link>
        <h1 className="font-display text-[1.9rem] font-semibold">{editing ? "Editar imagen" : "Nueva imagen"}</h1>
      </div>

      <ImageUploader value={image} onChange={setImage} label="Imagen *" />

      <div>
        <label className="field-label" htmlFor="caption">Descripción</label>
        <input id="caption" className="field-input" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Nigiri de toro" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label" htmlFor="filter">Categoría</label>
          <select id="filter" className="field-input" value={filter} onChange={(e) => setFilter(e.target.value as GalleryFilter)}>
            {FILTERS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="span">Tamaño en el mosaico</label>
          <select id="span" className="field-input" value={span} onChange={(e) => setSpan(e.target.value as "" | "tall" | "wide")}>
            <option value="">Normal</option>
            <option value="tall">Alta (vertical)</option>
            <option value="wide">Ancha (horizontal)</option>
          </select>
        </div>
      </div>

      {error && <p className="rounded-md border border-seal/40 bg-seal/10 px-4 py-3 text-[0.85rem] text-seal">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn btn-solid !px-6 disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {editing ? "Guardar cambios" : "Añadir imagen"}
        </button>
        <Link href="/admin/galeria" className="btn btn-ghost !px-6">Cancelar</Link>
      </div>
    </form>
  );
}
