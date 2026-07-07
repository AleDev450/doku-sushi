// GET    /api/dishes/:id  -> un plato
// PATCH  /api/dishes/:id  -> actualiza campos del plato
// DELETE /api/dishes/:id  -> elimina el plato

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Dish, MenuCategory } from "@/lib/types";
import { getDishById, updateDish, deleteDish } from "@/lib/api";

const CATEGORIES: MenuCategory[] = [
  "entradas", "makis", "nigiris", "sashimis", "calientes", "postres", "bebidas",
];

type Ctx = { params: { id: string } };

function revalidateDishes() {
  revalidatePath("/");
  revalidatePath("/carta");
  revalidatePath("/admin/carta");
}

export async function GET(_req: Request, { params }: Ctx) {
  const dish = await getDishById(Number(params.id));
  if (!dish) return NextResponse.json({ error: "Plato no encontrado." }, { status: 404 });
  return NextResponse.json(dish);
}

export async function PATCH(req: Request, { params }: Ctx) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  // Solo aceptamos campos conocidos y validados.
  const patch: Partial<Omit<Dish, "id">> = {};
  if (typeof body.name === "string") patch.name = body.name.trim();
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (typeof body.price === "string") patch.price = body.price.trim();
  if (typeof body.image === "string") patch.image = body.image.trim();
  if (typeof body.featured === "boolean") patch.featured = body.featured;
  if (body.category !== undefined) {
    if (!CATEGORIES.includes(body.category as MenuCategory)) {
      return NextResponse.json({ error: "Categoría inválida." }, { status: 422 });
    }
    patch.category = body.category as MenuCategory;
  }

  if (patch.name !== undefined && !patch.name) {
    return NextResponse.json({ error: "El nombre no puede quedar vacío." }, { status: 422 });
  }
  if (patch.price !== undefined && !patch.price) {
    return NextResponse.json({ error: "El precio no puede quedar vacío." }, { status: 422 });
  }

  try {
    const updated = await updateDish(Number(params.id), patch);
    if (!updated) return NextResponse.json({ error: "Plato no encontrado." }, { status: 404 });
    revalidateDishes();
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo actualizar." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const ok = await deleteDish(Number(params.id));
    if (!ok) return NextResponse.json({ error: "Plato no encontrado." }, { status: 404 });
    revalidateDishes();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo eliminar." },
      { status: 500 }
    );
  }
}
