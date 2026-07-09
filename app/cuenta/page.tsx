import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { getUserFeedback } from "@/lib/feedback";
import AccountForm from "@/components/account/AccountForm";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false } };
export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = { superadmin: "Administrador", editor: "Colaborador", user: "Comunidad Doko" };

export default async function CuentaPage() {
  const me = await getCurrentProfile();
  if (!me) redirect("/login?next=/cuenta");

  let feedback: Awaited<ReturnType<typeof getUserFeedback>> = [];
  try {
    feedback = await getUserFeedback(me.id);
  } catch {
    /* si falta config/tabla, mostramos la cuenta igual */
  }
  const displayName = me.full_name || me.email.split("@")[0];

  return (
    <div className="bg-ink">
      <section className="wrap max-w-[760px] py-[clamp(90px,12vw,120px)]">
        <span className="kicker mb-3 block">アカウント · Mi cuenta</span>
        <div className="mb-8 flex items-center gap-4">
          {me.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={me.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="grid h-16 w-16 place-items-center rounded-full bg-seal/20 font-display text-[1.6rem] font-semibold text-seal">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <h1 className="font-display text-[1.9rem] font-semibold">{displayName}</h1>
            <p className="text-[0.85rem] text-mist">{ROLE_LABEL[me.role] ?? "Comunidad Doko"}</p>
          </div>
        </div>

        <AccountForm initialName={displayName} email={me.email} initialAvatar={me.avatar_url ?? ""} />

        {me.role !== "user" && (
          <Link href="/admin" className="mt-4 inline-block text-[0.85rem] text-seal hover:underline">→ Ir al panel de administración</Link>
        )}

        <h2 className="mb-4 mt-12 font-display text-[1.4rem] font-semibold">Mis comentarios</h2>
        {feedback.length === 0 ? (
          <p className="text-mist-2">Aún no has dejado feedback. Visita un evento o experiencia y comparte tu opinión.</p>
        ) : (
          <div className="space-y-3">
            {feedback.map((f) => {
              const url = f.targetType === "event" ? `/eventos/${f.targetSlug}` : `/experiencias/${f.targetSlug}`;
              return (
                <Link key={f.id} href={url} className="block rounded-xl border border-[var(--line)] bg-ink-2 p-4 transition-colors hover:border-white/20">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={13} className={n <= f.rating ? "fill-seal text-seal" : "text-mist-2"} />)}
                  </div>
                  <p className="mt-2 text-[0.9rem] text-neutral-300">{f.text}</p>
                  <p className="mt-2 text-[0.72rem] text-mist-2">{new Date(f.createdAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
