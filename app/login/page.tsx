"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Seal from "@/components/ui/Seal";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "inactive"
      ? "Tu cuenta está pendiente de activación por el administrador."
      : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "register") {
      setError("Las cuentas del panel se crean por invitación del administrador.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        const msg = err.message.toLowerCase();
        if (msg.includes("invalid login credentials")) {
          setError("Correo o contraseña incorrectos.");
        } else if (msg.includes("email not confirmed")) {
          setError("Tu correo no está confirmado. Actívalo en Supabase (Auto Confirm User).");
        } else {
          setError(err.message);
        }
        setLoading(false);
        return;
      }

      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado al iniciar sesión.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=80&auto=format&fit=crop')",
          filter: "brightness(0.28) saturate(1.05)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.75),rgba(10,10,10,0.92))]" />

      <div className="relative z-[2] w-full max-w-[420px]">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <Seal size={40} />
          <span className="font-display text-[1.9rem] font-semibold tracking-[0.08em]">Doko</span>
        </Link>

        <div className="rounded-2xl border border-[var(--line)] bg-[rgba(20,20,20,0.72)] p-8 backdrop-blur-2xl md:p-10">
          <h1 className="mb-1 text-center font-display text-[1.7rem] font-semibold">
            {mode === "login" ? "Bienvenido de vuelta" : "Únete a Doko"}
          </h1>
          <p className="mb-7 text-center text-[0.88rem] text-mist">
            {mode === "login" ? "Inicia sesión para acceder al panel." : "Crea tu cuenta y sé parte de la comunidad."}
          </p>

          {/* Social (próximamente) */}
          <div className="space-y-3">
            <SocialBtn label="Continuar con Google" logo="G" />
            <SocialBtn label="Continuar con Facebook" logo="f" />
            <SocialBtn label="Continuar con Apple" logo="" />
          </div>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-[var(--line)]" />
            <span className="text-[0.72rem] uppercase tracking-[0.16em] text-mist-2">o con correo</span>
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>

          {/* Email */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                autoComplete="email"
                required
                className="field-input !pl-11"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                autoComplete="current-password"
                required
                className="field-input !pl-11"
              />
            </div>

            {error && (
              <p className="rounded-md border border-seal/40 bg-seal/10 px-3 py-2.5 text-[0.82rem] text-seal">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn btn-solid group w-full !py-3.5 disabled:opacity-60">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Entrando…
                </>
              ) : (
                <>
                  {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
                  <ArrowRight size={16} className="transition-transform duration-500 ease-premium group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[0.85rem] text-mist">
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => {
                setError(null);
                setMode(mode === "login" ? "register" : "login");
              }}
              className="font-medium text-seal hover:underline"
            >
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-[0.76rem] text-mist-2">
          <Link href="/" className="hover:text-white">← Volver al inicio</Link>
        </p>
      </div>
    </div>
  );
}

function SocialBtn({ label, logo }: { label: string; logo: string }) {
  return (
    <button
      type="button"
      title="Próximamente"
      disabled
      className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-full border border-[var(--line)] bg-white/[0.03] py-3 text-[0.88rem] opacity-60"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[0.8rem] font-bold text-ink">{logo}</span>
      {label}
    </button>
  );
}
