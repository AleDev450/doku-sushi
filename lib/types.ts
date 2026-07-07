// Tipos de dominio de Doko.
// Reflejan la forma esperada de las respuestas del API de Laravel 12,
// de modo que al conectar el backend real no haya que tocar los componentes.

export type MenuCategory =
  | "entradas"
  | "makis"
  | "nigiris"
  | "sashimis"
  | "calientes"
  | "postres"
  | "bebidas";

export type GalleryFilter =
  | "comida"
  | "eventos"
  | "clientes"
  | "chef"
  | "restaurante";

export interface Attendee {
  id: number;
  name: string;
  avatar: string;
}

export interface EventSummary {
  slug: string;
  title: string;
  /** ISO date, ej. "2026-07-18T20:00:00" */
  startsAt: string;
  location: string;
  shortDescription: string;
  cover: string;
  attendeesCount: number;
  attendeesPreview: Attendee[];
  /** Se deriva de startsAt, pero el API lo entrega listo para la UI. */
  status: "upcoming" | "past";
}

export interface ScheduleItem {
  time: string;
  title: string;
  detail?: string;
}

export interface EventDetail extends EventSummary {
  fullDescription: string;
  gallery: string[];
  videos: { thumbnail: string; url: string }[];
  schedule: ScheduleItem[];
  guestChef: { name: string; role: string; photo: string; bio: string } | null;
  specialMenu: { name: string; description: string }[];
  map: { lat: number; lng: number; address: string };
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: string;
  category: MenuCategory;
  image: string;
  featured?: boolean;
}

export interface GalleryImage {
  id: number;
  src: string;
  full: string;
  caption: string;
  filter: GalleryFilter;
  span?: "tall" | "wide";
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
}

export interface ExperienceComment {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  likes: number;
}

export interface ExperienceSummary {
  slug: string;
  eventTitle: string;
  date: string;
  cover: string;
  rating: number;
  reviews: number;
  attendees: number;
  photos: number;
}

export interface ExperienceDetail extends ExperienceSummary {
  videos: number;
  album: { id: number; src: string; full: string; isVideo?: boolean }[];
  topComments: ExperienceComment[];
  story: string;
}

/* ------------------------------- Blog ------------------------------- */

export type PostStatus = "draft" | "published";

export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  /** Cuerpo del post en Markdown. */
  body: string;
  cover: string;
  author: string;
  tags: string[];
  status: PostStatus;
  /** ISO, o null si aún es borrador. */
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
