// Contenido editable de páginas (textos + fotos). Solo servidor.
// Cada bloque tiene una key, defaults (= diseño actual) y se guarda en page_content.

import { createAdminClient } from "@/lib/supabase/admin";

export type HeroSlide = { img: string; cap: string };

export type HomeHero = {
  kicker: string;
  headline: string;
  highlight: string;
  subtitle: string;
  slides: HeroSlide[];
};

export type HomeAbout = {
  kicker: string;
  title: string;
  highlight: string;
  paragraph1: string;
  paragraph2: string;
  image1: string;
  image2: string;
  chefName: string;
  chefRole: string;
  ctaLabel: string;
};

export const HOME_HERO_DEFAULT: HomeHero = {
  kicker: "Nikkei · Lima",
  headline: "La experiencia Nikkei que",
  highlight: "recordarás.",
  subtitle:
    "Donde el rigor japonés y el alma peruana se encuentran a fuego lento. Una mesa, una noche, una comunidad.",
  slides: [
    { img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1800&q=80&auto=format&fit=crop", cap: "Omakase — Barra principal" },
    { img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1800&q=80&auto=format&fit=crop", cap: "Nikkei — Tiradito de la casa" },
    { img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=80&auto=format&fit=crop", cap: "El salón — Luz de noche" },
    { img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1800&q=80&auto=format&fit=crop", cap: "Barra de coctelería japonesa" },
  ],
};

export const HOME_ABOUT_DEFAULT: HomeAbout = {
  kicker: "私たち · Nuestra historia",
  title: "Dos culturas, una",
  highlight: "misma barra.",
  paragraph1:
    "Doko nació de una obsesión: honrar la técnica milimétrica de la cocina japonesa sin renunciar al fuego, la acidez y el color del Perú.",
  paragraph2:
    "Cada plato que sale de nuestra barra es una conversación entre el itamae y el mercado limeño. No servimos fusión: servimos memoria.",
  image1: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=1000&q=80&auto=format&fit=crop",
  image2: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=700&q=80&auto=format&fit=crop",
  chefName: "Kenyo Oyakawa",
  chefRole: "Chef · Itamae",
  ctaLabel: "Conoce nuestra historia",
};

/** Lee un bloque de contenido y lo mezcla sobre sus defaults. Nunca lanza. */
export async function getPageContent<T extends object>(key: string, defaults: T): Promise<T> {
  try {
    const { data } = await createAdminClient().from("page_content").select("data").eq("key", key).maybeSingle();
    const stored = (data?.data ?? {}) as Partial<T>;
    return { ...defaults, ...stored };
  } catch {
    return defaults;
  }
}

export async function setPageContent(key: string, data: object): Promise<void> {
  await createAdminClient()
    .from("page_content")
    .upsert({ key, data, updated_at: new Date().toISOString() }, { onConflict: "key" });
}
