import type { ExperienceDetail } from "@/lib/types";

export const experiences: ExperienceDetail[] = [
  {
    slug: "sushi-sunset-vol-4",
    eventTitle: "Sushi Sunset Vol. 4",
    date: "21 de junio, 2026",
    cover: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1400&q=80&auto=format&fit=crop",
    rating: 4.9,
    reviews: 96,
    attendees: 112,
    photos: 340,
    videos: 18,
    story:
      "El atardecer nos regaló una luz imposible. Entre risas, sake y sushi de barra, la terraza se volvió una sola conversación. Estas son las fotos y voces de quienes estuvieron ahí.",
    album: [
      { id: 1, src: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=75&auto=format&fit=crop", full: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1400&q=85&auto=format&fit=crop" },
      { id: 2, src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&q=75&auto=format&fit=crop", full: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1400&q=85&auto=format&fit=crop", isVideo: true },
      { id: 3, src: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&q=75&auto=format&fit=crop", full: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=1400&q=85&auto=format&fit=crop" },
      { id: 4, src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&q=75&auto=format&fit=crop", full: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1400&q=85&auto=format&fit=crop" },
      { id: 5, src: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=75&auto=format&fit=crop", full: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=1400&q=85&auto=format&fit=crop" },
      { id: 6, src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&q=75&auto=format&fit=crop", full: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1400&q=85&auto=format&fit=crop" },
      { id: 7, src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=75&auto=format&fit=crop", full: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=85&auto=format&fit=crop" },
      { id: 8, src: "https://images.unsplash.com/photo-1584583570840-0a3d88497593?w=500&q=75&auto=format&fit=crop", full: "https://images.unsplash.com/photo-1584583570840-0a3d88497593?w=1400&q=85&auto=format&fit=crop" },
    ],
    topComments: [
      { id: 1, name: "Camila Rivas", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=70&auto=format&fit=crop", rating: 5, likes: 42, text: "El tiradito de la barra fue lo mejor que probé este año. Volví a ver mis fotos tres veces esta semana." },
      { id: 2, name: "Jorge Medina", avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&q=70&auto=format&fit=crop", rating: 5, likes: 28, text: "La atención en la barra, el sake, la música. Una noche redonda. Ya reservé para el Vol. 5." },
    ],
  },
];
