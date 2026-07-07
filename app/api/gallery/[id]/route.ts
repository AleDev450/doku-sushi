// PATCH  /api/gallery/:id  -> actualiza una imagen
// DELETE /api/gallery/:id  -> elimina una imagen

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { GalleryFilter, GalleryImage } from "@/lib/types";
import { updateGalleryImage, deleteGalleryImage } from "@/lib/api";
import { requirePermission } from "@/lib/rbac";

const FILTERS: GalleryFilter[] = ["comida", "eventos", "clientes", "chef", "restaurante"];

type Ctx = { params: { id: string } };

function revalidateGallery() {
  revalidatePath("/");
  revalidatePath("/galeria");
  revalidatePath("/admin/galeria");
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await requirePermission("galeria", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const patch: Partial<Omit<GalleryImage, "id">> = {};
  if (typeof b.src === "string") patch.src = b.src.trim();
  if (typeof b.full === "string") patch.full = b.full.trim();
  if (typeof b.caption === "string") patch.caption = b.caption.trim();
  if (b.filter !== undefined) {
    if (!FILTERS.includes(b.filter as GalleryFilter)) return NextResponse.json({ error: "Filtro inválido." }, { status: 422 });
    patch.filter = b.filter as GalleryFilter;
  }
  if (b.span !== undefined) patch.span = b.span === "tall" || b.span === "wide" ? b.span : undefined;

  try {
    const img = await updateGalleryImage(Number(params.id), patch);
    if (!img) return NextResponse.json({ error: "Imagen no encontrada." }, { status: 404 });
    revalidateGallery();
    return NextResponse.json(img);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo actualizar." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requirePermission("galeria", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const ok = await deleteGalleryImage(Number(params.id));
    if (!ok) return NextResponse.json({ error: "Imagen no encontrada." }, { status: 404 });
    revalidateGallery();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo eliminar." }, { status: 500 });
  }
}
