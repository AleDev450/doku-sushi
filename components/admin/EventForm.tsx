"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import type { EventDetail } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";
import RepeatableList from "@/components/admin/RepeatableList";

type Schedule = EventDetail["schedule"][number];
type Video = EventDetail["videos"][number];
type Attendee = EventDetail["attendeesPreview"][number];
type SpecialMenu = EventDetail["specialMenu"][number];

export default function EventForm({ initial }: { initial?: EventDetail }) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [startsAt, setStartsAt] = useState(initial?.startsAt ? initial.startsAt.slice(0, 16) : "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [status, setStatus] = useState<EventDetail["status"]>(initial?.status ?? "upcoming");
  const [attendeesCount, setAttendeesCount] = useState(String(initial?.attendeesCount ?? 0));
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [fullDescription, setFullDescription] = useState(initial?.fullDescription ?? "");

  const [schedule, setSchedule] = useState<Schedule[]>(initial?.schedule ?? []);
  const [specialMenu, setSpecialMenu] = useState<SpecialMenu[]>(initial?.specialMenu ?? []);
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [videos, setVideos] = useState<Video[]>(initial?.videos ?? []);
  const [attendees, setAttendees] = useState<Attendee[]>(initial?.attendeesPreview ?? []);

  const [hasChef, setHasChef] = useState(Boolean(initial?.guestChef));
  const [chef, setChef] = useState(initial?.guestChef ?? { name: "", role: "", photo: "", bio: "" });

  const [map, setMap] = useState(initial?.map ?? { lat: 0, lng: 0, address: "" });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        title,
        slug: slug.trim() || undefined,
        startsAt,
        location,
        status,
        attendeesCount: Number(attendeesCount) || 0,
        shortDescription,
        cover,
        fullDescription,
        schedule,
        specialMenu,
        gallery,
        videos,
        attendeesPreview: attendees.map((a, i) => ({ ...a, id: i + 1 })),
        guestChef: hasChef ? chef : null,
        map,
      };
      const res = await fetch(editing ? `/api/events/${initial!.slug}` : "/api/events", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      router.push("/admin/eventos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/eventos" className="mb-4 inline-flex items-center gap-1.5 text-[0.82rem] text-mist hover:text-white">
          <ArrowLeft size={15} /> Volver a eventos
        </Link>
        <h1 className="font-display text-[1.9rem] font-semibold">{editing ? "Editar evento" : "Nuevo evento"}</h1>
        <p className="text-[0.9rem] text-mist">{editing ? `Editando “${initial!.title}”` : "Crea un evento de la agenda."}</p>
      </div>

      {/* Básico */}
      <Section title="Datos principales">
        <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <Field label="Título *"><input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} required /></Field>
            <Field label="Slug (URL)" hint={`Vacío = se genera del título. /eventos/${slug || "mi-evento"}`}>
              <input className="field-input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="omakase-a-ciegas" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Fecha y hora *"><input type="datetime-local" className="field-input" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required /></Field>
              <Field label="Estado">
                <select className="field-input" value={status} onChange={(e) => setStatus(e.target.value as EventDetail["status"])}>
                  <option value="upcoming">Próximo</option>
                  <option value="past">Pasado</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Lugar"><input className="field-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Barra principal" /></Field>
              <Field label="Aforo / asistentes"><input type="number" min={0} className="field-input" value={attendeesCount} onChange={(e) => setAttendeesCount(e.target.value)} /></Field>
            </div>
            <Field label="Descripción corta"><textarea rows={2} className="field-input resize-none" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} /></Field>
          </div>
          <ImageUploader value={cover} onChange={setCover} label="Portada" />
        </div>
      </Section>

      <Section title="Descripción completa">
        <textarea rows={6} className="field-input resize-y" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} placeholder="Detalle de la experiencia…" />
      </Section>

      {/* Cronograma */}
      <Section title="Cronograma">
        <RepeatableList<Schedule>
          items={schedule} onChange={setSchedule} addLabel="Añadir momento" empty="Sin momentos aún."
          newItem={() => ({ time: "", title: "", detail: "" })}
          render={(it, set) => (
            <div className="grid gap-2 sm:grid-cols-[100px_1fr]">
              <input className="field-input" placeholder="20:00" value={it.time} onChange={(e) => set({ ...it, time: e.target.value })} />
              <input className="field-input" placeholder="Título" value={it.title} onChange={(e) => set({ ...it, title: e.target.value })} />
              <input className="field-input sm:col-span-2" placeholder="Detalle (opcional)" value={it.detail ?? ""} onChange={(e) => set({ ...it, detail: e.target.value })} />
            </div>
          )}
        />
      </Section>

      {/* Menú especial */}
      <Section title="Menú especial">
        <RepeatableList<SpecialMenu>
          items={specialMenu} onChange={setSpecialMenu} addLabel="Añadir plato" empty="Sin platos especiales."
          newItem={() => ({ name: "", description: "" })}
          render={(it, set) => (
            <div className="space-y-2">
              <input className="field-input" placeholder="Nombre del plato" value={it.name} onChange={(e) => set({ ...it, name: e.target.value })} />
              <input className="field-input" placeholder="Descripción" value={it.description} onChange={(e) => set({ ...it, description: e.target.value })} />
            </div>
          )}
        />
      </Section>

      {/* Chef invitado */}
      <Section title="Chef invitado">
        <label className="mb-4 flex cursor-pointer items-center gap-3 text-[0.88rem]">
          <input type="checkbox" checked={hasChef} onChange={(e) => setHasChef(e.target.checked)} className="h-4 w-4 accent-seal" />
          Este evento tiene chef invitado
        </label>
        {hasChef && (
          <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
            <ImageUploader value={chef.photo} onChange={(v) => setChef({ ...chef, photo: v })} label="Foto del chef" />
            <div className="space-y-4">
              <Field label="Nombre"><input className="field-input" value={chef.name} onChange={(e) => setChef({ ...chef, name: e.target.value })} /></Field>
              <Field label="Rol"><input className="field-input" value={chef.role} onChange={(e) => setChef({ ...chef, role: e.target.value })} placeholder="Chef · Itamae" /></Field>
              <Field label="Bio"><textarea rows={3} className="field-input resize-none" value={chef.bio} onChange={(e) => setChef({ ...chef, bio: e.target.value })} /></Field>
            </div>
          </div>
        )}
      </Section>

      {/* Galería */}
      <Section title="Galería">
        <RepeatableList<string>
          items={gallery} onChange={setGallery} addLabel="Añadir imagen" empty="Sin imágenes."
          newItem={() => ""}
          render={(it, set) => <ImageUploader value={it} onChange={set} label="" />}
        />
      </Section>

      {/* Videos */}
      <Section title="Videos">
        <RepeatableList<Video>
          items={videos} onChange={setVideos} addLabel="Añadir video" empty="Sin videos."
          newItem={() => ({ thumbnail: "", url: "" })}
          render={(it, set) => (
            <div className="space-y-2">
              <ImageUploader value={it.thumbnail} onChange={(v) => set({ ...it, thumbnail: v })} label="Miniatura" />
              <input className="field-input" placeholder="URL del video (YouTube, etc.)" value={it.url} onChange={(e) => set({ ...it, url: e.target.value })} />
            </div>
          )}
        />
      </Section>

      {/* Asistentes destacados */}
      <Section title="Asistentes destacados (avatares)">
        <RepeatableList<Attendee>
          items={attendees} onChange={setAttendees} addLabel="Añadir asistente" empty="Sin asistentes destacados."
          newItem={() => ({ id: 0, name: "", avatar: "" })}
          render={(it, set) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="field-input" placeholder="Nombre" value={it.name} onChange={(e) => set({ ...it, name: e.target.value })} />
              <input className="field-input" placeholder="URL del avatar" value={it.avatar} onChange={(e) => set({ ...it, avatar: e.target.value })} />
            </div>
          )}
        />
      </Section>

      {/* Ubicación */}
      <Section title="Ubicación (mapa)">
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_2fr]">
          <Field label="Latitud"><input type="number" step="any" className="field-input" value={map.lat} onChange={(e) => setMap({ ...map, lat: Number(e.target.value) })} /></Field>
          <Field label="Longitud"><input type="number" step="any" className="field-input" value={map.lng} onChange={(e) => setMap({ ...map, lng: Number(e.target.value) })} /></Field>
          <Field label="Dirección"><input className="field-input" value={map.address} onChange={(e) => setMap({ ...map, address: e.target.value })} /></Field>
        </div>
      </Section>

      {error && <p className="rounded-md border border-seal/40 bg-seal/10 px-4 py-3 text-[0.85rem] text-seal">{error}</p>}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-ink/90 p-3 backdrop-blur">
        <button type="submit" disabled={saving} className="btn btn-solid !px-6 disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {editing ? "Guardar cambios" : "Crear evento"}
        </button>
        <Link href="/admin/eventos" className="btn btn-ghost !px-6">Cancelar</Link>
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
