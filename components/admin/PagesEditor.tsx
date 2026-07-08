"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type {
  HomeHero, HomeAbout, HomeSections, HomeReserva, HomeMarquee, PageHeaders, AboutPage,
} from "@/lib/content";
import ImageUploader from "@/components/admin/ImageUploader";
import RepeatableList from "@/components/admin/RepeatableList";
import HeaderFields from "@/components/admin/HeaderFields";
import { cn } from "@/lib/utils";

type Blocks = {
  hero: HomeHero; about: HomeAbout; sections: HomeSections; reserva: HomeReserva;
  marquee: HomeMarquee; headers: PageHeaders; aboutPage: AboutPage;
};

const TABS = [
  { key: "home", label: "Home" },
  { key: "headers", label: "Encabezados" },
  { key: "nosotros", label: "Nosotros" },
] as const;

export default function PagesEditor({ initial }: { initial: Blocks }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("home");
  const [b, setB] = useState<Blocks>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function upd<K extends keyof Blocks>(k: K, v: Blocks[K]) {
    setB((prev) => ({ ...prev, [k]: v }));
  }

  async function save(entries: [string, object][]) {
    setError(null);
    setMsg(null);
    setSaving(true);
    try {
      for (const [key, data] of entries) {
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
      setMsg("Guardado ✓ (recarga la página pública para verlo)");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error.");
    } finally {
      setSaving(false);
    }
  }

  const a = b.aboutPage;
  const setA = (k: keyof AboutPage) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    upd("aboutPage", { ...a, [k]: e.target.value });

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-[var(--line)] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setMsg(null); setError(null); }}
            className={cn("flex-1 rounded-md px-4 py-2 text-[0.85rem] font-medium transition-colors", tab === t.key ? "bg-seal/15 text-seal" : "text-mist hover:text-white")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* HOME */}
      {tab === "home" && (
        <div className="space-y-5">
          <Card title="Portada (Hero)" hint="Imágenes horizontales 1920×1080.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Text label="Etiqueta" value={b.hero.kicker} onChange={(v) => upd("hero", { ...b.hero, kicker: v })} />
              <Text label="Palabra destacada" value={b.hero.highlight} onChange={(v) => upd("hero", { ...b.hero, highlight: v })} />
            </div>
            <Text label="Titular" value={b.hero.headline} onChange={(v) => upd("hero", { ...b.hero, headline: v })} />
            <Area label="Subtítulo" value={b.hero.subtitle} onChange={(v) => upd("hero", { ...b.hero, subtitle: v })} />
            <div>
              <span className="field-label">Imágenes rotativas</span>
              <RepeatableList<HomeHero["slides"][number]>
                items={b.hero.slides} onChange={(slides) => upd("hero", { ...b.hero, slides })}
                addLabel="Añadir imagen" newItem={() => ({ img: "", cap: "" })}
                render={(it, set) => (
                  <div className="space-y-2">
                    <ImageUploader value={it.img} onChange={(v) => set({ ...it, img: v })} label="" />
                    <input className="field-input" placeholder="Leyenda" value={it.cap} onChange={(e) => set({ ...it, cap: e.target.value })} />
                  </div>
                )}
              />
            </div>
          </Card>

          <Card title="Bloque «Nuestra historia»" hint="Retrato 1000×1250 y cuadrada 800×800.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Text label="Etiqueta" value={b.about.kicker} onChange={(v) => upd("about", { ...b.about, kicker: v })} />
              <Text label="Palabra destacada" value={b.about.highlight} onChange={(v) => upd("about", { ...b.about, highlight: v })} />
            </div>
            <Text label="Título" value={b.about.title} onChange={(v) => upd("about", { ...b.about, title: v })} />
            <Area label="Párrafo 1" value={b.about.paragraph1} onChange={(v) => upd("about", { ...b.about, paragraph1: v })} />
            <Area label="Párrafo 2" value={b.about.paragraph2} onChange={(v) => upd("about", { ...b.about, paragraph2: v })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <ImageUploader value={b.about.image1} onChange={(v) => upd("about", { ...b.about, image1: v })} label="Imagen retrato" />
              <ImageUploader value={b.about.image2} onChange={(v) => upd("about", { ...b.about, image2: v })} label="Imagen cuadrada" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Text label="Chef" value={b.about.chefName} onChange={(v) => upd("about", { ...b.about, chefName: v })} />
              <Text label="Rol chef" value={b.about.chefRole} onChange={(v) => upd("about", { ...b.about, chefRole: v })} />
              <Text label="Texto enlace" value={b.about.ctaLabel} onChange={(v) => upd("about", { ...b.about, ctaLabel: v })} />
            </div>
          </Card>

          <Card title="Títulos de las secciones de la home">
            {(["eventos", "experiencias", "carta", "galeria", "testimonios"] as const).map((k) => (
              <div key={k}>
                <div className="field-label capitalize">{k}</div>
                <HeaderFields value={b.sections[k]} onChange={(v) => upd("sections", { ...b.sections, [k]: v })} />
              </div>
            ))}
          </Card>

          <Card title="CTA de reserva" hint="Fondo horizontal 1920×1080.">
            <ImageUploader value={b.reserva.image} onChange={(v) => upd("reserva", { ...b.reserva, image: v })} label="Imagen de fondo" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Text label="Etiqueta" value={b.reserva.kicker} onChange={(v) => upd("reserva", { ...b.reserva, kicker: v })} />
              <Text label="Palabra destacada" value={b.reserva.highlight} onChange={(v) => upd("reserva", { ...b.reserva, highlight: v })} />
            </div>
            <Text label="Título" value={b.reserva.title} onChange={(v) => upd("reserva", { ...b.reserva, title: v })} />
            <Area label="Texto" value={b.reserva.text} onChange={(v) => upd("reserva", { ...b.reserva, text: v })} />
            <Text label="Botón" value={b.reserva.button} onChange={(v) => upd("reserva", { ...b.reserva, button: v })} />
          </Card>

          <Card title="Cinta animada (marquee)">
            <Area label="Texto (se repite en bucle)" value={b.marquee.text} onChange={(v) => upd("marquee", { text: v })} />
          </Card>

          <SaveBar saving={saving} msg={msg} error={error} onSave={() => save([
            ["home_hero", b.hero], ["home_about", b.about], ["home_sections", b.sections],
            ["home_reserva", b.reserva], ["home_marquee", b.marquee],
          ])} />
        </div>
      )}

      {/* HEADERS */}
      {tab === "headers" && (
        <div className="space-y-5">
          <Card title="Encabezados de las páginas">
            {(["carta", "eventos", "galeria", "experiencias", "blog", "reservar", "contacto"] as const).map((k) => (
              <div key={k}>
                <div className="field-label capitalize">{k}</div>
                <HeaderFields value={b.headers[k]} onChange={(v) => upd("headers", { ...b.headers, [k]: v })} />
              </div>
            ))}
          </Card>
          <SaveBar saving={saving} msg={msg} error={error} onSave={() => save([["page_headers", b.headers]])} />
        </div>
      )}

      {/* NOSOTROS */}
      {tab === "nosotros" && (
        <div className="space-y-5">
          <Card title="Encabezado">
            <div className="grid gap-3 sm:grid-cols-2">
              <Text label="Etiqueta" value={a.headerKicker} onChange={(v) => upd("aboutPage", { ...a, headerKicker: v })} />
              <Text label="Destacado" value={a.headerHighlight} onChange={(v) => upd("aboutPage", { ...a, headerHighlight: v })} />
            </div>
            <Text label="Título" value={a.headerTitle} onChange={(v) => upd("aboutPage", { ...a, headerTitle: v })} />
          </Card>
          <Card title="El concepto" hint="Imagen 1000×1250.">
            <Text label="Etiqueta" value={a.conceptKicker} onChange={(v) => upd("aboutPage", { ...a, conceptKicker: v })} />
            <Text label="Título" value={a.conceptTitle} onChange={(v) => upd("aboutPage", { ...a, conceptTitle: v })} />
            <ImageUploader value={a.conceptImage} onChange={(v) => upd("aboutPage", { ...a, conceptImage: v })} label="Imagen" />
            <Area label="Párrafo 1" value={a.conceptP1} onChange={(v) => upd("aboutPage", { ...a, conceptP1: v })} />
            <Area label="Párrafo 2" value={a.conceptP2} onChange={(v) => upd("aboutPage", { ...a, conceptP2: v })} />
          </Card>
          <Card title="Misión / Visión">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Text label="Título misión" value={a.missionTitle} onChange={(v) => upd("aboutPage", { ...a, missionTitle: v })} />
                <Area label="Texto misión" value={a.missionText} onChange={(v) => upd("aboutPage", { ...a, missionText: v })} />
              </div>
              <div className="space-y-2">
                <Text label="Título visión" value={a.visionTitle} onChange={(v) => upd("aboutPage", { ...a, visionTitle: v })} />
                <Area label="Texto visión" value={a.visionText} onChange={(v) => upd("aboutPage", { ...a, visionText: v })} />
              </div>
            </div>
          </Card>
          <Card title="El chef" hint="Foto 1000×1250.">
            <div className="grid gap-3 sm:grid-cols-3">
              <Text label="Etiqueta" value={a.chefKicker} onChange={(v) => upd("aboutPage", { ...a, chefKicker: v })} />
              <Text label="Nombre" value={a.chefName} onChange={(v) => upd("aboutPage", { ...a, chefName: v })} />
              <Text label="Rol" value={a.chefRole} onChange={(v) => upd("aboutPage", { ...a, chefRole: v })} />
            </div>
            <ImageUploader value={a.chefImage} onChange={(v) => upd("aboutPage", { ...a, chefImage: v })} label="Foto del chef" />
            <Area label="Bio" value={a.chefBio} onChange={(v) => upd("aboutPage", { ...a, chefBio: v })} />
            <Area label="Cita" value={a.chefQuote} onChange={(v) => upd("aboutPage", { ...a, chefQuote: v })} />
          </Card>
          <SaveBar saving={saving} msg={msg} error={error} onSave={() => save([["about_page", a]])} />
        </div>
      )}
    </div>
  );
}

/* ---- helpers ---- */
function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-xl border border-[var(--line)] bg-ink-2 p-5">
      <div>
        <h2 className="font-display text-[1.1rem] font-semibold">{title}</h2>
        {hint && <p className="text-[0.78rem] text-mist-2">{hint}</p>}
      </div>
      {children}
    </section>
  );
}
function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <input className="field-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <textarea rows={3} className="field-input resize-none" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
function SaveBar({ saving, msg, error, onSave }: { saving: boolean; msg: string | null; error: string | null; onSave: () => void }) {
  return (
    <div className="sticky bottom-4 space-y-2 rounded-xl border border-[var(--line)] bg-ink/90 p-3 backdrop-blur">
      {error && <p className="text-[0.82rem] text-seal">{error}</p>}
      {msg && <p className="text-[0.82rem] text-emerald-400">{msg}</p>}
      <button onClick={onSave} disabled={saving} className="btn btn-solid !px-6 disabled:opacity-60">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar esta sección
      </button>
    </div>
  );
}
