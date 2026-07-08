"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, CalendarDays, UtensilsCrossed, Images,
  MessageSquare, Users, Settings, LogOut, Menu, X, Bell, Search, Newspaper, Quote,
  ClipboardList, Mail, MessagesSquare, FileText,
} from "lucide-react";
import Seal from "@/components/ui/Seal";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/auth";
import type { PermissionMap, SectionKey } from "@/lib/sections";
import { signOut } from "@/app/admin/actions";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  ready: boolean;
  section?: SectionKey;
  superadminOnly?: boolean;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, ready: true },
  { href: "/admin/paginas", label: "Páginas", icon: FileText, ready: true, section: "paginas" },
  { href: "/admin/carta", label: "Carta", icon: UtensilsCrossed, ready: true, section: "carta" },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, ready: true, section: "blog" },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays, ready: true, section: "eventos" },
  { href: "/admin/galeria", label: "Galería", icon: Images, ready: true, section: "galeria" },
  { href: "/admin/experiencias", label: "Experiencias", icon: MessageSquare, ready: true, section: "experiencias" },
  { href: "/admin/testimonios", label: "Testimonios", icon: Quote, ready: true, section: "testimonios" },
  { href: "/admin/reservas", label: "Reservas", icon: ClipboardList, ready: true, section: "reservas" },
  { href: "/admin/mensajes", label: "Mensajes", icon: Mail, ready: true, section: "mensajes" },
  { href: "/admin/comentarios", label: "Comentarios", icon: MessagesSquare, ready: true },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, ready: true, superadminOnly: true },
  { href: "/admin/ajustes", label: "Ajustes", icon: Settings, ready: true, superadminOnly: true },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

const ROLE_LABEL: Record<string, string> = {
  superadmin: "Superadmin",
  editor: "Editor",
};

export default function AdminShell({
  profile,
  permissions,
  children,
}: {
  profile: Profile;
  permissions: PermissionMap;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const displayName = profile.full_name || profile.email.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();

  // Filtra el menú según rol y permisos de sección.
  const nav = NAV.filter((n) => {
    if (n.superadminOnly) return profile.role === "superadmin";
    if (n.section) return permissions[n.section]?.view ?? false;
    return true; // Dashboard u otros sin sección
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-paper">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[248px] border-r border-[var(--line)] bg-ink transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-[var(--line)] px-6">
          <Seal size={30} />
          <span className="font-display text-[1.25rem] font-semibold tracking-[0.08em]">Doko</span>
          <span className="ml-1 rounded bg-seal/15 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-seal">Admin</span>
        </div>

        <nav className="p-3">
          {nav.map((n) => {
            const active = isActive(pathname, n.href);

            if (!n.ready) {
              return (
                <span
                  key={n.label}
                  className="mb-1 flex cursor-not-allowed items-center gap-3 rounded-lg px-4 py-2.5 text-[0.88rem] text-mist-2"
                  title="Próximamente"
                >
                  <n.icon size={17} /> {n.label}
                  <span className="ml-auto rounded bg-white/5 px-1.5 py-0.5 text-[0.58rem] uppercase tracking-wider text-mist-2">pronto</span>
                </span>
              );
            }

            return (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-[0.88rem] transition-colors",
                  active ? "bg-seal/12 text-white" : "text-mist hover:bg-white/5 hover:text-white"
                )}
              >
                <n.icon size={17} className={active ? "text-seal" : ""} /> {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 space-y-1 border-t border-[var(--line)] p-3">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-[0.88rem] text-mist transition-colors hover:bg-white/5 hover:text-white">
            <LogOut size={17} /> Volver al sitio
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-[0.88rem] text-mist transition-colors hover:bg-seal/10 hover:text-seal"
            >
              <LogOut size={17} /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--line)] bg-[rgba(10,10,10,0.8)] px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menú">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="hidden items-center gap-2 rounded-lg border border-[var(--line)] bg-ink px-3 py-2 md:flex">
              <Search size={15} className="text-mist-2" />
              <input placeholder="Buscar…" className="w-40 bg-transparent text-[0.85rem] outline-none placeholder:text-mist-2" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-mist hover:text-white" aria-label="Notificaciones">
              <Bell size={19} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-seal" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-seal/15 font-display text-[0.9rem] font-semibold text-seal">
                {initial}
              </span>
              <div className="hidden text-[0.82rem] sm:block">
                <div className="font-medium leading-tight">{displayName}</div>
                <div className="text-[0.7rem] text-mist-2">{ROLE_LABEL[profile.role]}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
