import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { EventSummary } from "@/lib/types";
import { eventBadge, timeOf } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function EventCard({ event }: { event: EventSummary }) {
  const badge = eventBadge(event.startsAt);
  const isPast = event.status === "past";

  return (
    <article className="group flex flex-col overflow-hidden rounded-md border border-[var(--line)] bg-ink-2 transition-all duration-500 ease-premium hover:-translate-y-2 hover:border-seal/40 hover:shadow-[0_40px_70px_-34px_rgba(0,0,0,0.8)]">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={event.cover}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1000ms] ease-premium group-hover:scale-[1.07]"
        />
        <div className="absolute left-4 top-4 rounded border border-[var(--line)] bg-[rgba(14,14,14,0.82)] px-3 py-2 text-center leading-none backdrop-blur">
          <div className="font-display text-[1.3rem] font-bold text-white">{badge.day}</div>
          <div className="mt-1 text-[0.6rem] uppercase tracking-[0.22em] text-seal">{badge.month}</div>
        </div>
        <div
          className={cn(
            "absolute right-4 top-4 rounded-full px-2.5 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.16em]",
            isPast ? "border border-[var(--line)] bg-white/10 text-mist" : "bg-seal text-white"
          )}
        >
          {isPast ? "Finalizado" : "Próximo"}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 font-display text-[1.4rem] font-semibold leading-tight">{event.title}</h3>
        <div className="mb-3.5 flex gap-4 text-[0.76rem] tracking-wide text-mist">
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {timeOf(event.startsAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {event.location}
          </span>
        </div>
        <p className="mb-5 flex-1 font-light text-[0.9rem] text-mist">{event.shortDescription}</p>

        <div className="flex items-center justify-between gap-3.5 border-t border-[var(--line)] pt-[18px]">
          <div className="flex items-center gap-2.5">
            <div className="flex">
              {event.attendeesPreview.map((a, i) => (
                <span
                  key={a.id}
                  className="relative -ml-2.5 h-[26px] w-[26px] rounded-full border-2 border-ink-2 bg-cover bg-center first:ml-0"
                  style={{ backgroundImage: `url('${a.avatar}')`, zIndex: 3 - i }}
                />
              ))}
            </div>
            <span className="text-[0.74rem] text-mist">
              <b className="font-medium text-white">{event.attendeesCount}</b> {isPast ? "asistieron" : "asistentes"}
            </span>
          </div>

          {isPast ? (
            <Link href={`/experiencias/${event.slug}`} className="btn btn-ghost !px-[18px] !py-2 !text-[0.76rem]">
              Revive →
            </Link>
          ) : (
            <Link href="/reservar" className="btn btn-solid !px-[18px] !py-2 !text-[0.76rem]">
              Reservar
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
