// Capa de acceso a datos.
//
// Fuente por prioridad:
//   1. Supabase, si están definidas NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
//   2. Store local en /db (lib/db.ts), como fallback para desarrollo sin Supabase.
//
// Solo corre en el servidor (usa fs y la service_role key). NO lo importes desde
// componentes "use client".

import type {
  EventDetail,
  EventSummary,
  Dish,
  GalleryImage,
  Testimonial,
  ExperienceDetail,
  ExperienceSummary,
} from "@/lib/types";
import { readTable, writeTable, nextId } from "@/lib/db";
import { createAdminClient } from "@/lib/supabase/admin";

function supabaseEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/* -------------------- Mappers DB (snake_case) → app (camelCase) -------------------- */

function rowToDish(r: any): Dish {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    price: r.price,
    category: r.category,
    image: r.image ?? "",
    featured: r.featured ?? false,
  };
}

function rowToEvent(r: any): EventDetail {
  return {
    slug: r.slug,
    title: r.title,
    startsAt: r.starts_at,
    location: r.location ?? "",
    shortDescription: r.short_description ?? "",
    cover: r.cover ?? "",
    attendeesCount: r.attendees_count ?? 0,
    status: r.status,
    attendeesPreview: r.attendees_preview ?? [],
    fullDescription: r.full_description ?? "",
    gallery: r.gallery ?? [],
    videos: r.videos ?? [],
    schedule: r.schedule ?? [],
    guestChef: r.guest_chef ?? null,
    specialMenu: r.special_menu ?? [],
    map: r.map ?? { lat: 0, lng: 0, address: "" },
  };
}

function rowToGallery(r: any): GalleryImage {
  return {
    id: r.id,
    src: r.src,
    full: r.full ?? "",
    caption: r.caption ?? "",
    filter: r.filter,
    span: r.span ?? undefined,
  };
}

function rowToTestimonial(r: any): Testimonial {
  return {
    id: r.id,
    name: r.name,
    role: r.role ?? "",
    avatar: r.avatar ?? "",
    rating: Number(r.rating ?? 5),
    quote: r.quote ?? "",
  };
}

function rowToExperience(r: any): ExperienceDetail {
  return {
    slug: r.slug,
    eventTitle: r.event_title,
    date: r.date ?? "",
    cover: r.cover ?? "",
    rating: Number(r.rating ?? 5),
    reviews: r.reviews ?? 0,
    attendees: r.attendees ?? 0,
    photos: r.photos ?? 0,
    videos: r.videos ?? 0,
    album: r.album ?? [],
    topComments: r.top_comments ?? [],
    story: r.story ?? "",
  };
}

function toSummary(e: EventDetail): EventSummary {
  const { fullDescription, gallery, videos, schedule, guestChef, specialMenu, map, ...rest } = e;
  return rest;
}

function expToSummary(e: ExperienceDetail): ExperienceSummary {
  const { videos, album, topComments, story, ...rest } = e;
  return rest;
}

/* ----------------------------- Eventos ----------------------------- */

export async function getEvents(): Promise<EventSummary[]> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient().from("events").select("*").order("starts_at");
    if (error) throw error;
    return (data ?? []).map(rowToEvent).map(toSummary);
  }
  return (await readTable<EventDetail>("events")).map(toSummary);
}

export async function getUpcomingEvents(): Promise<EventSummary[]> {
  return (await getEvents()).filter((e) => e.status === "upcoming");
}

export async function getEvent(slug: string): Promise<EventDetail | null> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient()
      .from("events").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ? rowToEvent(data) : null;
  }
  return (await readTable<EventDetail>("events")).find((e) => e.slug === slug) ?? null;
}

export async function getEventSlugs(): Promise<string[]> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient().from("events").select("slug");
    if (error) throw error;
    return (data ?? []).map((r: any) => r.slug);
  }
  return (await readTable<EventDetail>("events")).map((e) => e.slug);
}

