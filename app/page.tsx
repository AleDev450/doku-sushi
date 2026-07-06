import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ReservaCTA from "@/components/home/ReservaCTA";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import Stars from "@/components/ui/Stars";
import EventCard from "@/components/events/EventCard";
import Testimonials from "@/components/testimonials/Testimonials";
import { getUpcomingEvents, getEvents, getFeaturedDishes, getGallery, getTestimonials, getFeaturedExperience } from "@/lib/api";

export default async function HomePage() {
  const [events, upcoming, dishes, gallery, testimonials, feature] = await Promise.all([
    getEvents(),
    getUpcomingEvents(),
    getFeaturedDishes(),
    getGallery(),
    getTestimonials(),
    getFeaturedExperience(),
  ]);

  const eventPreview = (upcoming.length ? upcoming : events).slice(0, 3);

  return (
    <>
      <Hero />
      <Marquee />

      {/* NOSOTROS (preview) */}
      <section className="bg-paper py-[130px] text-ink">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <Reveal>
            <span className="kicker mb-5 block">私たち · Nuestra historia</span>
            <h2 className="display text-[clamp(2.2rem,4vw,3.4rem)] text-ink">
              Dos culturas,
              <br />
              una <span className="text-seal">misma barra.</span>
            </h2>
            <p className="mt-7 max-w-[520px] text-[1.08rem] text-neutral-600">
              Doko nació de una obsesión: honrar la técnica milimétrica de la cocina japonesa sin renunciar al fuego, la
              acidez y el color del Perú.
            </p>
            <p className="mt-5 max-w-[520px] text-[0.98rem] text-neutral-500">
              Cada plato que sale de nuestra barra es una conversación entre el itamae y el mercado limeño. No servimos
              fusión: servimos memoria.
            </p>
            <Link
              href="/nosotros"
              className="group mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-[0.85rem] tracking-wide text-ink"
            >
              Conoce nuestra historia
              <ArrowRight size={15} className="transition-transform duration-500 ease-premium group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded shadow-[0_40px_90px_-30px_rgba(0,0,0,0.4)]">
              <Image
                src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=1000&q=80&auto=format&fit=crop"
                alt="Chef en la barra"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 left-0 aspect-square w-[44%] overflow-hidden rounded border-[6px] border-paper shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] lg:-left-11">
              <Image
                src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=700&q=80&auto=format&fit=crop"
                alt="Nigiri"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-4 top-6 rounded bg-ink px-5 py-3.5 text-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]">
              <div className="font-display text-[1.05rem] font-semibold">Kenji Nakamura</div>
              <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.2em] text-seal">Chef · Itamae</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EVENTOS (preview) */}
      <section className="bg-ink py-[128px]">
        <div className="wrap">
          <SectionHeader
            kicker="催し · Agenda"
            title={<>Próximos <span className="text-seal">eventos.</span></>}
            subtitle="Noches temáticas, chefs invitados y menús que solo existen una vez. Reserva antes de que se agoten."
            link={{ href: "/eventos", label: "Ver toda la agenda" }}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventPreview.map((e, n) => (
              <Reveal key={e.slug} delay={n * 0.09}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCIAS (preview) */}
      {feature && (
        <section className="border-t border-[var(--line)] bg-[linear-gradient(180deg,#0E0E0E_0%,#0a0a0a_100%)] py-[128px]">
          <div className="wrap">
            <SectionHeader
              kicker="思い出 · Álbum digital"
              title={<>Revive cada <span className="text-seal">experiencia.</span></>}
              subtitle="Cuando la noche termina, el evento no muere: se convierte en un álbum vivo de fotos, videos y voces."
              link={{ href: "/experiencias", label: "Todas las experiencias" }}
            />
            <Reveal className="grid overflow-hidden rounded-lg border border-[var(--line)] bg-ink-2 lg:grid-cols-[1.3fr_1fr]">
              <div className="grid grid-cols-3 gap-2 p-2">
                {feature.album.slice(0, 6).map((a) => (
                  <div key={a.id} className="relative aspect-square overflow-hidden rounded">
                    <Image src={a.src} alt="" fill sizes="200px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center p-10">
                <div className="mb-5 inline-flex items-center gap-2.5 text-[0.68rem] uppercase tracking-[0.2em] text-seal">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-seal" /> Revive la experiencia
                </div>
                <div className="flex items-baseline gap-3.5">
                  <span className="font-display text-[3.4rem] font-bold leading-none">{feature.rating}</span>
                  <div>
                    <Stars rating={feature.rating} className="text-[1rem]" />
                    <div className="text-[0.86rem] text-mist">basado en {feature.reviews} reseñas</div>
                  </div>
                </div>
                <h3 className="mb-1 mt-4 font-display text-[1.7rem] font-semibold">{feature.eventTitle}</h3>
                <p className="mb-6 text-[0.9rem] font-light text-mist">Terraza · {feature.date}</p>
                <div className="grid grid-cols-3 gap-6 border-y border-[var(--line)] py-[22px]">
                  <Stat k={feature.attendees} l="Asistentes" />
                  <Stat k={feature.photos} l="Fotos" />
                  <Stat k={feature.videos} l="Videos" />
                </div>
                <Link
                  href={`/experiencias/${feature.slug}`}
                  className="btn btn-ghost group mt-6 self-start !px-6"
                >
                  Abrir álbum
                  <ArrowRight size={15} className="transition-transform duration-500 ease-premium group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* CARTA (preview) */}
      <section className="bg-paper py-[130px] text-ink">
        <div className="wrap">
          <SectionHeader
            kicker="お品書き · La carta"
            title={<>Platos <span className="text-seal">destacados.</span></>}
            center
            dark={false}
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.slice(0, 6).map((d, n) => (
              <Reveal key={d.id} delay={(n % 3) * 0.08}>
                <div className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-paper-2">
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.08]"
                    />
                    <div className="absolute bottom-0 right-0 rounded-tl-md bg-ink px-4 py-2 font-display text-[1rem] font-semibold text-white">
                      {d.price}
                    </div>
                  </div>
                  <h4 className="mb-1.5 mt-4 font-display text-[1.25rem] font-semibold text-ink">{d.name}</h4>
                  <p className="text-[0.86rem] text-neutral-500">{d.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/carta" className="btn btn-ink !px-8">Ver carta completa</Link>
          </div>
        </div>
      </section>

      {/* GALERÍA (preview) */}
      <section className="border-t border-[var(--line)] bg-ink py-[128px]">
        <div className="wrap">
          <SectionHeader
            kicker="写真 · Galería"
            title={<>El lente de <span className="text-seal">Doko.</span></>}
            subtitle="Comida, gente y noches. Una ventana sin filtros a lo que se vive dentro."
            link={{ href: "/galeria", label: "Ver galería completa" }}
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.slice(0, 4).map((g, n) => (
              <Reveal key={g.id} delay={n * 0.08} className="relative aspect-[3/4] overflow-hidden rounded-md">
                <Image src={g.src} alt={g.caption} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="overflow-hidden bg-paper-soft py-[130px]">
        <div className="wrap">
          <SectionHeader
            kicker="お客様の声 · Testimonios"
            title={<>Lo que dicen <span className="text-seal">de nosotros.</span></>}
            center
            dark={false}
          />
          <Testimonials items={testimonials} />
        </div>
      </section>

      <ReservaCTA />
    </>
  );
}

function Stat({ k, l }: { k: number; l: string }) {
  return (
    <div>
      <div className="font-display text-[1.6rem] font-bold">{k}</div>
      <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.16em] text-mist-2">{l}</div>
    </div>
  );
}
