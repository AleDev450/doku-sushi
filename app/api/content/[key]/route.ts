// PUT /api/content/:key  -> guarda un bloque de contenido de página (staff con permiso 'paginas')

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { setPageContent } from "@/lib/content";
import { requirePermission } from "@/lib/rbac";

const ALLOWED = new Set(["home_hero", "home_about"]);

export async function PUT(req: Request, { params }: { params: { key: string } }) {
  if (!(await requirePermission("paginas", "edit"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  if (!ALLOWED.has(params.key)) {
    return NextResponse.json({ error: "Bloque desconocido." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 422 });
  }

  try {
    await setPageContent(params.key, body);
    revalidatePath("/");
    revalidatePath("/admin/paginas");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo guardar." }, { status: 500 });
  }
}
