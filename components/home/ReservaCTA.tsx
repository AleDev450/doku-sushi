import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { HOME_RESERVA_DEFAULT, type HomeReserva } from "@/lib/content";

export default function ReservaCTA({ content = HOME_RESERVA_DEFAULT }: { content?: HomeReserva }) {
  return (
    <section className="relative overflow-hidden border-t border-[var(--line)] py-[150px] text-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${content.image}')`, filter: "brightness(0.32) saturate(1.05)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(227,6,19,0.12),transparent_60%),linear-gradient(180deg,rgba(10,10,10,0.7),rgba(10,10,10,0.9))]" />
      <Reveal className="relative z-[2] mx-auto max-w-[720px] px-6">
        <span className="kicker mb-5 block">{content.kicker}</span>
        <h2 className="display text-[clamp(2.4rem,5vw,4rem)] leading-[1.05]">
          {content.title} <span className="text-seal">{content.highlight}</span>
        </h2>
        <p className="mx-auto mb-10 mt-6 max-w-[460px] font-light text-mist">{content.text}</p>
        <Link href="/reservar" className="btn btn-solid !px-10 !py-4 !text-[0.9rem]">
          {content.button}
        </Link>
      </Reveal>
    </section>
  );
}
