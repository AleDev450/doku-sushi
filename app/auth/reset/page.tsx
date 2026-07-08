"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Check } from "lucide-react";
import Seal from "@/components/ui/Seal";
import { createClient } from "@/lib/supabase/client";

export default function ResetPage() {
  const router = useRouter();
  const [ready, setReady] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setReady(Boolean(data.user)));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const { error: err } = await createClient().auth.updateUser({ password });
    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/cuenta");
      router.refresh();
    }, 1200);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0a0a0a,#111)]" />
      <div className="relative z-[2] w-full max-w-[400px]">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <Seal size={38} />
          <span className="font-display text-[1.7rem] font-semibold tracking-[0.08em]">Doko</span>
        </Link>

        <div className="rounded-2xl border border-[var(--line)] bg-[rgba(20,20,20,0.72)] p-8 backdrop-blur-2xl">
          {ready === null ? (
            <p className="text-center text-mist">Cargando…</p>
          ) : !ready ? (
            <div className="text-center">
              <h1 className="mb-2 font-display text-[1.4rem] font-semibold">Enlace inválido o expirado</h1>
              <p className="text-[0.88rem] text-mist">Solicita un nuevo enlace desde la pantalla de inicio de sesión.</p>
              <Link href="/login" className="btn btn-solid mt-6">Ir a login</Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <span className="mb-4 inline-grid h-14 w-14 place-items-center rounded-full bg-seal"><Check size={26} /></span>
              <h1 className="font-display text-[1.4rem] font-semibold">Contraseña actualizada</h1>
              <p className="mt-1 text-[0.88rem] text-mist">Redirigiendo…</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h1 className="mb-1 text-center font-display text-[1.5rem] font-semibold">Nueva contraseña</h1>
              <p className="mb-6 text-center text-[0.85rem] text-mist">Elige una contraseña nueva para tu cuenta.</p>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist-2" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nueva contraseña" required minLength={8} className="field-input !pl-11" />
              </div>
              {error && <p className="mt-3 text-[0.82rem] text-seal">{error}</p>}
              <button type="submit" disabled={saving} className="btn btn-solid mt-5 w-full !py-3.5 disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null} Guardar contraseña
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
