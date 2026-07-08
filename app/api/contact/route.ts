// POST /api/contact  -> enviar mensaje (público)
// GET  /api/contact  -> listar (staff)

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createMessage, listMessages } from "@/lib/operations";
import { requirePermission } from "@/lib/rbac";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  if (!(await requirePermission("mensajes", "view"))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }
  return NextResponse.json(await listMessages());
}

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";
  if (!name) return NextResponse.json({ error: "El nombre es obligatorio." }, { status: 422 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Correo inválido." }, { status: 422 });
  if (!message) return NextResponse.json({ error: "Escribe tu mensaje." }, { status: 422 });

  try {
    const msg = await createMessage({
      name,
      email,
      subject: typeof b.subject === "string" ? b.subject.trim() : "",
      message,
    });
    revalidatePath("/admin/mensajes");
    return NextResponse.json(msg, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo enviar." }, { status: 500 });
  }
}
