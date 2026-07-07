"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Loader2, Eye, EyeOff, ExternalLink } from "lucide-react";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PostTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function patch(post: Post, body: Record<string, unknown>) {
    setBusyId(post.id);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "No se pudo actualizar.");
      }
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(post: Post) {
    if (!confirm(`¿Eliminar “${post.title}”? Esta acción no se puede deshacer.`)) return;
    setBusyId(post.id);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar.");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar.");
    } finally {
      setBusyId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--line)] p-12 text-center text-mist">
        Aún no hay posts. Crea el primero con “Nuevo post”.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-ink">
      <table className="w-full min-w-[680px] text-left text-[0.86rem]">
        <thead>
          <tr className="border-b border-[var(--line)] text-[0.72rem] uppercase tracking-wider text-mist-2">
            <th className="px-5 py-3 font-medium">Post</th>
            <th className="px-3 py-3 font-medium">Estado</th>
            <th className="px-3 py-3 font-medium">Fecha</th>
            <th className="px-5 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} className={cn("border-b border-[var(--line)] last:border-none transition-opacity", busyId === p.id && "opacity-50")}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-ink-3">
                    {p.cover && <Image src={p.cover} alt="" fill sizes="64px" className="object-cover" />}
                  </span>
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="line-clamp-1 max-w-[320px] text-[0.76rem] text-mist-2">{p.excerpt || `/blog/${p.slug}`}</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3">
                <span className={cn(
                  "rounded-full px-2.5 py-1 text-[0.7rem] font-medium",
                  p.status === "published" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                )}>
                  {p.status === "published" ? "Publicado" : "Borrador"}
                </span>
              </td>
              <td className="px-3 py-3 text-mist">{fmtDate(p.publishedAt ?? p.createdAt)}</td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-2">
                  {p.status === "published" && (
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:text-white" aria-label="Ver publicado" title="Ver en el sitio">
                      <ExternalLink size={15} />
                    </a>
                  )}
                  <button
                    onClick={() => patch(p, { status: p.status === "published" ? "draft" : "published" })}
                    disabled={busyId === p.id}
                    aria-label={p.status === "published" ? "Pasar a borrador" : "Publicar"}
                    title={p.status === "published" ? "Pasar a borrador" : "Publicar"}
                    className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:text-white"
                  >
                    {p.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <Link href={`/admin/blog/${p.id}`} className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:text-white" aria-label="Editar">
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => remove(p)}
                    disabled={busyId === p.id}
                    className="grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:border-seal/50 hover:text-seal"
                    aria-label="Eliminar"
                  >
                    {busyId === p.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
