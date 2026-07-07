"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { SECTIONS } from "@/lib/sections";

type Perm = { view: boolean; edit: boolean };
type PermMap = Record<string, Perm>;

export default function PermissionsMatrix({ initial }: { initial: PermMap }) {
  const router = useRouter();
  const [perms, setPerms] = useState<PermMap>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(section: string, field: "view" | "edit", value: boolean) {
    setSaved(false);
    setPerms((prev) => {
      const cur = prev[section] ?? { view: false, edit: false };
      const next = { ...cur, [field]: value };
      // Coherencia: editar exige ver; quitar ver quita editar.
      if (field === "edit" && value) next.view = true;
      if (field === "view" && !value) next.edit = false;
      return { ...prev, [section]: next };
    });
  }

  async function save() {
    setError(null);
    setSaving(true);
    try {
      const items = SECTIONS.map((s) => ({
        section: s.key,
        can_view: perms[s.key]?.view ?? false,
        can_edit: perms[s.key]?.edit ?? false,
      }));
      const res = await fetch("/api/permissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "editor", items }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "No se pudo guardar.");
      }
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-[1.3rem] font-semibold">Permisos del rol Editor</h2>
        <p className="text-[0.85rem] text-mist">Define qué secciones puede ver y editar un editor. El superadmin siempre tiene acceso total.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-ink">
        <table className="w-full text-left text-[0.88rem]">
          <thead>
            <tr className="border-b border-[var(--line)] text-[0.72rem] uppercase tracking-wider text-mist-2">
              <th className="px-5 py-3 font-medium">Sección</th>
              <th className="px-3 py-3 text-center font-medium">Ver</th>
              <th className="px-3 py-3 text-center font-medium">Editar</th>
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((s) => {
              const p = perms[s.key] ?? { view: false, edit: false };
              return (
                <tr key={s.key} className="border-b border-[var(--line)] last:border-none">
                  <td className="px-5 py-3 font-medium">{s.label}</td>
                  <td className="px-3 py-3 text-center">
                    <input type="checkbox" className="h-4 w-4 accent-seal" checked={p.view} onChange={(e) => toggle(s.key, "view", e.target.checked)} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input type="checkbox" className="h-4 w-4 accent-seal" checked={p.edit} onChange={(e) => toggle(s.key, "edit", e.target.checked)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {error && <p className="rounded-md border border-seal/40 bg-seal/10 px-3 py-2 text-[0.82rem] text-seal">{error}</p>}

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={saving} className="btn btn-solid !px-6 disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar permisos
        </button>
        {saved && <span className="text-[0.82rem] text-emerald-400">Guardado ✓</span>}
      </div>
    </div>
  );
}
