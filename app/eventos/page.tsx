import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import EventCard from "@/components/events/EventCard";
import Reveal from "@/components/ui/Reveal";
import ReservaCTA from "@/components/home/ReservaCTA";
import { getEvents } from "@/lib/api";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Descubre las próximas noches temáticas, cenas omakase y experiencias de Doko en Lima.",
};

export default async function EventosPage() {
  const events = await getEvents();
  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past");

  return (
    <>
      <PageHeader
        kicker="催し · Agenda"
        title={<>Nuestros <span className="text-seal">eventos.</span></>}
        subtitle="Noches temáticas, chefs invitados y menús irrepetibles. Reserva tu lugar o revive los que ya pasaron."
      />

      <section className="bg-ink py-20">
        <div className="wrap">
          {upcoming.length > 0 && (
            <>
              <h2 className="mb-8 font-display text-[1.5rem] font-semibold">Próximos</h2>
              <div className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((e, n) => (
                  <Reveal key={e.slug} delay={n * 0.08}>
                    <EventCard event={e} />
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {past.length > 0 && (
            <>
              <h2 className="mb-8 font-display text-[1.5rem] font-semibold text-mist">Ya sucedieron</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {past.map((e, n) => (
                  <Reveal key={e.slug} delay={n * 0.08}>
                    <EventCard event={e} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <ReservaCTA />
    </>
  );
}
