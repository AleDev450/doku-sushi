"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save, ArrowLeft, Eye, Pencil } from "lucide-react";
import type { Post, PostStatus } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";
import Markdown from "@/components/blog/Markdown";
import { cn } from "@/lib/utils";

export default function PostForm({ initial }: { initial?: Post }) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "Doko");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [status, setStatus] = useState<PostStatus>(initial?.status ?? "draft");

  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(overrideStatus?: PostStatus) {
    setError(null);
    setSaving(true);
    try {
      const payload = {
        title,
        slug: slug.trim() || undefined,
        excerpt,
        body,
        cover,
        author,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        status: overrideStatus ?? status,
      };
      const res = await fetch(editing ? `/api/posts/${initial!.id}` : "/api/posts", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-7">
      <div>
        <Link href="/admin/blog" className="mb-4 inline-flex items-center gap-1.5 text-[0.82rem] text-mist hover:text-white">
          <ArrowLeft size={15} /> Volver al blog
        </Link>
        <h1 className="font-display text-[1.9rem] font-semibold">
          {editing ? "Editar post" : "Nuevo post"}
        </h1>
        <p className="text-[0.9rem] text-mist">
          {editing ? `Editando “${initial!.title}”` : "Escribe una nueva entrada del blog."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Columna principal */}
        <div className="space-y-5">
          <div>
            <label className="field-label" htmlFor="title">Título *</label>
            <input id="title" className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="La barra que cambió Lima" required />
          </div>

          <div>
            <label className="field-label" htmlFor="slug">Slug (URL)</label>
            <input id="slug" className="field-input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="se-genera-del-titulo" />
            <p className="mt-1.5 text-[0.72rem] text-mist-2">Déjalo vacío y se genera del título. Ej: /blog/{slug || "la-barra-que-cambio-lima"}</p>
          </div>

          <div>
            <label className="field-label" htmlFor="excerpt">Extracto</label>
            <textarea id="excerpt" rows={2} className="field-input resize-none" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Resumen corto que aparece en el listado del blog." />
          </div>

          {/* Cuerpo con pestañas Editar / Vista previa */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="field-label mb-0">Contenido (Markdown)</span>
              <div className="flex gap-1 rounded-lg border border-[var(--line)] p-0.5">
                <TabBtn active={tab === "edit"} onClick={() => setTab("edit")} icon={<Pencil size={13} />} label="Editar" />
                <TabBtn active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye size={13} />} label="Vista previa" />
              </div>
            </div>
            {tab === "edit" ? (
              <textarea
                rows={16}
                className="field-input resize-y font-mono text-[0.86rem] leading-relaxed"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={"## Un subtítulo\n\nEscribe en **Markdown**: listas, [enlaces](https://…), > citas, etc."}
              />
            ) : (
              <div className="min-h-[280px] rounded-md border border-[var(--line)] bg-ink px-5 py-4">
                {body.trim() ? <Markdown content={body} /> : <p className="text-[0.85rem] text-mist-2">Nada que previsualizar todavía.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Columna lateral */}
        <div className="space-y-5">
          <ImageUploader value={cover} onChange={setCover} label="Portada" />

          <div>
            <label className="field-label" htmlFor="author">Autor</label>
            <input id="author" className="field-input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Doko" />
          </div>

          <div>
            <label className="field-label" htmlFor="tags">Tags</label>
            <input id="tags" className="field-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="nikkei, barra, eventos" />
            <p className="mt-1.5 text-[0.72rem] text-mist-2">Sepáralos con comas.</p>
          </div>

          <div>
            <label className="field-label" htmlFor="status">Estado</label>
            <select id="status" className="field-input" value={status} onChange={(e) => setStatus(e.target.value as PostStatus)}>
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-seal/40 bg-seal/10 px-4 py-3 text-[0.85rem] text-seal">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving} className="btn btn-solid !px-6 disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {editing ? "Guardar cambios" : "Crear post"}
        </button>
        {status === "draft" && (
          <button type="button" disabled={saving} onClick={() => submit("published")} className="btn btn-ghost !px-6 disabled:opacity-60">
            Guardar y publicar
          </button>
        )}
        <Link href="/admin/blog" className="btn btn-ghost !px-6">Cancelar</Link>
      </div>
    </form>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[0.76rem] font-medium transition-colors",
        active ? "bg-seal/15 text-seal" : "text-mist hover:text-white"
      )}
    >
      {icon} {label}
    </button>
  );
}
