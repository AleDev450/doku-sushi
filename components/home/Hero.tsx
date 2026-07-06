"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  { img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1800&q=80&auto=format&fit=crop", cap: "Omakase — Barra principal" },
  { img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1800&q=80&auto=format&fit=crop", cap: "Nikkei — Tiradito de la casa" },
  { img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=80&auto=format&fit=crop", cap: "El salón — Luz de noche" },
  { img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1800&q=80&auto=format&fit=crop", cap: "Barra de coctelería japonesa" },
];

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative flex h-screen min-h-[640px] items-end overflow-hidden">
      {SLIDES.map((s, n) => (
        <div
          key={n}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-[opacity,transform] duration-[1600ms] ease-premium",
            n === i ? "scale-100 opacity-100" : "scale-[1.08] opacity-0"
          )}
          style={{ backgroundImage: `url('${s.img}')`, transitionDuration: n === i ? "7000ms, 1600ms" : "1600ms" }}
        />
      ))}
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(10,10,10,0.55)_0%,rgba(10,10,10,0.12)_34%,rgba(10,10,10,0.72)_82%,rgba(10,10,10,0.96)_100%)]" />

      <div className="relative z-[2] w-full pb-[88px]">
        <div className="wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-[760px]">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-[52px] bg-seal" />
              <span className="kicker">Nikkei · Lima</span>
            </div>
            <h1 className="font-display text-[clamp(2.9rem,7vw,6rem)] font-semibold leading-[0.99] tracking-[-0.015em] text-white">
              La experiencia
              <br />
              Nikkei que
              <br />
              <span className="text-seal">recordarás.</span>
            </h1>
            <p className="mt-6 max-w-[440px] font-light text-[1.06rem] text-mist">
              Donde el rigor japonés y el alma peruana se encuentran a fuego lento. Una mesa, una noche, una comunidad.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/reservar" className="btn btn-solid !px-8 !py-[15px] !text-[0.86rem]">
                Reservar mesa
              </Link>
              <Link href="/eventos" className="btn btn-ghost group !px-8 !py-[15px] !text-[0.86rem]">
                Ver próximos eventos
                <ArrowRight size={16} className="transition-transform duration-500 ease-premium group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="hidden flex-col items-end gap-5 pb-1.5 md:flex">
            <div className="min-h-[1.2em] text-right font-display text-[0.82rem] tracking-[0.14em] text-mist">
              {SLIDES[i].cap}
            </div>
            <div className="flex gap-2.5">
              {SLIDES.map((_, n) => (
                <button
                  key={n}
                  aria-label={`Imagen ${n + 1}`}
                  onClick={() => setI(n)}
                  className={cn("h-0.5 w-[34px] transition-colors duration-500", n === i ? "bg-seal" : "bg-white/30")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-[30px] left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2.5">
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-mist-2">Scroll</span>
        <div className="relative h-[46px] w-px overflow-hidden bg-white/20">
          <span className="absolute left-0 top-[-40%] h-[40%] w-full animate-trickle bg-seal" />
        </div>
      </div>
    </section>
  );
}
