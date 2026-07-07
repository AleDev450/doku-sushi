// PATCH  /api/experiences/:slug  -> actualiza la experiencia
// DELETE /api/experiences/:slug  -> elimina la experiencia

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateExperience, deleteExperience, parseExperienceInput } from "@/lib/api";
import { requirePermission } from "@/lib/rbac";

type Ctx = { params: { slug: string } };

function revalidateExperiences(slug?: string) {
  revalidatePath("/");
  revalidatePath("/experiencias");
  revalidatePath("/admin/experiencias");
  if (slug) revalidatePath(`/experiencias/${slug}`);
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await requirePermission("experiencias", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = parseExperienceInput(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 422 });

  try {
    const exp = await updateExperience(params.slug, parsed.data);
    if (!exp) return NextResponse.json({ error: "Experiencia no encontrada." }, { status: 404 });
    revalidateExperiences(params.slug);
    revalidateExperiences(exp.slug);
    return NextResponse.json(exp);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo actualizar." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await requirePermission("experiencias", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const ok = await deleteExperience(params.slug);
    if (!ok) return NextResponse.json({ error: "Experiencia no encontrada." }, { status: 404 });
    revalidateExperiences(params.slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo eliminar." }, { status: 500 });
  }
}
