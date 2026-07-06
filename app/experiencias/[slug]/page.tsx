import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera, Users, Video, Heart, Star } from "lucide-react";
import { getExperience, getExperienceSlugs } from "@/lib/api";
import Reveal from "@/components/ui/Reveal";
import Stars from "@/components/ui/Stars";
import AlbumGrid from "@/components/experiences/AlbumGrid";

export async function generateStaticParams() {
  return (await getExperienceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const exp = await getExperience(params.slug);
  if (!exp) return { title: "Experiencia no encontrada" };
  return {
    title: `${exp.eventTitle} — Experiencia`,
    description: `Revive ${exp.eventTitle}: ${exp.photos} fotos, ${exp.videos} videos y ${exp.reviews} reseñas.`,
  };
}

export default async function ExperienciaDetailPage({ params }: { params: { slug: string } }) {
  const exp = await getExperience(params.slug);
  if (!exp) notFound();

  return (
    <>
      {/* HERO */}
      <section className="relative flex h-[60vh] min-h-[440px] items-end overflow-hidden">
        <Image src={exp.cover} alt={exp.eventTitle} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.4)_0%,transparent_38%,rgba(10,10,10,0.92)_100%)]" />
        <div className="relative z-[2] w-full pb-12 pt-[120px]">
          <div className="wrap">
            <Link href="/experiencias" className="mb-6 inline-flex items-center gap-2 text-[0.82rem] text-mist transition-colors hover:text-white">
              <ArrowLeft size={15} /> Todas las experiencias
            </Link>
            <div className="mb-3 inline-flex items-center gap-2.5 text-[0.68rem] uppercase tracking-[0.2em] text-seal">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-seal" /> Álbum de la experiencia
            </div>
            <h1 className="display text-[clamp(2.4rem,6vw,4.6rem)] text-white">{exp.eventTitle}</h1>
            <p className="mt-3 text-[0.95rem] text-mist">Terraza · {exp.date}</p>
          </div>
        </div>
      </section>

      {/* Barra de rating + stats (mezcla Reviews / Instagram) */}
      <section className="border-b border-[var(--line)] bg-ink-2">
        <div className="wrap grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4">
            <span className="font-display text-[3rem] font-bold leading-none">{exp.rating}</span>
            <div>
              <Stars rating={exp.rating} className="text-[1rem]" />
              <div className="mt-1 text-[0.8rem] text-mist">{exp.reviews} reseñas</div>
            </div>
          </div>
          <StatBox icon={<Users size={18} />} value={exp.attendees} label="Asistentes" />
          <StatBox icon={<Camera size={18} />} value={exp.photos} label="Fotos" />
          <StatBox icon={<Video size={18} />} value={exp.videos} label="Videos" />
        </div>
      </section>

      {/* Story + álbum */}
      <section className="bg-ink py-16">
        <div className="wrap">
          <Reveal className="mx-auto mb-12 max-w-[720px] text-center">
            <p className="text-[1.15rem] font-light leading-relaxed text-mist">{exp.story}</p>
          </Reveal>

          <Reveal>
            <AlbumGrid items={exp.album} />
          </Reveal>
        </div>
      </section>

      {/* Top comentarios */}
      <section className="border-t border-[var(--line)] bg-ink-2 py-16">
        <div className="wrap">
          <h2 className="mb-8 font-display text-[1.7rem] font-semibold">
            Lo que dijeron <span className="text-seal">quienes fueron.</span>
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {exp.topComments.map((c) => (
              <Reveal key={c.id} className="rounded-lg border border-[var(--line)] bg-ink p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-11 w-11 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${c.avatar}')` }} />
                  <div className="flex-1">
                    <div className="font-medium">{c.name}</div>
                    <Stars rating={c.rating} className="text-[0.8rem]" />
                  </div>
                  <span className="flex items-center gap-1.5 text-[0.8rem] text-mist">
                    <Heart size={14} className="fill-seal text-seal" /> {c.likes}
                  </span>
                </div>
                <p className="text-[0.95rem] font-light leading-relaxed text-mist">{c.text}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 rounded-lg border border-dashed border-[var(--line)] bg-ink p-8 text-center">
            <Star size={22} className="mx-auto mb-3 text-seal" />
            <p className="mb-4 font-display text-[1.2rem]">¿Estuviste en esta noche?</p>
            <p className="mb-6 text-[0.9rem] text-mist">Inicia sesión para subir tus fotos y dejar tu reseña.</p>
            <Link href="/login" className="btn btn-solid">Iniciar sesión</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] text-seal">{icon}</span>
      <div>
        <div className="font-display text-[1.5rem] font-bold leading-none">{value}</div>
        <div className="mt-1 text-[0.72rem] uppercase tracking-[0.14em] text-mist-2">{label}</div>
      </div>
    </div>
  );
}
