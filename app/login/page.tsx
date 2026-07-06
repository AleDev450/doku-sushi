"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Seal from "@/components/ui/Seal";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            {mode === "login" ? "Inicia sesión para revivir tus experiencias." : "Crea tu cuenta y sé parte de la comunidad."}
          </p>

          {/* Social */}
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
          <div className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
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
                className="field-input !pl-11"
              />
            </div>
            <button className="btn btn-solid group w-full !py-3.5">
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
              <ArrowRight size={16} className="transition-transform duration-500 ease-premium group-hover:translate-x-1" />
            </button>
          </div>

          <p className="mt-6 text-center text-[0.85rem] text-mist">
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
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
    <button className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--line)] bg-white/[0.03] py-3 text-[0.88rem] transition-colors hover:border-white/40 hover:bg-white/[0.06]">
      <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[0.8rem] font-bold text-ink">{logo}</span>
      {label}
    </button>
  );
}
