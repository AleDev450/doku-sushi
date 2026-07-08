import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera, Users, ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Stars from "@/components/ui/Stars";
import { getExperiences } from "@/lib/api";
import { getPageContent, PAGE_HEADERS_DEFAULT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Experiencias",
  description: "Cada evento se convierte en un álbum vivo. Revive las noches de Doko con fotos, videos y reseñas.",
};

export default async function ExperienciasPage() {
  const [experiences, headers] = await Promise.all([getExperiences(), getPageContent("page_headers", PAGE_HEADERS_DEFAULT)]);
  const h = headers.experiencias;

  return (
    <>
      <PageHeader
        kicker={h.kicker}
        title={<>{h.title} <span className="text-seal">{h.highlight}</span></>}
        subtitle={h.subtitle}
      />

      <section className="bg-ink py-[80px]">
        <div className="wrap grid gap-8 md:grid-cols-2">
          {experiences.map((exp, n) => (
            <Reveal key={exp.slug} delay={n * 0.08}>
              <Link
                href={`/experiencias/${exp.slug}`}
                className="group block overflow-hidden rounded-lg border border-[var(--line)] bg-ink-2 transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-seal/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={exp.cover} alt={exp.eventTitle} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-[1000ms] ease-premium group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.85)] to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <Stars rating={exp.rating} className="text-[0.9rem]" />
                        <span className="text-[0.8rem] text-white">{exp.rating}</span>
                      </div>
                      <h3 className="font-display text-[1.7rem] font-semibold text-white">{exp.eventTitle}</h3>
                      <p className="text-[0.82rem] text-mist">{exp.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-6">
                  <div className="flex gap-6 text-[0.82rem] text-mist">
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-seal" /> {exp.attendees}</span>
                    <span className="flex items-center gap-1.5"><Camera size={14} className="text-seal" /> {exp.photos} fotos</span>
                    <span>{exp.reviews} reseñas</span>
                  </div>
                  <ArrowRight size={18} className="text-mist transition-transform duration-500 ease-premium group-hover:translate-x-1 group-hover:text-white" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
