import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import ReservaCTA from "@/components/home/ReservaCTA";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "La historia de Doko: el encuentro entre la cocina japonesa y el alma peruana en una sola barra.",
};

export default function NosotrosPage() {
  return (
    <>
      <PageHeader
        kicker="私たち · Nuestra historia"
        title={<>Dos culturas,<br />una <span className="text-seal">misma barra.</span></>}
      />

      {/* Historia + concepto */}
      <section className="bg-paper py-[110px] text-ink">
        <div className="wrap grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded shadow-[0_40px_90px_-30px_rgba(0,0,0,0.4)]">
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80&auto=format&fit=crop"
                alt="El salón de Doko"
                fill
                sizes="(max-width:1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <span className="kicker mb-5 block">El concepto</span>
            <h2 className="display text-[clamp(1.9rem,3.5vw,2.8rem)] text-ink">Nikkei, sin atajos.</h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-neutral-600">
              Doko nació de una obsesión: honrar la técnica milimétrica de la cocina japonesa sin renunciar al fuego, la
              acidez y el color del Perú. No servimos fusión de moda; servimos el resultado de años entendiendo dos
              tradiciones que, resulta, siempre hablaron el mismo idioma.
            </p>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-neutral-500">
              El pescado se corta al momento. El ají amarillo reemplaza al wasabi cuando la noche lo pide. El leche de
              tigre encuentra su lugar junto al ponzu. Cada plato es una conversación entre el itamae y el mercado
              limeño de esa mañana.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Misión / Visión */}
      <section className="bg-paper-soft py-[100px] text-ink">
        <div className="wrap grid gap-2 overflow-hidden rounded-lg border border-paper-2 bg-paper-2 md:grid-cols-2">
          <Reveal className="bg-paper p-10">
            <div className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-seal">Misión</div>
            <h3 className="mb-3 font-display text-[1.6rem] font-semibold">Cada noche importa</h3>
            <p className="text-[0.98rem] text-neutral-600">
              Convertir una cena en un recuerdo que valga la pena revivir. Que quien se siente en nuestra barra sienta
              que esa noche fue solo suya.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="bg-paper p-10">
            <div className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-seal">Visión</div>
            <h3 className="mb-3 font-display text-[1.6rem] font-semibold">Una comunidad, no una lista</h3>
            <p className="text-[0.98rem] text-neutral-600">
              Ser el lugar de Lima donde el Nikkei deja de ser un plato y se vuelve un lugar de pertenencia: gente que
              vuelve, que se reconoce, que revive cada experiencia junta.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Chef */}
      <section className="bg-ink py-[110px]">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-lg lg:aspect-auto lg:h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=1000&q=80&auto=format&fit=crop"
              alt="Chef Kenyo Oyakawa"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="kicker mb-5 block">El chef</span>
            <h2 className="display text-[clamp(2rem,4vw,3rem)] text-white">Kenyo Oyakawa</h2>
            <p className="mt-2 text-[0.9rem] uppercase tracking-[0.14em] text-seal">Chef · Itamae</p>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-mist">
              Formado en Tokio y curtido en las cevicherías de Lima, Kenji entiende la barra como un escenario. Su
              cocina es precisa pero nunca fría: cada corte tiene intención, cada plato tiene tiempo.
            </p>
            <blockquote className="mt-8 border-l-2 border-seal pl-6 font-display text-[1.4rem] italic leading-snug text-white">
              &ldquo;El respeto por el producto es el único idioma que Japón y el Perú siempre compartieron.&rdquo;
            </blockquote>
          </Reveal>
        </div>
      </section>

      <ReservaCTA />
    </>
  );
}
