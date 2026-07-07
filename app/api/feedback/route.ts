// GET  /api/feedback?target_type=&target_slug=  -> lista (público; incluye likedByMe si hay sesión)
// POST /api/feedback                             -> deja feedback (requiere sesión)

import { NextResponse } from "next/server";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import { getFeedback, addFeedback, type FeedbackTarget } from "@/lib/feedback";

const TARGETS: FeedbackTarget[] = ["event", "experience"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetType = searchParams.get("target_type") as FeedbackTarget;
  const targetSlug = searchParams.get("target_slug") ?? "";
  if (!TARGETS.includes(targetType) || !targetSlug) {
    return NextResponse.json({ error: "Parámetros inválidos." }, { status: 400 });
  }
  const me = await getCurrentProfile();
  const items = await getFeedback(targetType, targetSlug, me?.id ?? null);
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const me = await requireUser();
  if (!me) return NextResponse.json({ error: "Inicia sesión para dejar tu feedback." }, { status: 401 });

  let b: Record<string, unknown>;
  try {
    b = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const targetType = b.target_type as FeedbackTarget;
  const targetSlug = typeof b.target_slug === "string" ? b.target_slug : "";
  const rating = Number(b.rating);
  const text = typeof b.text === "string" ? b.text.trim() : "";

  if (!TARGETS.includes(targetType) || !targetSlug) return NextResponse.json({ error: "Destino inválido." }, { status: 422 });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: "La calificación debe ser de 1 a 5 estrellas." }, { status: 422 });
  if (!text) return NextResponse.json({ error: "Escribe tu comentario." }, { status: 422 });

  try {
    const item = await addFeedback({
      targetType,
      targetSlug,
      userId: me.id,
      authorName: me.full_name || me.email.split("@")[0],
      authorAvatar: me.avatar_url,
      rating,
      text,
    });
    return NextResponse.json(item, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "No se pudo publicar." }, { status: 500 });
  }
}
