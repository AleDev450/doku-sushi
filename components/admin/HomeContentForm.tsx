"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type { HomeHero, HomeAbout } from "@/lib/content";
import ImageUploader from "@/components/admin/ImageUploader";
import RepeatableList from "@/components/admin/RepeatableList";

export default function HomeContentForm({
  initialHero,
  initialAbout,
}: {
  initialHero: HomeHero;
  initialAbout: HomeAbout;
}) {
  const router = useRouter();
  const [hero, setHero] = useState<HomeHero>(initialHero);
  const [about, setAbout] = useState<HomeAbout>(initialAbout);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setSaving(true);
    try {
      for (const [key, data] of [["home_hero", hero], ["home_about", about]] as const) {
        const res = await fetch(`/api/content/${key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || "No se pudo guardar.");
        }
      }
      setMsg("Guardado ✓ (recarga la home para ver los cambios)");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    } finally {
      setSaving(false);
    }
  }

  const h = (k: keyof HomeHero) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setHero({ ...hero, [k]: e.target.value });
  const a = (k: keyof HomeAbout) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setAbout({ ...about, [k]: e.target.value });

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      {/* HERO */}
      <Section title="Portada (Hero)" hint="Lo primero que se ve. Imágenes horizontales 1920×1080.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kicker (etiqueta)"><input className="field-input" value={hero.kicker} onChange={h("kicker")} /></Field>
          <Field label="Palabra destacada (en rojo)"><input className="field-input" value={hero.highlight} onChange={h("highlight")} /></Field>
        </div>
        <Field label="Titular"><input className="field-input" value={hero.headline} onChange={h("headline")} /></Field>
        <Field label="Subtítulo"><textarea rows={2} className="field-input resize-none" value={hero.subtitle} onChange={h("subtitle")} /></Field>
        <div>
          <span className="field-label">Imágenes rotativas</span>
          <RepeatableList<HeroSlideT>
            items={hero.slides} onChange={(slides) => setHero({ ...hero, slides })}
            addLabel="Añadir imagen" empty="Sin imágenes."
            newItem={() => ({ img: "", cap: "" })}
            render={(it, set) => (
              <div className="space-y-2">
                <ImageUploader value={it.img} onChange={(v) => set({ ...it, img: v })} label="" />
                <input className="field-input" placeholder="Leyenda (ej. Omakase — Barra principal)" value={it.cap} onChange={(e) => set({ ...it, cap: e.target.value })} />
              </div>
            )}
          />
        </div>
      </Section>

      {/* ABOUT */}
      <Section title="Bloque «Nuestra historia»" hint="La sección clara de la home. Retrato 1000×1250 y cuadrada 800×800.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kicker"><input className="field-input" value={about.kicker} onChange={a("kicker")} /></Field>
          <Field label="Palabra destacada (en rojo)"><input className="field-input" value={about.highlight} onChange={a("highlight")} /></Field>
        </div>
        <Field label="Título"><input className="field-input" value={about.title} onChange={a("title")} /></Field>
        <Field label="Párrafo 1"><textarea rows={3} className="field-input resize-none" value={about.paragraph1} onChange={a("paragraph1")} /></Field>
        <Field label="Párrafo 2"><textarea rows={3} className="field-input resize-none" value={about.paragraph2} onChange={a("paragraph2")} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploader value={about.image1} onChange={(v) => setAbout({ ...about, image1: v })} label="Imagen principal (retrato)" />
          <ImageUploader value={about.image2} onChange={(v) => setAbout({ ...about, image2: v })} label="Imagen secundaria (cuadrada)" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nombre del chef"><input className="field-input" value={about.chefName} onChange={a("chefName")} /></Field>
          <Field label="Rol del chef"><input className="field-input" value={about.chefRole} onChange={a("chefRole")} /></Field>
          <Field label="Texto del enlace"><input className="field-input" value={about.ctaLabel} onChange={a("ctaLabel")} /></Field>
        </div>
      </Section>

      {error && <p className="rounded-md border border-seal/40 bg-seal/10 px-4 py-3 text-[0.85rem] text-seal">{error}</p>}
      {msg && <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-[0.85rem] text-emerald-400">{msg}</p>}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-ink/90 p-3 backdrop-blur">
        <button type="submit" disabled={saving} className="btn btn-solid !px-6 disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar cambios
        </button>
      </div>
    </form>
  );
}

type HeroSlideT = HomeHero["slides"][number];

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-[var(--line)] bg-ink-2 p-5">
      <div>
        <h2 className="font-display text-[1.15rem] font-semibold">{title}</h2>
        {hint && <p className="text-[0.8rem] text-mist">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="field-label">{label}</span>
      {children}
    </div>
  );
}
