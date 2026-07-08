"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, ArrowLeft, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";
import { cn } from "@/lib/utils";

export default function TestimonialForm({ initial }: { initial?: Testimonial }) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [avatar, setAvatar] = useState(initial?.avatar ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [hover, setHover] = useState(0);
  const [quote, setQuote] = useState(initial?.quote ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = { name, role, avatar, rating, quote };
      const res = await fetch(editing ? `/api/testimonials/${initial!.id}` : "/api/testimonials", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      router.push("/admin/testimonios");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/testimonios" className="mb-4 inline-flex items-center gap-1.5 text-[0.82rem] text-mist hover:text-white">
          <ArrowLeft size={15} /> Volver a testimonios
        </Link>
        <h1 className="font-display text-[1.9rem] font-semibold">{editing ? "Editar testimonio" : "Nuevo testimonio"}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
        <ImageUploader value={avatar} onChange={setAvatar} label="Avatar" />
        <div className="space-y-5">
          <div>
            <label className="field-label" htmlFor="name">Nombre *</label>
            <input id="name" className="field-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="field-label" htmlFor="role">Rol / descripción</label>
            <input id="role" className="field-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Cliente frecuente" />
          </div>
          <div>
            <span className="field-label">Calificación</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)} aria-label={`${n} estrellas`}>
                  <Star size={22} className={cn("transition-colors", (hover || rating) >= n ? "fill-seal text-seal" : "text-mist-2")} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="quote">Cita *</label>
        <textarea id="quote" rows={3} className="field-input resize-none" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Una experiencia inolvidable…" required />
      </div>

      {error && <p className="rounded-md border border-seal/40 bg-seal/10 px-4 py-3 text-[0.85rem] text-seal">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn btn-solid !px-6 disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {editing ? "Guardar cambios" : "Crear testimonio"}
        </button>
        <Link href="/admin/testimonios" className="btn btn-ghost !px-6">Cancelar</Link>
      </div>
    </form>
  );
}
