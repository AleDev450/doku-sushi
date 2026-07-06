// Capa de acceso a datos.
//
// Por defecto lee/escribe el store local en /db (ver lib/db.ts), sembrado
// desde la data mock de /data y editable desde el panel admin. En cuanto
// definas NEXT_PUBLIC_API_URL (ver .env.example) estas funciones empezarán a
// pegarle al API de Laravel 12 sin tocar ningún componente ni página.

import type {
  EventDetail,
  EventSummary,
  Dish,
  GalleryImage,
  Testimonial,
  ExperienceDetail,
  ExperienceSummary,
} from "@/lib/types";

import { readTable } from "@/lib/db";

const API = process.env.NEXT_PUBLIC_API_URL;

async function fromApi<T>(path: string): Promise<T | null> {
  if (!API) return null;
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function toSummary(e: EventDetail): EventSummary {
  const { fullDescription, gallery, videos, schedule, guestChef, specialMenu, map, ...rest } = e;
  return rest;
}

/* ----------------------------- Eventos ----------------------------- */

export async function getEvents(): Promise<EventSummary[]> {
  const api = await fromApi<EventSummary[]>("/api/events");
  if (api) return api;
  return (await readTable<EventDetail>("events")).map(toSummary);
}

export async function getUpcomingEvents(): Promise<EventSummary[]> {
  return (await getEvents()).filter((e) => e.status === "upcoming");
}

export async function getEvent(slug: string): Promise<EventDetail | null> {
  const api = await fromApi<EventDetail>(`/api/events/${slug}`);
  if (api) return api;
  return (await readTable<EventDetail>("events")).find((e) => e.slug === slug) ?? null;
}

export async function getEventSlugs(): Promise<string[]> {
  return (await readTable<EventDetail>("events")).map((e) => e.slug);
}

/* ------------------------------ Carta ------------------------------ */

export async function getDishes(): Promise<Dish[]> {
  const api = await fromApi<Dish[]>("/api/dishes");
  if (api) return api;
  return readTable<Dish>("dishes");
}

export async function getFeaturedDishes(): Promise<Dish[]> {
  return (await getDishes()).filter((d) => d.featured);
}

/* ----------------------------- Galería ----------------------------- */

export async function getGallery(): Promise<GalleryImage[]> {
  const api = await fromApi<GalleryImage[]>("/api/gallery");
  if (api) return api;
  return readTable<GalleryImage>("gallery");
}

/* --------------------------- Testimonios --------------------------- */

export async function getTestimonials(): Promise<Testimonial[]> {
  const api = await fromApi<Testimonial[]>("/api/testimonials");
  if (api) return api;
  return readTable<Testimonial>("testimonials");
}

/* --------------------------- Experiencias -------------------------- */

export async function getExperiences(): Promise<ExperienceSummary[]> {
  const api = await fromApi<ExperienceSummary[]>("/api/experiences");
  if (api) return api;
  return (await readTable<ExperienceDetail>("experiences")).map(
    ({ videos, album, topComments, story, ...rest }) => rest
  );
}

export async function getExperience(slug: string): Promise<ExperienceDetail | null> {
  const api = await fromApi<ExperienceDetail>(`/api/experiences/${slug}`);
  if (api) return api;
  return (await readTable<ExperienceDetail>("experiences")).find((e) => e.slug === slug) ?? null;
}

export async function getFeaturedExperience(): Promise<ExperienceDetail | null> {
  const list = await getExperiences();
  if (!list.length) return null;
  return getExperience(list[0].slug);
}

export async function getExperienceSlugs(): Promise<string[]> {
  return (await readTable<ExperienceDetail>("experiences")).map((e) => e.slug);
}
