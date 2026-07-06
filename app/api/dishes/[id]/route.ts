// GET    /api/dishes/:id  -> un plato
// PATCH  /api/dishes/:id  -> actualiza campos del plato
// DELETE /api/dishes/:id  -> elimina el plato

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Dish, MenuCategory } from "@/lib/types";
import { readTable, writeTable } from "@/lib/db";

const CATEGORIES: MenuCategory[] = [
  "entradas", "makis", "nigiris", "sashimis", "calientes", "postres", "bebidas",
];

function revalidateDishes() {
  revalidatePath("/");
  revalidatePath("/carta");
  revalidatePath("/admin/carta");
}

type Ctx = { params: { id: string } };

async function findDish(id: number): Promise<{ dishes: Dish[]; index: number }> {
  const dishes = await readTable<Dish>("dishes");
  return { dishes, index: dishes.findIndex((d) => d.id === id) };
}

export async function GET(_req: Request, { params }: Ctx) {
  const { dishes, index } = await findDish(Number(params.id));
  if (index === -1) return NextResponse.json({ error: "Plato no encontrado." }, { status: 404 });
  return NextResponse.json(dishes[index]);
}

export async function PATCH(req: Request, { params }: Ctx) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { dishes, index } = await findDish(Number(params.id));
  if (index === -1) return NextResponse.json({ error: "Plato no encontrado." }, { status: 404 });

  const current = dishes[index];
  const next: Dish = { ...current };

  if (typeof body.name === "string") next.name = body.name.trim();
  if (typeof body.description === "string") next.description = body.description.trim();
  if (typeof body.price === "string") next.price = body.price.trim();
  if (typeof body.image === "string") next.image = body.image.trim();
  if (typeof body.featured === "boolean") next.featured = body.featured;
  if (body.category !== undefined) {
    if (!CATEGORIES.includes(body.category as MenuCategory)) {
      return NextResponse.json({ error: "Categoría inválida." }, { status: 422 });
    }
    next.category = body.category as MenuCategory;
  }

  if (!next.name) return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 422 });
  if (!next.price) return NextResponse.json({ error: "El precio es obligatorio." }, { status: 422 });

  dishes[index] = next;
  await writeTable("dishes", dishes);
  revalidateDishes();
  return NextResponse.json(next);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { dishes, index } = await findDish(Number(params.id));
  if (index === -1) return NextResponse.json({ error: "Plato no encontrado." }, { status: 404 });

  const [removed] = dishes.splice(index, 1);
  await writeTable("dishes", dishes);
  revalidateDishes();
  return NextResponse.json({ ok: true, removed });
}
