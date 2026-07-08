import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile, canAccessAdmin } from "@/lib/auth";
import { listAllFeedback } from "@/lib/feedback";
import FeedbackModeration from "@/components/admin/FeedbackModeration";

export const metadata: Metadata = { title: "Comentarios · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminComentariosPage() {
  const me = await getCurrentProfile();
  if (!canAccessAdmin(me)) redirect("/admin");

  const items = await listAllFeedback();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.9rem] font-semibold">Comentarios de la comunidad</h1>
        <p className="text-[0.9rem] text-mist">{items.length} comentarios · modera el feedback de usuarios</p>
      </div>
      <FeedbackModeration items={items} />
    </div>
  );
}
