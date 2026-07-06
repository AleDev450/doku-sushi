import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Calendar, ArrowLeft, Sparkles } from "lucide-react";
import { getEvent, getEventSlugs } from "@/lib/api";
import { longDate, timeOf } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import { EventGallery, VideoGrid } from "@/components/events/EventGallery";

export async function generateStaticParams() {
  return (await getEventSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEvent(params.slug);
  if (!event) return { title: "Evento no encontrado" };
  return { title: event.title, description: event.shortDescription };
}

export default async function EventoDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug);
  if (!event) notFound();

  const isPast = event.status === "past";

  return (
    <>
      {/* HERO */}
      <section className="relative flex h-[68vh] min-h-[480px] items-end overflow-hidden">
        <Image src={event.cover} alt={event.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.4)_0%,transparent_40%,rgba(10,10,10,0.9)_100%)]" />
        <div className="relative z-[2] w-full pb-14 pt-[120px]">
          <div className="wrap">
            <Link href="/eventos" className="mb-6 inline-flex items-center gap-2 text-[0.82rem] text-mist transition-colors hover:text-white">
              <ArrowLeft size={15} /> Volver a eventos
            </Link>
            <div className="mb-4 flex items-center gap-3">
              <span className={`rounded-full px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.16em] ${isPast ? "border border-[var(--line)] bg-white/10 text-mist" : "bg-seal text-white"}`}>
                {isPast ? "Finalizado" : "Próximo evento"}
              </span>
            </div>
            <h1 className="display max-w-[820px] text-[clamp(2.6rem,6vw,5rem)] text-white">{event.title}</h1>
            <div className="mt-6 flex flex-wrap gap-6 text-[0.9rem] text-mist">
              <span className="flex items-center gap-2"><Calendar size={16} className="text-seal" /> {longDate(event.startsAt)}</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-seal" /> {timeOf(event.startsAt)}</span>
              <span className="flex items-center gap-2"><MapPin size={16} className="text-seal" /> {event.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* REVIVE banner (solo eventos pasados) */}
      {isPast && (
        <div className="border-b border-[var(--line)] bg-seal/10">
          <div className="wrap flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-seal" />
              <span className="font-display text-[1.1rem]">Este evento ya sucedió — revive cada momento.</span>
            </div>
            <Link href={`/experiencias/${event.slug}`} className="btn btn-solid">Abrir álbum de la experiencia</Link>
          </div>
        </div>
      )}

      {/* CONTENIDO */}
      <section className="bg-ink py-20">
        <div className="wrap grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          {/* Columna principal */}
          <div className="space-y-16">
            <Reveal>
              <p className="max-w-[640px] text-[1.1rem] font-light leading-relaxed text-mist">{event.fullDescription}</p>
            </Reveal>

            <Reveal>
              <h2 className="mb-6 font-display text-[1.6rem] font-semibold">Galería</h2>
              <EventGallery images={event.gallery} />
            </Reveal>

            {event.videos.length > 0 && (
              <Reveal>
                <h2 className="mb-6 font-display text-[1.6rem] font-semibold">Videos</h2>
                <VideoGrid videos={event.videos} />
              </Reveal>
            )}

            <Reveal>
              <h2 className="mb-6 font-display text-[1.6rem] font-semibold">Cronograma</h2>
              <div className="space-y-0">
                {event.schedule.map((s, i) => (
                  <div key={i} className="flex gap-6 border-b border-[var(--line)] py-5 last:border-none">
                    <div className="w-16 flex-shrink-0 font-display text-[1.1rem] font-semibold text-seal">{s.time}</div>
                    <div>
                      <div className="font-medium">{s.title}</div>
                      {s.detail && <div className="mt-1 text-[0.9rem] font-light text-mist">{s.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {event.specialMenu.length > 0 && (
              <Reveal>
                <h2 className="mb-6 font-display text-[1.6rem] font-semibold">Menú especial</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {event.specialMenu.map((m, i) => (
                    <div key={i} className="rounded-md border border-[var(--line)] bg-ink-2 p-5">
                      <div className="font-display text-[1.15rem] font-semibold">{m.name}</div>
                      <div className="mt-1.5 text-[0.88rem] font-light text-mist">{m.description}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {event.guestChef && (
              <Reveal className="overflow-hidden rounded-lg border border-[var(--line)] bg-ink-2">
                <div className="relative aspect-[4/3]">
                  <Image src={event.guestChef.photo} alt={event.guestChef.name} fill sizes="400px" className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="text-[0.68rem] uppercase tracking-[0.2em] text-seal">Chef invitado</div>
                  <div className="mt-1 font-display text-[1.35rem] font-semibold">{event.guestChef.name}</div>
                  <div className="text-[0.8rem] text-mist">{event.guestChef.role}</div>
                  <p className="mt-3 text-[0.88rem] font-light text-mist">{event.guestChef.bio}</p>
                </div>
              </Reveal>
            )}

            <Reveal className="rounded-lg border border-[var(--line)] bg-ink-2 p-6">
              <div className="text-[0.68rem] uppercase tracking-[0.2em] text-seal">Ubicación</div>
              <div className="mt-1 font-display text-[1.1rem]">{event.map.address}</div>
              <div className="relative mt-4 h-40 overflow-hidden rounded-md border border-[var(--line)]">
                <iframe
                  title="Mapa del evento"
                  className="h-full w-full grayscale invert-[0.92] contrast-[0.9]"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.map.lng - 0.01}%2C${event.map.lat - 0.008}%2C${event.map.lng + 0.01}%2C${event.map.lat + 0.008}&layer=mapnik`}
                />
              </div>
              {!isPast && (
                <Link href="/reservar" className="btn btn-solid mt-5 w-full">Reservar para este evento</Link>
              )}
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
