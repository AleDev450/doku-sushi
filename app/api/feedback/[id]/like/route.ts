// POST /api/feedback/:id/like  -> alterna tu like (requiere sesión)

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { toggleLike } from "@/lib/feedback";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const me = await requireUser();
  if (!me) return NextResponse.json({ error: "Inicia sesión para dar like." }, { status: 401 });

  try {
    const result = await toggleLike(Number(params.id), me.id);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error." }, { status: 500 });
  }
}
