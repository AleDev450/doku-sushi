"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import type { Dish, MenuCategory } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";

const CATEGORIES: { key: MenuCategory; label: string }[] = [
  { key: "entradas", label: "Entradas" },
  { key: "makis", label: "Makis" },
  { key: "nigiris", label: "Nigiris" },
  { key: "sashimis", label: "Sashimis" },
  { key: "calientes", label: "Platos calientes" },
  { key: "postres", label: "Postres" },
  { key: "bebidas", label: "Bebidas" },
];

export default function DishForm({ initial }: { initial?: Dish }) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [category, setCategory] = useState<MenuCategory>(initial?.category ?? "entradas");
  const [image, setImage] = useState(initial?.image ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = { name, description, price, category, image, featured };
      const res = await fetch(editing ? `/api/dishes/${initial!.id}` : "/api/dishes", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      router.push("/admin/carta");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-7">
      <div>
        <Link href="/admin/carta" className="mb-4 inline-flex items-center gap-1.5 text-[0.82rem] text-mist hover:text-white">
          <ArrowLeft size={15} /> Volver a la carta
        </Link>
        <h1 className="font-display text-[1.9rem] font-semibold">
          {editing ? "Editar plato" : "Nuevo plato"}
        </h1>
        <p className="text-[0.9rem] text-mist">
          {editing ? `Editando “${initial!.name}”` : "Añade un plato a la carta de Doko."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        {/* Columna izquierda: campos */}
        <div className="space-y-5">
          <div>
            <label className="field-label" htmlFor="name">Nombre *</label>
            <input id="name" className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Maki Acevichado" required />
          </div>

          <div>
            <label className="field-label" htmlFor="description">Descripción</label>
            <textarea id="description" rows={3} className="field-input resize-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Langostino tempura, palta, salsa acevichada…" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label" htmlFor="price">Precio *</label>
              <input id="price" className="field-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="S/ 54" required />
            </div>
            <div>
              <label className="field-label" htmlFor="category">Categoría *</label>
              <select id="category" className="field-input" value={category} onChange={(e) => setCategory(e.target.value as MenuCategory)}>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-md border border-[var(--line)] bg-ink px-4 py-3">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-seal" />
            <span className="text-[0.88rem]">Destacado <span className="text-mist-2">· aparece en la home</span></span>
          </label>
        </div>

        {/* Columna derecha: imagen */}
        <ImageUploader value={image} onChange={setImage} label="Foto del plato" />
      </div>

      {error && (
        <p className="rounded-md border border-seal/40 bg-seal/10 px-4 py-3 text-[0.85rem] text-seal">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn btn-solid !px-6 disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {editing ? "Guardar cambios" : "Crear plato"}
        </button>
        <Link href="/admin/carta" className="btn btn-ghost !px-6">Cancelar</Link>
      </div>
    </form>
  );
}
