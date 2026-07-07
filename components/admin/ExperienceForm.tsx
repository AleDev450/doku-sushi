"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import type { ExperienceDetail } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";
import RepeatableList from "@/components/admin/RepeatableList";

type AlbumItem = ExperienceDetail["album"][number];
type Comment = ExperienceDetail["topComments"][number];

export default function ExperienceForm({ initial }: { initial?: ExperienceDetail }) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [eventTitle, setEventTitle] = useState(initial?.eventTitle ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [rating, setRating] = useState(String(initial?.rating ?? 5));
  const [reviews, setReviews] = useState(String(initial?.reviews ?? 0));
  const [attendees, setAttendees] = useState(String(initial?.attendees ?? 0));
  const [photos, setPhotos] = useState(String(initial?.photos ?? 0));
  const [videos, setVideos] = useState(String(initial?.videos ?? 0));
  const [story, setStory] = useState(initial?.story ?? "");
  const [album, setAlbum] = useState<AlbumItem[]>(initial?.album ?? []);
  const [comments, setComments] = useState<Comment[]>(initial?.topComments ?? []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        eventTitle,
        slug: slug.trim() || undefined,
        date,
        cover,
        rating: Number(rating) || 0,
        reviews: Number(reviews) || 0,
        attendees: Number(attendees) || 0,
        photos: Number(photos) || 0,
        videos: Number(videos) || 0,
        story,
        album: album.map((a, i) => ({ ...a, id: i + 1 })),
        topComments: comments.map((c, i) => ({ ...c, id: i + 1, rating: Number(c.rating) || 5, likes: Number(c.likes) || 0 })),
      };
      const res = await fetch(editing ? `/api/experiences/${initial!.slug}` : "/api/experiences", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      router.push("/admin/experiencias");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/experiencias" className="mb-4 inline-flex items-center gap-1.5 text-[0.82rem] text-mist hover:text-white">
          <ArrowLeft size={15} /> Volver a experiencias
        </Link>
        <h1 className="font-display text-[1.9rem] font-semibold">{editing ? "Editar experiencia" : "Nueva experiencia"}</h1>
        <p className="text-[0.9rem] text-mist">{editing ? `Editando “${initial!.eventTitle}”` : "El álbum vivo de un evento pasado."}</p>
      </div>

      <Section title="Datos principales">
        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <Field label="Título del evento *"><input className="field-input" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required /></Field>
            <Field label="Slug (URL)" hint={`Vacío = se genera del título. /experiencias/${slug || "mi-experiencia"}`}>
              <input className="field-input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="sushi-sunset-vol-4" />
            </Field>
            <Field label="Fecha (texto)" hint="Ej: 21 de junio, 2026"><input className="field-input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
            <Field label="Historia"><textarea rows={4} className="field-input resize-y" value={story} onChange={(e) => setStory(e.target.value)} /></Field>
          </div>
          <ImageUploader value={cover} onChange={setCover} label="Portada" />
        </div>
      </Section>

      <Section title="Métricas">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Field label="Rating"><input type="number" step="0.1" min={0} max={5} className="field-input" value={rating} onChange={(e) => setRating(e.target.value)} /></Field>
          <Field label="Reseñas"><input type="number" min={0} className="field-input" value={reviews} onChange={(e) => setReviews(e.target.value)} /></Field>
          <Field label="Asistentes"><input type="number" min={0} className="field-input" value={attendees} onChange={(e) => setAttendees(e.target.value)} /></Field>
          <Field label="Fotos"><input type="number" min={0} className="field-input" value={photos} onChange={(e) => setPhotos(e.target.value)} /></Field>
          <Field label="Videos"><input type="number" min={0} className="field-input" value={videos} onChange={(e) => setVideos(e.target.value)} /></Field>
        </div>
      </Section>

      <Section title="Álbum">
        <RepeatableList<AlbumItem>
          items={album} onChange={setAlbum} addLabel="Añadir al álbum" empty="Álbum vacío."
          newItem={() => ({ id: 0, src: "", full: "", isVideo: false })}
          render={(it, set) => (
            <div className="space-y-2">
              <ImageUploader value={it.src} onChange={(v) => set({ ...it, src: v, full: v })} label="" />
              <label className="flex items-center gap-2 text-[0.82rem]">
                <input type="checkbox" checked={Boolean(it.isVideo)} onChange={(e) => set({ ...it, isVideo: e.target.checked })} className="h-4 w-4 accent-seal" />
                Es video
              </label>
            </div>
          )}
        />
      </Section>

      <Section title="Comentarios destacados">
        <RepeatableList<Comment>
          items={comments} onChange={setComments} addLabel="Añadir comentario" empty="Sin comentarios."
          newItem={() => ({ id: 0, name: "", avatar: "", rating: 5, text: "", likes: 0 })}
          render={(it, set) => (
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <input className="field-input" placeholder="Nombre" value={it.name} onChange={(e) => set({ ...it, name: e.target.value })} />
                <input className="field-input" placeholder="URL del avatar" value={it.avatar} onChange={(e) => set({ ...it, avatar: e.target.value })} />
              </div>
              <textarea rows={2} className="field-input resize-none" placeholder="Comentario" value={it.text} onChange={(e) => set({ ...it, text: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" min={0} max={5} step="0.1" className="field-input" placeholder="Rating" value={it.rating} onChange={(e) => set({ ...it, rating: Number(e.target.value) })} />
                <input type="number" min={0} className="field-input" placeholder="Likes" value={it.likes} onChange={(e) => set({ ...it, likes: Number(e.target.value) })} />
              </div>
            </div>
          )}
        />
      </Section>

      {error && <p className="rounded-md border border-seal/40 bg-seal/10 px-4 py-3 text-[0.85rem] text-seal">{error}</p>}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-ink/90 p-3 backdrop-blur">
        <button type="submit" disabled={saving} className="btn btn-solid !px-6 disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {editing ? "Guardar cambios" : "Crear experiencia"}
        </button>
        <Link href="/admin/experiencias" className="btn btn-ghost !px-6">Cancelar</Link>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--line)] bg-ink-2 p-5">
      <h2 className="mb-4 font-display text-[1.1rem] font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="field-label">{label}</span>
      {children}
      {hint && <p className="mt-1.5 text-[0.72rem] text-mist-2">{hint}</p>}
    </div>
  );
}
