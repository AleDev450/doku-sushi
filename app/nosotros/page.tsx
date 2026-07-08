import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import ReservaCTA from "@/components/home/ReservaCTA";
import { getPageContent, ABOUT_PAGE_DEFAULT, HOME_RESERVA_DEFAULT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "La historia de Doko: el encuentro entre la cocina japonesa y el alma peruana en una sola barra.",
};

export const dynamic = "force-dynamic";

export default async function NosotrosPage() {
  const [a, reserva] = await Promise.all([
    getPageContent("about_page", ABOUT_PAGE_DEFAULT),
    getPageContent("home_reserva", HOME_RESERVA_DEFAULT),
  ]);

  return (
    <>
      <PageHeader
        kicker={a.headerKicker}
        title={<>{a.headerTitle} <span className="text-seal">{a.headerHighlight}</span></>}
      />

      {/* Historia + concepto */}
      <section className="bg-paper py-[110px] text-ink">
        <div className="wrap grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded shadow-[0_40px_90px_-30px_rgba(0,0,0,0.4)]">
              {a.conceptImage && <Image src={a.conceptImage} alt="" fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <span className="kicker mb-5 block">{a.conceptKicker}</span>
            <h2 className="display text-[clamp(1.9rem,3.5vw,2.8rem)] text-ink">{a.conceptTitle}</h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-neutral-600">{a.conceptP1}</p>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-neutral-500">{a.conceptP2}</p>
          </Reveal>
        </div>
      </section>

      {/* Misión / Visión */}
      <section className="bg-paper-soft py-[100px] text-ink">
        <div className="wrap grid gap-2 overflow-hidden rounded-lg border border-paper-2 bg-paper-2 md:grid-cols-2">
          <Reveal className="bg-paper p-10">
            <div className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-seal">Misión</div>
            <h3 className="mb-3 font-display text-[1.6rem] font-semibold">{a.missionTitle}</h3>
            <p className="text-[0.98rem] text-neutral-600">{a.missionText}</p>
          </Reveal>
          <Reveal delay={0.1} className="bg-paper p-10">
            <div className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-seal">Visión</div>
            <h3 className="mb-3 font-display text-[1.6rem] font-semibold">{a.visionTitle}</h3>
            <p className="text-[0.98rem] text-neutral-600">{a.visionText}</p>
          </Reveal>
        </div>
      </section>

      {/* Chef */}
      <section className="bg-ink py-[110px]">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-lg lg:aspect-auto lg:h-[560px]">
            {a.chefImage && <Image src={a.chefImage} alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />}
          </Reveal>
          <Reveal delay={0.1}>
            <span className="kicker mb-5 block">{a.chefKicker}</span>
            <h2 className="display text-[clamp(2rem,4vw,3rem)] text-white">{a.chefName}</h2>
            <p className="mt-2 text-[0.9rem] uppercase tracking-[0.14em] text-seal">{a.chefRole}</p>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-mist">{a.chefBio}</p>
            <blockquote className="mt-8 border-l-2 border-seal pl-6 font-display text-[1.4rem] italic leading-snug text-white">
              &ldquo;{a.chefQuote}&rdquo;
            </blockquote>
          </Reveal>
        </div>
      </section>

      <ReservaCTA content={reserva} />
    </>
  );
}
