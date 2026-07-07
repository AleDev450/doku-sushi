// GET  /api/users  -> lista de usuarios (superadmin)
// POST /api/users  -> crea un usuario (superadmin)

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Role } from "@/lib/auth";
import { requireSuperadmin, listProfiles, createUser } from "@/lib/rbac";

const ROLES: Role[] = ["superadmin", "editor"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  if (!(await requireSuperadmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }
  return NextResponse.json(await listProfiles());
}

export async function POST(req: Request) {
  if (!(await requireSuperadmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const password = typeof b.password === "string" ? b.password : "";
  const fullName = typeof b.fullName === "string" ? b.fullName.trim() : "";
  const role = b.role as Role;

  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Correo inválido." }, { status: 422 });
  if (password.length < 8) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 422 });
  if (!ROLES.includes(role)) return NextResponse.json({ error: "Rol inválido." }, { status: 422 });

  const { error } = await createUser({ email, password, fullName, role });
  if (error) return NextResponse.json({ error }, { status: 422 });

  revalidatePath("/admin/usuarios");
  return NextResponse.json({ ok: true }, { status: 201 });
}
