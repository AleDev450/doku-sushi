"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { PUBLIC_NAV } from "@/lib/public-nav";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setS({ ...s, [k]: e.target.value });

  const navHidden = s.navHidden ?? [];
  function toggleNav(href: string, visible: boolean) {
    setS((prev) => ({
      ...prev,
      navHidden: visible ? (prev.navHidden ?? []).filter((h) => h !== href) : [...(prev.navHidden ?? []), href],
    }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      setMsg("Guardado ✓");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre de la marca"><input className="field-input" value={s.brandName} onChange={set("brandName")} /></Field>
        <Field label="Tagline"><input className="field-input" value={s.tagline} onChange={set("tagline")} /></Field>
        <Field label="Teléfono"><input className="field-input" value={s.phone} onChange={set("phone")} /></Field>
        <Field label="Correo"><input className="field-input" value={s.email} onChange={set("email")} /></Field>
        <Field label="Instagram (URL)"><input className="field-input" value={s.instagram} onChange={set("instagram")} /></Field>
        <Field label="Facebook (URL)"><input className="field-input" value={s.facebook} onChange={set("facebook")} /></Field>
      </div>
      <Field label="Dirección"><input className="field-input" value={s.address} onChange={set("address")} /></Field>
      <Field label="Horario"><input className="field-input" value={s.hours} onChange={set("hours")} placeholder="Mar – Dom · 12:30 – 23:30" /></Field>

      <div className="rounded-xl border border-[var(--line)] bg-ink p-5">
        <div className="mb-3">
          <div className="font-display text-[1.05rem] font-semibold">Menú del sitio (navbar)</div>
          <p className="text-[0.8rem] text-mist">Activa o desactiva qué enlaces se muestran en el navbar público.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {PUBLIC_NAV.map((n) => {
            const visible = !navHidden.includes(n.href);
            return (
              <label key={n.href} className="flex cursor-pointer items-center gap-3 rounded-md border border-[var(--line)] px-3 py-2.5 text-[0.88rem]">
                <input type="checkbox" checked={visible} onChange={(e) => toggleNav(n.href, e.target.checked)} className="h-4 w-4 accent-seal" />
                <span className={visible ? "" : "text-mist-2 line-through"}>{n.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {error && <p className="text-[0.82rem] text-seal">{error}</p>}
      {msg && <p className="text-[0.82rem] text-emerald-400">{msg}</p>}

      <button type="submit" disabled={saving} className="btn btn-solid !px-6 disabled:opacity-60">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar ajustes
      </button>
    </form>
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
