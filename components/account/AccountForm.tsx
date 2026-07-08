"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AccountForm({ initialName, email }: { initialName: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name }),
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

  async function logout() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-5 rounded-xl border border-[var(--line)] bg-ink-2 p-6">
      <div>
        <label className="field-label" htmlFor="name">Nombre</label>
        <input id="name" className="field-input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="field-label">Correo</label>
        <input className="field-input opacity-60" value={email} disabled />
      </div>

      {error && <p className="text-[0.82rem] text-seal">{error}</p>}
      {msg && <p className="text-[0.82rem] text-emerald-400">{msg}</p>}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" disabled={saving} className="btn btn-solid !px-5 disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Guardar
        </button>
        <button type="button" onClick={logout} className="btn btn-ghost !px-5">
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </form>
  );
}
