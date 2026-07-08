// POST /api/testimonials  -> crea un testimonio

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createTestimonial, type TestimonialInput } from "@/lib/api";
import { requirePermission } from "@/lib/rbac";

function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/admin/testimonios");
}

function parseTestimonial(body: unknown): { data: TestimonialInput } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Cuerpo inválido." };
  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const quote = typeof b.quote === "string" ? b.quote.trim() : "";
  const rating = Number(b.rating);
  if (!name) return { error: "El nombre es obligatorio." };
  if (!quote) return { error: "La cita es obligatoria." };
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return { error: "La calificación debe ser de 1 a 5." };
  return {
    data: {
      name,
      role: typeof b.role === "string" ? b.role.trim() : "",
      avatar: typeof b.avatar === "string" ? b.avatar.trim() : "",
      rating,
      quote,
    },
  };
}

export async function POST(req: Request) {
  if (!(await requirePermission("testimonios", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parseTestimonial(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 422 });

  try {
    const t = await createTestimonial(parsed.data);
    revalidateTestimonials();
    return NextResponse.json(t, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo crear." }, { status: 500 });
  }
}
