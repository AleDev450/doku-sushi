import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/api";
import { longDate } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Blog",
  description: "Historias, técnica y comunidad detrás de la barra de Doko.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="bg-ink">
      <section className="wrap py-[clamp(90px,12vw,130px)]">
        <span className="kicker mb-5 block">読み物 · Blog</span>
        <h1 className="display text-[clamp(2.2rem,5vw,3.6rem)]">
          Desde la <span className="text-seal">barra.</span>
        </h1>
        <p className="mt-5 max-w-[560px] text-[1.02rem] text-mist">
          Historias, técnica y la comunidad que se sienta cada noche en Doko.
        </p>

        {posts.length === 0 ? (
          <p className="mt-16 text-mist-2">Aún no hay publicaciones. Vuelve pronto.</p>
        ) : (
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, n) => (
              <Reveal key={p.id} delay={(n % 3) * 0.08}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink-2">
                    {p.cover && (
                      <Image
                        src={p.cover}
                        alt={p.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.06]"
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    {p.tags[0] && <span className="kicker">{p.tags[0]}</span>}
                    <h2 className="mt-2 font-display text-[1.35rem] font-semibold leading-snug transition-colors group-hover:text-seal">
                      {p.title}
                    </h2>
                    {p.excerpt && <p className="mt-2 line-clamp-2 text-[0.9rem] text-mist">{p.excerpt}</p>}
                    <p className="mt-3 text-[0.76rem] text-mist-2">
                      {p.publishedAt ? longDate(p.publishedAt) : ""} · {p.author}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
