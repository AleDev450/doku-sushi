import type { EventDetail } from "@/lib/types";

// Data mock. Reemplazable por el API de Laravel sin tocar componentes.
export const events: EventDetail[] = [
  {
    slug: "omakase-a-ciegas",
    title: "Omakase a Ciegas",
    startsAt: "2026-07-18T20:00:00",
    location: "Barra principal",
    shortDescription:
      "Doce tiempos, cero carta. El itamae decide, tú te dejas llevar. Maridaje de sake incluido.",
    cover:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=1400&q=80&auto=format&fit=crop",
    attendeesCount: 32,
    status: "upcoming",
    attendeesPreview: [
      { id: 1, name: "Ana", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=70&auto=format&fit=crop" },
      { id: 2, name: "Lucia", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=70&auto=format&fit=crop" },
      { id: 3, name: "Marco", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=70&auto=format&fit=crop" },
    ],
    fullDescription:
      "Una experiencia de confianza total. Sin menú, sin decisiones: solo tú, la barra y las manos del itamae. Doce tiempos que recorren el mar peruano bajo técnica japonesa, servidos al ritmo que la noche pida. Cada plato se corta y se arma frente a ti. Incluye maridaje progresivo de sake seleccionado por nuestro sommelier.",
    gallery: [
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584583570840-0a3d88497593?w=1000&q=80&auto=format&fit=crop",
    ],
    videos: [
      { thumbnail: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1000&q=80&auto=format&fit=crop", url: "#" },
    ],
    schedule: [
      { time: "20:00", title: "Recepción", detail: "Bienvenida con cóctel de bienvenida a base de pisco y yuzu." },
      { time: "20:30", title: "Primeros tiempos", detail: "Cortes fríos y tiraditos de la barra." },
      { time: "21:30", title: "Tiempos calientes", detail: "Robata y platos de fuego." },
      { time: "22:30", title: "Cierre dulce", detail: "Postre nikkei y sobremesa." },
    ],
    guestChef: {
      name: "Kenji Nakamura",
      role: "Chef · Itamae",
      photo: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&q=80&auto=format&fit=crop",
      bio: "Formado en Tokio y curtido en las cevicherías de Lima. Su cocina es una conversación entre dos mundos.",
    },
    specialMenu: [
      { name: "Tiradito de la casa", description: "Corvina, leche de tigre de ají amarillo, cancha crocante." },
      { name: "Nigiri de toro flameado", description: "Ventresca de atún, ponzu, ralladura de yuzu." },
      { name: "Robata de pulpo", description: "Pulpo al carbón, chimichurri nikkei, puré de aceituna." },
    ],
    map: { lat: -12.123, lng: -77.03, address: "Av. La Mar 1247, Miraflores, Lima" },
  },
  {
    slug: "robata-y-pisco",
    title: "Robata & Pisco",
    startsAt: "2026-07-26T21:00:00",
    location: "Terraza",
    shortDescription:
      "Brasa japonesa al carbón blanco frente al mar de coctelería peruana. DJ set en vivo.",
    cover:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1400&q=80&auto=format&fit=crop",
    attendeesCount: 58,
    status: "upcoming",
    attendeesPreview: [
      { id: 4, name: "Sofia", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&q=70&auto=format&fit=crop" },
      { id: 5, name: "Diego", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=70&auto=format&fit=crop" },
      { id: 6, name: "Rosa", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=70&auto=format&fit=crop" },
    ],
    fullDescription:
      "La terraza se enciende. Robata japonesa sobre carbón binchotan, humo y brasa a cielo abierto, con una barra de coctelería peruana que no se detiene. DJ set en vivo toda la noche. Una fiesta gastronómica donde la brasa y el pisco mandan.",
    gallery: [
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80&auto=format&fit=crop",
    ],
    videos: [
      { thumbnail: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=80&auto=format&fit=crop", url: "#" },
    ],
    schedule: [
      { time: "21:00", title: "Apertura de terraza", detail: "Primeros tragos y DJ set." },
      { time: "21:45", title: "Estación robata", detail: "Brochetas y cortes a la brasa." },
      { time: "23:00", title: "Peak de la noche", detail: "Coctelería de autor y música." },
    ],
    guestChef: null,
    specialMenu: [
      { name: "Anticucho de atún", description: "Atún marinado en ají panca, al carbón." },
      { name: "Maíz robata", description: "Choclo a la brasa, mantequilla de miso." },
    ],
    map: { lat: -12.123, lng: -77.03, address: "Av. La Mar 1247, Miraflores, Lima" },
  },
  {
    slug: "sushi-sunset-vol-4",
    title: "Sushi Sunset Vol. 4",
    startsAt: "2026-06-21T19:00:00",
    location: "Terraza",
    shortDescription:
      "La cuarta edición de nuestra serie insignia. Una noche que nadie quiso terminar.",
    cover:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1400&q=80&auto=format&fit=crop",
    attendeesCount: 112,
    status: "past",
    attendeesPreview: [
      { id: 7, name: "Camila", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=70&auto=format&fit=crop" },
      { id: 8, name: "Jorge", avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&q=70&auto=format&fit=crop" },
      { id: 9, name: "Valeria", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=70&auto=format&fit=crop" },
    ],
    fullDescription:
      "El atardecer sobre la terraza, sushi de barra sin fin y la mejor compañía. La cuarta edición de nuestra serie insignia reunió a 112 personas para una noche que se volvió leyenda. Revive cada momento en el álbum de la experiencia.",
    gallery: [
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=1000&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1000&q=80&auto=format&fit=crop",
    ],
    videos: [
      { thumbnail: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1000&q=80&auto=format&fit=crop", url: "#" },
    ],
    schedule: [
      { time: "19:00", title: "Sunset", detail: "Recepción con vista al atardecer." },
      { time: "20:00", title: "Barra abierta", detail: "Sushi de barra en vivo." },
      { time: "22:00", title: "Música", detail: "Set en vivo hasta el cierre." },
    ],
    guestChef: null,
    specialMenu: [
      { name: "Maki acevichado", description: "Langostino tempura, salsa acevichada." },
    ],
    map: { lat: -12.123, lng: -77.03, address: "Av. La Mar 1247, Miraflores, Lima" },
  },
];
