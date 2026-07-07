"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Seal from "@/components/ui/Seal";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/eventos", label: "Eventos" },
  { href: "/carta", label: "Carta" },
  { href: "/galeria", label: "Galería" },
  { href: "/experiencias", label: "Experiencias" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // El admin usa su propio layout: no mostramos el navbar público ahí.
  if (pathname?.startsWith("/admin") || pathname === "/login") return null;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] flex items-center justify-between transition-all duration-500 ease-premium",
          scrolled
            ? "border-b border-[var(--line)] bg-[rgba(10,10,10,0.72)] px-6 py-3.5 backdrop-blur-xl md:px-10"
            : "border-b border-transparent px-6 py-5 md:px-10"
        )}
      >
        <Link href="/" className="z-[2] flex items-center gap-3" aria-label="Doko inicio">
          <Seal size={34} />
          <span className="font-display text-[1.5rem] font-semibold tracking-[0.08em]">Doko</span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "group relative text-[0.82rem] tracking-wide transition-colors",
                    pathname === l.href ? "text-white" : "text-mist hover:text-white"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px bg-seal transition-all duration-300 ease-premium",
                      pathname === l.href ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="z-[2] flex items-center gap-4">
          <Link href="/login" className="hidden text-[0.82rem] tracking-wide text-mist transition-colors hover:text-white sm:block">
            Login
          </Link>
          <Link href="/reservar" className="btn btn-solid hidden sm:inline-flex">
            Reservar
          </Link>
          <button
            className="lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Menú móvil */}
      <div
        className={cn(
          "fixed inset-0 z-[99] flex flex-col justify-center bg-[rgba(8,8,8,0.98)] px-8 backdrop-blur-2xl transition-transform duration-500 ease-premium lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="border-b border-[var(--line)] py-3.5 font-display text-[1.8rem] tracking-wide text-white last:border-none"
          >
            {l.label}
          </Link>
        ))}
        <div className="mt-8 flex gap-4">
          <Link href="/login" className="btn btn-ghost">Login</Link>
          <Link href="/reservar" className="btn btn-solid">Reservar</Link>
        </div>
      </div>
    </>
  );
}
