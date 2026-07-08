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

/* ---- Encabezados (kicker + título + palabra destacada + subtítulo) ---- */
export type Header = { kicker: string; title: string; highlight: string; subtitle: string };

export type HomeSections = {
  eventos: Header;
  experiencias: Header;
  carta: Header;
  galeria: Header;
  testimonios: Header;
};

export const HOME_SECTIONS_DEFAULT: HomeSections = {
  eventos: { kicker: "催し · Agenda", title: "Próximos", highlight: "eventos.", subtitle: "Noches temáticas, chefs invitados y menús que solo existen una vez. Reserva antes de que se agoten." },
  experiencias: { kicker: "思い出 · Álbum digital", title: "Revive cada", highlight: "experiencia.", subtitle: "Cuando la noche termina, el evento no muere: se convierte en un álbum vivo de fotos, videos y voces." },
  carta: { kicker: "お品書き · La carta", title: "Platos", highlight: "destacados.", subtitle: "" },
  galeria: { kicker: "写真 · Galería", title: "El lente de", highlight: "Doko.", subtitle: "Comida, gente y noches. Una ventana sin filtros a lo que se vive dentro." },
  testimonios: { kicker: "お客様の声 · Testimonios", title: "Lo que dicen", highlight: "de nosotros.", subtitle: "" },
};

export type HomeReserva = { image: string; kicker: string; title: string; highlight: string; text: string; button: string };
export const HOME_RESERVA_DEFAULT: HomeReserva = {
  image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1800&q=80&auto=format&fit=crop",
  kicker: "予約 · Reserva",
  title: "Tu mesa te",
  highlight: "espera.",
  text: "Las noches en Doko son limitadas y se agotan rápido. Asegura tu lugar en la barra.",
  button: "Reservar ahora",
};

export type HomeMarquee = { text: string };
export const HOME_MARQUEE_DEFAULT: HomeMarquee = {
  text: "おまかせ Omakase ◈ Tiradito ◈ Nigiri de la barra ◈ Sake & Pisco ◈ Robata ◈ 日本 × Perú ◈ ",
};

export type PageHeaders = {
  carta: Header;
  eventos: Header;
  galeria: Header;
  experiencias: Header;
  blog: Header;
  reservar: Header;
  contacto: Header;
};
export const PAGE_HEADERS_DEFAULT: PageHeaders = {
  carta: { kicker: "お品書き · La carta", title: "La", highlight: "carta.", subtitle: "Producto peruano, técnica japonesa. Una selección que cambia con la estación y con lo que llega fresco a la barra." },
  eventos: { kicker: "催し · Agenda", title: "Nuestros", highlight: "eventos.", subtitle: "Noches temáticas, chefs invitados y menús irrepetibles. Reserva tu lugar o revive los que ya pasaron." },
  galeria: { kicker: "写真 · Galería", title: "El lente de", highlight: "Doko.", subtitle: "Comida, gente y noches. Toca cualquier imagen para verla en grande." },
  experiencias: { kicker: "思い出 · Álbum digital", title: "Revive cada", highlight: "experiencia.", subtitle: "Cuando la noche termina, el evento no muere. Se convierte en un álbum de fotos, videos y voces de quienes estuvieron ahí." },
  blog: { kicker: "読み物 · Blog", title: "Desde la", highlight: "barra.", subtitle: "Historias, técnica y la comunidad que se sienta cada noche en Doko." },
  reservar: { kicker: "予約 · Reserva", title: "Reserva tu", highlight: "mesa.", subtitle: "Las noches en Doko son limitadas. Completa tus datos y confirmamos tu lugar en la barra." },
  contacto: { kicker: "連絡 · Contacto", title: "Hablemos.", highlight: "", subtitle: "¿Una reserva especial, un evento privado o una consulta? Estamos a un mensaje de distancia." },
};

export type AboutPage = {
  headerKicker: string; headerTitle: string; headerHighlight: string;
  conceptKicker: string; conceptTitle: string; conceptImage: string; conceptP1: string; conceptP2: string;
  missionTitle: string; missionText: string; visionTitle: string; visionText: string;
  chefKicker: string; chefName: string; chefRole: string; chefImage: string; chefBio: string; chefQuote: string;
};
export const ABOUT_PAGE_DEFAULT: AboutPage = {
  headerKicker: "私たち · Nuestra historia",
  headerTitle: "Dos culturas, una",
  headerHighlight: "misma barra.",
  conceptKicker: "El concepto",
  conceptTitle: "Nikkei, sin atajos.",
  conceptImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80&auto=format&fit=crop",
  conceptP1: "Doko nació de una obsesión: honrar la técnica milimétrica de la cocina japonesa sin renunciar al fuego, la acidez y el color del Perú. No servimos fusión de moda; servimos el resultado de años entendiendo dos tradiciones que, resulta, siempre hablaron el mismo idioma.",
  conceptP2: "El pescado se corta al momento. El ají amarillo reemplaza al wasabi cuando la noche lo pide. El leche de tigre encuentra su lugar junto al ponzu. Cada plato es una conversación entre el itamae y el mercado limeño de esa mañana.",
  missionTitle: "Cada noche importa",
  missionText: "Convertir una cena en un recuerdo que valga la pena revivir. Que quien se siente en nuestra barra sienta que esa noche fue solo suya.",
  visionTitle: "Una comunidad, no una lista",
  visionText: "Ser el lugar de Lima donde el Nikkei deja de ser un plato y se vuelve un lugar de pertenencia: gente que vuelve, que se reconoce, que revive cada experiencia junta.",
  chefKicker: "El chef",
  chefName: "Kenyo Oyakawa",
  chefRole: "Chef · Itamae",
  chefImage: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=1000&q=80&auto=format&fit=crop",
  chefBio: "Formado en Tokio y curtido en las cevicherías de Lima, entiende la barra como un escenario. Su cocina es precisa pero nunca fría: cada corte tiene intención, cada plato tiene tiempo.",
  chefQuote: "El respeto por el producto es el único idioma que Japón y el Perú siempre compartieron.",
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
