"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setS({ ...s, [k]: e.target.value });

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
