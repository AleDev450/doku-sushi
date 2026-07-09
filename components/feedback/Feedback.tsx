"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Star, Trash2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  id: number;
  userId: string;
  authorName: string;
  authorAvatar: string | null;
  rating: number;
  text: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
};

type Me = { loggedIn: boolean; id?: string; name?: string; avatar?: string | null; isStaff?: boolean };

export default function Feedback({
  targetType,
  targetSlug,
  title = "Feedback de quienes",
  highlight = "vivieron esto.",
}: {
  targetType: "event" | "experience";
  targetSlug: string;
  title?: string;
  highlight?: string;
}) {
  const pathname = usePathname();
  const [items, setItems] = useState<Item[]>([]);
  const [me, setMe] = useState<Me>({ loggedIn: false });
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [meRes, fbRes] = await Promise.all([
        fetch("/api/me"),
        fetch(`/api/feedback?target_type=${targetType}&target_slug=${encodeURIComponent(targetSlug)}`),
      ]);
      setMe(await meRes.json());
      setItems(await fbRes.json());
      setLoading(false);
    })();
  }, [targetType, targetSlug]);

  const avg = items.length ? items.reduce((s, i) => s + i.rating, 0) / items.length : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_type: targetType, target_slug: targetSlug, rating, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo publicar.");
      setItems((prev) => [data, ...prev]);
      setText("");
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    } finally {
      setSubmitting(false);
    }
  }

  async function like(item: Item) {
    if (!me.loggedIn) return;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, likedByMe: !i.likedByMe, likes: i.likes + (i.likedByMe ? -1 : 1) } : i)));
    const res = await fetch(`/api/feedback/${item.id}/like`, { method: "POST" });
    if (res.ok) {
      const { liked, likes } = await res.json();
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, likedByMe: liked, likes } : i)));
    }
  }

  async function remove(item: Item) {
    if (!confirm("¿Eliminar este comentario?")) return;
    const res = await fetch(`/api/feedback/${item.id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  return (
    <section className="border-t border-[var(--line)] bg-ink-2 py-16">
      <div className="wrap">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-[1.7rem] font-semibold">
            {title} <span className="text-seal">{highlight}</span>
          </h2>
          {items.length > 0 && (
            <div className="flex items-center gap-2 text-mist">
              <Star size={18} className="fill-seal text-seal" />
              <span className="font-display text-[1.3rem] font-semibold text-white">{avg.toFixed(1)}</span>
              <span className="text-[0.85rem]">· {items.length} {items.length === 1 ? "opinión" : "opiniones"}</span>
            </div>
          )}
        </div>

        {/* Comentarios con foto */}
        {loading ? (
          <p className="text-mist-2">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="text-mist-2">Aún no hay comentarios. {me.loggedIn ? "Sé el primero abajo." : "Inicia sesión para ser el primero."}</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {items.map((it) => {
              const canDelete = me.loggedIn && (me.id === it.userId || me.isStaff);
              return (
                <div key={it.id} className="rounded-lg border border-[var(--line)] bg-ink p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Avatar name={it.authorName} avatar={it.authorAvatar} />
                    <div className="flex-1">
                      <div className="font-medium text-white">{it.authorName}</div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} size={13} className={n <= it.rating ? "fill-seal text-seal" : "text-mist-2"} />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => like(it)}
                      disabled={!me.loggedIn}
                      className={cn("flex items-center gap-1.5 text-[0.8rem] transition-colors", it.likedByMe ? "text-seal" : "text-mist hover:text-white", !me.loggedIn && "cursor-not-allowed")}
                      title={me.loggedIn ? "Me gusta" : "Inicia sesión para dar like"}
                    >
                      <Heart size={14} className={it.likedByMe ? "fill-seal" : ""} /> {it.likes}
                    </button>
                  </div>
                  <p className="text-[0.95rem] font-light leading-relaxed text-mist">{it.text}</p>
                  {canDelete && (
                    <button onClick={() => remove(it)} className="mt-3 inline-flex items-center gap-1 text-[0.72rem] text-mist-2 hover:text-seal">
                      <Trash2 size={12} /> Eliminar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Dejar comentario — al final */}
        <div className="mt-10 max-w-[640px]">
          {me.loggedIn ? (
            <form onSubmit={submit} className="rounded-xl border border-[var(--line)] bg-ink p-5">
              <div className="mb-2 text-[0.82rem] font-medium text-white">Deja tu comentario</div>
              <div className="mb-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)} aria-label={`${n} estrellas`}>
                    <Star size={22} className={cn("transition-colors", (hover || rating) >= n ? "fill-seal text-seal" : "text-mist-2")} />
                  </button>
                ))}
              </div>
              <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Cuenta cómo viviste esta experiencia…" required className="field-input resize-none" />
              {error && <p className="mt-2 text-[0.8rem] text-seal">{error}</p>}
              <div className="mt-3 flex justify-end">
                <button type="submit" disabled={submitting} className="btn btn-solid !px-5 disabled:opacity-60">
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Publicar
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--line)] bg-ink p-6 text-center">
              <p className="text-[0.92rem] text-mist">Inicia sesión para dejar tu comentario y dar like.</p>
              <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="btn btn-solid mt-4 !px-6">Iniciar sesión</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Avatar({ name, avatar }: { name: string; avatar: string | null }) {
  if (avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-seal/20 font-display text-[1rem] font-semibold text-seal">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
