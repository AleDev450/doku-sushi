// GET    /api/posts/:id  -> un post
// PATCH  /api/posts/:id  -> actualiza el post
// DELETE /api/posts/:id  -> elimina el post

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { PostStatus } from "@/lib/types";
import { getPostById, updatePost, deletePost, type PostInput } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

const STATUSES: PostStatus[] = ["draft", "published"];

type Ctx = { params: { id: string } };

function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function GET(_req: Request, { params }: Ctx) {
  const post = await getPostById(Number(params.id));
  if (!post) return NextResponse.json({ error: "Post no encontrado." }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const patch: Partial<PostInput> = {};
  if (typeof body.title === "string") {
    if (!body.title.trim()) return NextResponse.json({ error: "El título no puede quedar vacío." }, { status: 422 });
    patch.title = body.title.trim();
  }
  if (typeof body.slug === "string") patch.slug = body.slug.trim();
  if (typeof body.excerpt === "string") patch.excerpt = body.excerpt.trim();
  if (typeof body.body === "string") patch.body = body.body;
  if (typeof body.cover === "string") patch.cover = body.cover.trim();
  if (typeof body.author === "string") patch.author = body.author.trim() || "Doko";
  if (Array.isArray(body.tags)) patch.tags = body.tags.filter((t): t is string => typeof t === "string");
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as PostStatus)) {
      return NextResponse.json({ error: "Estado inválido." }, { status: 422 });
    }
    patch.status = body.status as PostStatus;
  }

  try {
    const updated = await updatePost(Number(params.id), patch);
    if (!updated) return NextResponse.json({ error: "Post no encontrado." }, { status: 404 });
    revalidateBlog(updated.slug);
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo actualizar." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const ok = await deletePost(Number(params.id));
    if (!ok) return NextResponse.json({ error: "Post no encontrado." }, { status: 404 });
    revalidateBlog();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo eliminar." },
      { status: 500 }
    );
  }
}
