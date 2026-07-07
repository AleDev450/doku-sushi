// GET  /api/dishes  -> lista de platos
// POST /api/dishes  -> crea un plato
//
// La persistencia (Supabase o store local) la resuelve lib/api.

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Dish, MenuCategory } from "@/lib/types";
import { getDishes, createDish } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

const CATEGORIES: MenuCategory[] = [
  "entradas", "makis", "nigiris", "sashimis", "calientes", "postres", "bebidas",
];

/** Invalida las rutas públicas que muestran platos, para que reflejen cambios. */
function revalidateDishes() {
  revalidatePath("/");
  revalidatePath("/carta");
  revalidatePath("/admin/carta");
}

/** Valida y normaliza el payload de un plato. */
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
  const dishes = await getDishes();
  return NextResponse.json(dishes);
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

  const parsed = parseDish(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 422 });

  try {
    const dish = await createDish(parsed.data);
    revalidateDishes();
    return NextResponse.json(dish, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo crear el plato." },
      { status: 500 }
    );
  }
}
