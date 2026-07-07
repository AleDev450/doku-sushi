// POST /api/gallery  -> crea una imagen de galería

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { GalleryFilter } from "@/lib/types";
import { createGalleryImage, type GalleryInput } from "@/lib/api";
import { requirePermission } from "@/lib/rbac";

const FILTERS: GalleryFilter[] = ["comida", "eventos", "clientes", "chef", "restaurante"];

function revalidateGallery() {
  revalidatePath("/");
  revalidatePath("/galeria");
  revalidatePath("/admin/galeria");
}

function parseGallery(body: unknown): { data: GalleryInput } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Cuerpo inválido." };
  const b = body as Record<string, unknown>;

  const src = typeof b.src === "string" ? b.src.trim() : "";
  if (!src) return { error: "La imagen es obligatoria." };
  const filter = b.filter as GalleryFilter;
  if (!FILTERS.includes(filter)) return { error: "Filtro inválido." };

  const span = b.span === "tall" || b.span === "wide" ? b.span : undefined;

  return {
    data: {
      src,
      full: typeof b.full === "string" && b.full.trim() ? b.full.trim() : src,
      caption: typeof b.caption === "string" ? b.caption.trim() : "",
      filter,
      span,
    },
  };
}

export async function POST(req: Request) {
  if (!(await requirePermission("galeria", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parseGallery(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 422 });

  try {
    const img = await createGalleryImage(parsed.data);
    revalidateGallery();
    return NextResponse.json(img, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo crear." },
      { status: 500 }
    );
  }
}