/* ------------------------------ Carta ------------------------------ */

export async function getDishes(): Promise<Dish[]> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient().from("dishes").select("*").order("id");
    if (error) throw error;
    return (data ?? []).map(rowToDish);
  }
  return readTable<Dish>("dishes");
}

export async function getFeaturedDishes(): Promise<Dish[]> {
  return (await getDishes()).filter((d) => d.featured);
}

export async function getDishById(id: number): Promise<Dish | null> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient()
      .from("dishes").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToDish(data) : null;
  }
  return (await readTable<Dish>("dishes")).find((d) => d.id === id) ?? null;
}

export async function createDish(input: Omit<Dish, "id">): Promise<Dish> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient()
      .from("dishes")
      .insert({
        name: input.name,
        description: input.description,
        price: input.price,
        category: input.category,
        image: input.image,
        featured: input.featured,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToDish(data);
  }
  const dishes = await readTable<Dish>("dishes");
  const dish: Dish = { id: nextId(dishes), ...input };
  dishes.push(dish);
  await writeTable("dishes", dishes);
  return dish;
}

export async function updateDish(id: number, patch: Partial<Omit<Dish, "id">>): Promise<Dish | null> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient()
      .from("dishes").update(patch).eq("id", id).select().maybeSingle();
    if (error) throw error;
    return data ? rowToDish(data) : null;
  }
  const dishes = await readTable<Dish>("dishes");
  const i = dishes.findIndex((d) => d.id === id);
  if (i === -1) return null;
  dishes[i] = { ...dishes[i], ...patch };
  await writeTable("dishes", dishes);
  return dishes[i];
}

export async function deleteDish(id: number): Promise<boolean> {
  if (supabaseEnabled()) {
    const { error, count } = await createAdminClient()
      .from("dishes").delete({ count: "exact" }).eq("id", id);
    if (error) throw error;
    return (count ?? 0) > 0;
  }
  const dishes = await readTable<Dish>("dishes");
  const i = dishes.findIndex((d) => d.id === id);
  if (i === -1) return false;
  dishes.splice(i, 1);
  await writeTable("dishes", dishes);
  return true;
}

/* ----------------------------- Galería ----------------------------- */

export async function getGallery(): Promise<GalleryImage[]> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient().from("gallery").select("*").order("id");
    if (error) throw error;
    return (data ?? []).map(rowToGallery);
  }
  return readTable<GalleryImage>("gallery");
}

/* --------------------------- Testimonios --------------------------- */

export async function getTestimonials(): Promise<Testimonial[]> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient().from("testimonials").select("*").order("id");
    if (error) throw error;
    return (data ?? []).map(rowToTestimonial);
  }
  return readTable<Testimonial>("testimonials");
}

/* --------------------------- Experiencias -------------------------- */

export async function getExperiences(): Promise<ExperienceSummary[]> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient().from("experiences").select("*").order("id");
    if (error) throw error;
    return (data ?? []).map(rowToExperience).map(expToSummary);
  }
  return (await readTable<ExperienceDetail>("experiences")).map(expToSummary);
}

export async function getExperience(slug: string): Promise<ExperienceDetail | null> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient()
      .from("experiences").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ? rowToExperience(data) : null;
  }
  return (await readTable<ExperienceDetail>("experiences")).find((e) => e.slug === slug) ?? null;
}

export async function getFeaturedExperience(): Promise<ExperienceDetail | null> {
  const list = await getExperiences();
  if (!list.length) return null;
  return getExperience(list[0].slug);
}

export async function getExperienceSlugs(): Promise<string[]> {
  if (supabaseEnabled()) {
    const { data, error } = await createAdminClient().from("experiences").select("slug");
    if (error) throw error;
    return (data ?? []).map((r: any) => r.slug);
  }
  return (await readTable<ExperienceDetail>("experiences")).map((e) => e.slug);
}
