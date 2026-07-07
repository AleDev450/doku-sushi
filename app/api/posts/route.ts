// GET  /api/posts  -> lista de posts (admin)
// POST /api/posts  -> crea un post (slug automático)

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { PostStatus } from "@/lib/types";
import { getPosts, createPost, type PostInput } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

const STATUSES: PostStatus[] = ["draft", "published"];

function revalidateBlog() {
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

function parsePost(body: unknown): { data: PostInput } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Cuerpo inválido." };
  const b = body as Record<string, unknown>;

  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (!title) return { error: "El título es obligatorio." };

  const status = (typeof b.status === "string" ? b.status : "draft") as PostStatus;
  if (!STATUSES.includes(status)) return { error: "Estado inválido." };

  const tags = Array.isArray(b.tags)
    ? b.tags.filter((t): t is string => typeof t === "string")
    : [];

  return {
    data: {
      title,
      slug: typeof b.slug === "string" && b.slug.trim() ? b.slug.trim() : undefined,
      excerpt: typeof b.excerpt === "string" ? b.excerpt.trim() : "",
      body: typeof b.body === "string" ? b.body : "",
      cover: typeof b.cover === "string" ? b.cover.trim() : "",
      author: typeof b.author === "string" && b.author.trim() ? b.author.trim() : "Doko",
      tags,
      status,
    },
  };
}

export async function GET() {
  return NextResponse.json(await getPosts());
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parsePost(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 422 });

  try {
    const post = await createPost(parsed.data);
    revalidateBlog();
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo crear el post." },
      { status: 500 }
    );
  }
}
