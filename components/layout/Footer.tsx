"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Seal from "@/components/ui/Seal";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (pathname?.startsWith("/admin") || pathname === "/login") return null;

  return (
    <footer className="border-t border-[var(--line)] bg-[#080808] px-6 pb-9 pt-20 md:px-10">
      <div className="mx-auto max-w-wrap">
        <div className="grid gap-11 border-b border-[var(--line)] pb-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <Seal size={34} />
              <span className="font-display text-[1.5rem] font-semibold tracking-[0.08em]">Doko</span>
            </Link>
            <p className="max-w-[280px] font-light text-[0.9rem] text-mist">
              Cocina Nikkei contemporánea. Producto peruano, alma japonesa, una comunidad que vuelve.
            </p>
          </div>

          <FooterCol
            title="Navegar"
            links={[
              { href: "/nosotros", label: "Nosotros" },
              { href: "/eventos", label: "Eventos" },
              { href: "/carta", label: "Carta" },
              { href: "/experiencias", label: "Experiencias" },
            ]}
          />
          <FooterCol
            title="Comunidad"
            links={[
              { href: "/login", label: "Iniciar sesión" },
              { href: "/galeria", label: "Galería" },
              { href: "/experiencias", label: "Reseñas" },
              { href: "/reservar", label: "Reservar" },
            ]}
          />

          <div>
            <h5 className="mb-5 text-[0.68rem] uppercase tracking-[0.2em] text-seal">Newsletter</h5>
            <p className="mb-4 font-light text-[0.88rem] text-mist">
              Entérate primero de cada evento y menú especial.
            </p>
            <div className="flex overflow-hidden rounded-full border border-[var(--line)] bg-ink">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo"
                className="flex-1 bg-transparent px-[18px] py-3 font-body text-[0.86rem] text-white outline-none placeholder:text-mist-2"
              />
              <button
                onClick={() => {
                  if (email.includes("@")) setSent(true);
                }}
                className="bg-seal px-[22px] text-[0.8rem] tracking-wide text-white transition-colors hover:bg-seal-deep"
              >
                {sent ? "✓" : "Unirme"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-5 pt-7 md:flex-row md:items-center">
          <p className="text-[0.78rem] text-mist-2">© 2026 Doko Nikkei. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-[0.78rem] text-mist-2 transition-colors hover:text-white">Privacidad</Link>
            <Link href="#" className="text-[0.78rem] text-mist-2 transition-colors hover:text-white">Términos</Link>
            <Link href="#" className="text-[0.78rem] text-mist-2 transition-colors hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h5 className="mb-5 text-[0.68rem] uppercase tracking-[0.2em] text-seal">{title}</h5>
      <ul className="flex flex-col gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-[0.88rem] text-mist transition-all hover:pl-1 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
