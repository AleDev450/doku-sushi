// GET  /api/dishes        -> lista de platos
// POST /api/dishes        -> crea un plato
//
// Persistencia local vía lib/db (archivo db/dishes.json).

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Dish, MenuCategory } from "@/lib/types";
import { readTable, writeTable, nextId } from "@/lib/db";

/** Invalida las rutas públicas que muestran platos, para que reflejen cambios. */
function revalidateDishes() {
  revalidatePath("/");
  revalidatePath("/carta");
  revalidatePath("/admin/carta");
}

const CATEGORIES: MenuCategory[] = [
  "entradas", "makis", "nigiris", "sashimis", "calientes", "postres", "bebidas",
];

/** Valida y normaliza el payload de un plato. Devuelve el objeto o un error. */
function parseDish(body: unknown): { data: Omit<Dish, "id"> } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Cuerpo inválido." };
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const description = typeof b.description === "string" ? b.description.trim() : "";
  const price = typeof b.price === "string" ? b.price.trim() : "";
  const image = typeof b.image === "string" ? b.image.trim() : "";
  const category = b.category as MenuCategory;

  if (!name) return { error: "El nombre es obligatorio." };
  if (!price) return { error: "El precio es obligatorio." };
  if (!CATEGORIES.includes(category)) return { error: "Categoría inválida." };

  return {
    data: { name, description, price, image, category, featured: Boolean(b.featured) },
  };
}

export async function GET() {
  const dishes = await readTable<Dish>("dishes");
  return NextResponse.json(dishes);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parseDish(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 422 });

  const dishes = await readTable<Dish>("dishes");
  const dish: Dish = { id: nextId(dishes), ...parsed.data };
  dishes.push(dish);
  await writeTable("dishes", dishes);
  revalidateDishes();

  return NextResponse.json(dish, { status: 201 });
}
