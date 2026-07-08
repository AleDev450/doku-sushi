"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Me = {
  loggedIn: boolean;
  name?: string;
  avatar?: string | null;
  role?: "superadmin" | "editor" | "user";
  isStaff?: boolean;
};

const ROLE_LABEL: Record<string, string> = {
  superadmin: "Administrador",
  editor: "Colaborador",
  user: "Comunidad Doko",
};

export default function UserMenu() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const res = await fetch("/api/me");
      const data = (await res.json()) as Me;
      setMe(data.loggedIn ? data : null);
    } catch {
      setMe(null);
    }
  }

  useEffect(() => {
    load();
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function logout() {
    await createClient().auth.signOut();
    setOpen(false);
    router.refresh();
  }

  if (!me) {
    return (
      <Link href="/login" className="text-[0.82rem] tracking-wide text-mist transition-colors hover:text-white">
        Login
      </Link>
    );
  }

  const name = me.name ?? "Usuario";
  const roleLabel = ROLE_LABEL[me.role ?? "user"] ?? "Comunidad Doko";

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2" aria-label="Cuenta">
        <Avatar name={name} avatar={me.avatar ?? null} staff={me.isStaff} />
        <span className="hidden max-w-[120px] truncate text-[0.82rem] text-white sm:block">{name}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-[var(--line)] bg-ink shadow-xl">
          <div className="border-b border-[var(--line)] px-4 py-3">
            <div className="truncate text-[0.85rem] font-medium text-white">{name}</div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className={me.isStaff ? "text-[0.7rem] font-medium text-seal" : "text-[0.7rem] text-mist-2"}>{roleLabel}</span>
            </div>
          </div>
          <Link href="/cuenta" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[0.85rem] text-mist transition-colors hover:bg-white/5 hover:text-white">
            <User size={15} /> Mi cuenta
          </Link>
          {me.isStaff && (
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[0.85rem] text-mist transition-colors hover:bg-white/5 hover:text-white">
              <LayoutDashboard size={15} /> Ir al panel
            </Link>
          )}
          <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-[0.85rem] text-mist transition-colors hover:bg-white/5 hover:text-white">
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

function Avatar({ name, avatar, staff }: { name: string; avatar: string | null; staff?: boolean }) {
  if (avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatar} alt="" className="h-8 w-8 rounded-full object-cover" />;
  }
  return (
    <span className={`grid h-8 w-8 place-items-center rounded-full font-display text-[0.85rem] font-semibold ${staff ? "bg-seal text-white" : "bg-seal/20 text-seal"}`}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
