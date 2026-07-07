// Feedback de la comunidad (comentarios de usuarios + likes) sobre eventos/experiencias.
// Solo servidor (service_role). El user_id SIEMPRE viene de la sesión verificada, nunca del body.

import { createAdminClient } from "@/lib/supabase/admin";

export type FeedbackTarget = "event" | "experience";

export type FeedbackItem = {
  id: number;
  userId: string;
  authorName: string;
  authorAvatar: string | null;
  rating: number;
  text: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
};

export async function getFeedback(
  targetType: FeedbackTarget,
  targetSlug: string,
  currentUserId?: string | null
): Promise<FeedbackItem[]> {
  const sb = createAdminClient();
  const { data: rows, error } = await sb
    .from("feedback")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_slug", targetSlug)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const items = rows ?? [];
  if (items.length === 0) return [];

  const ids = items.map((r) => r.id);
  const { data: likes } = await sb.from("feedback_likes").select("feedback_id, user_id").in("feedback_id", ids);

  const count = new Map<number, number>();
  const mine = new Set<number>();
  for (const l of likes ?? []) {
    count.set(l.feedback_id, (count.get(l.feedback_id) ?? 0) + 1);
    if (currentUserId && l.user_id === currentUserId) mine.add(l.feedback_id);
  }

  return items.map((r) => ({
    id: r.id,
    userId: r.user_id,
    authorName: r.author_name,
    authorAvatar: r.author_avatar,
    rating: r.rating,
    text: r.text,
    createdAt: r.created_at,
    likes: count.get(r.id) ?? 0,
    likedByMe: mine.has(r.id),
  }));
}

export async function addFeedback(input: {
  targetType: FeedbackTarget;
  targetSlug: string;
  userId: string;
  authorName: string;
  authorAvatar: string | null;
  rating: number;
  text: string;
}): Promise<FeedbackItem> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("feedback")
    .insert({
      target_type: input.targetType,
      target_slug: input.targetSlug,
      user_id: input.userId,
      author_name: input.authorName,
      author_avatar: input.authorAvatar,
      rating: input.rating,
      text: input.text,
    })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    userId: data.user_id,
    authorName: data.author_name,
    authorAvatar: data.author_avatar,
    rating: data.rating,
    text: data.text,
    createdAt: data.created_at,
    likes: 0,
    likedByMe: false,
  };
}

/** Borra si es el dueño o si es staff. Devuelve true si borró. */
export async function deleteFeedbackById(id: number, userId: string, isStaff: boolean): Promise<boolean> {
  const sb = createAdminClient();
  const { data: row } = await sb.from("feedback").select("user_id").eq("id", id).maybeSingle();
  if (!row) return false;
  if (row.user_id !== userId && !isStaff) return false;
  const { error } = await sb.from("feedback").delete().eq("id", id);
  if (error) throw error;
  return true;
}

/** Alterna el like del usuario. Devuelve el nuevo estado y el conteo. */
export async function toggleLike(feedbackId: number, userId: string): Promise<{ liked: boolean; likes: number }> {
  const sb = createAdminClient();
  const { data: existing } = await sb
    .from("feedback_likes")
    .select("feedback_id")
    .eq("feedback_id", feedbackId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await sb.from("feedback_likes").delete().eq("feedback_id", feedbackId).eq("user_id", userId);
  } else {
    await sb.from("feedback_likes").insert({ feedback_id: feedbackId, user_id: userId });
  }

  const { count } = await sb
    .from("feedback_likes")
    .select("*", { count: "exact", head: true })
    .eq("feedback_id", feedbackId);

  return { liked: !existing, likes: count ?? 0 };
}
