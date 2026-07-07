// POST /api/experiences  -> crea una experiencia

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createExperience, parseExperienceInput } from "@/lib/api";
import { requirePermission } from "@/lib/rbac";

function revalidateExperiences(slug?: string) {
  revalidatePath("/");
  revalidatePath("/experiencias");
  revalidatePath("/admin/experiencias");
  if (slug) revalidatePath(`/experiencias/${slug}`);
}

export async function POST(req: Request) {
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
    const exp = await createExperience(parsed.data);
    revalidateExperiences(exp.slug);
    return NextResponse.json(exp, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo crear la experiencia." },
      { status: 500 }
    );
  }
}
