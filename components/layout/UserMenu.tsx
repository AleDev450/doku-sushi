"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Info = { name: string; avatar: string | null };

function info(u: User): Info {
  const m = (u.user_metadata ?? {}) as Record<string, unknown>;
  const name =
    (typeof m.full_name === "string" && m.full_name) ||
    (typeof m.name === "string" && m.name) ||
    (u.email ? u.email.split("@")[0] : "Usuario");
  const avatar =
    (typeof m.avatar_url === "string" && m.avatar_url) ||
    (typeof m.picture === "string" && m.picture) ||
    null;
  return { name: name as string, avatar };
}

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<Info | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ? info(data.user) : null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ? info(session.user) : null)
    );
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

  if (!user) {
    return (
      <Link href="/login" className="text-[0.82rem] tracking-wide text-mist transition-colors hover:text-white">
        Login
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2" aria-label="Cuenta">
        <Avatar user={user} />
        <span className="hidden max-w-[120px] truncate text-[0.82rem] text-white sm:block">{user.name}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-[var(--line)] bg-ink shadow-xl">
          <div className="border-b border-[var(--line)] px-4 py-3">
            <div className="truncate text-[0.85rem] font-medium text-white">{user.name}</div>
            <div className="text-[0.7rem] text-mist-2">Comunidad Doko</div>
          </div>
          <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-[0.85rem] text-mist transition-colors hover:bg-white/5 hover:text-white">
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

function Avatar({ user }: { user: Info }) {
  if (user.avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />;
  }
  return (
    <span className="grid h-8 w-8 place-items-center rounded-full bg-seal/20 font-display text-[0.85rem] font-semibold text-seal">
      {user.name.charAt(0).toUpperCase()}
    </span>
  );
}
