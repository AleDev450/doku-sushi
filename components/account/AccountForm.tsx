"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, LogOut, Camera, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AccountForm({
  initialName,
  email,
  initialAvatar,
}: {
  initialName: string;
  email: string;
  initialAvatar: string;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadPhoto(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo subir la foto.");
      setAvatar(data.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir.");
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name, avatar_url: avatar }),
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
      {/* Avatar */}
      <div>
        <span className="field-label">Foto de perfil</span>
        <div className="flex items-center gap-4">
          <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-seal/20">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="grid h-full w-full place-items-center font-display text-[1.8rem] font-semibold text-seal">
                {(name || email).charAt(0).toUpperCase()}
              </span>
            )}
            {uploading && <span className="absolute inset-0 grid place-items-center bg-black/50"><Loader2 size={20} className="animate-spin text-white" /></span>}
          </span>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-ghost !px-4 !py-2 text-[0.8rem]">
              <Camera size={14} /> Cambiar foto
            </button>
            {avatar && (
              <button type="button" onClick={() => setAvatar("")} className="inline-flex items-center gap-1 text-[0.76rem] text-mist-2 hover:text-seal">
                <X size={12} /> Quitar
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadPhoto(f);
              e.target.value = "";
            }}
          />
        </div>
        <p className="mt-2 text-[0.72rem] text-mist-2">JPG o PNG, cuadrada (ej. 400×400).</p>
      </div>

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
        <button type="submit" disabled={saving || uploading} className="btn btn-solid !px-5 disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Guardar
        </button>
        <button type="button" onClick={logout} className="btn btn-ghost !px-5">
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </form>
  );
}
