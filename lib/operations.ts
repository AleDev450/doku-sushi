// Reservas, mensajes de contacto y ajustes del sitio. Solo servidor (service_role).

import { createAdminClient } from "@/lib/supabase/admin";
import type {
  Reservation,
  ReservationStatus,
  ContactMessage,
  SiteSettings,
} from "@/lib/types";

/* ----------------------------- Reservas ----------------------------- */

function rowToReservation(r: any): Reservation {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? "",
    date: r.date,
    time: r.time ?? "",
    people: r.people ?? 2,
    eventSlug: r.event_slug ?? null,
    notes: r.notes ?? "",
    status: r.status,
    createdAt: r.created_at,
  };
}

export type ReservationInput = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  people: number;
  eventSlug?: string | null;
  notes: string;
};

export async function createReservation(input: ReservationInput): Promise<Reservation> {
  const { data, error } = await createAdminClient()
    .from("reservations")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      date: input.date,
      time: input.time,
      people: input.people,
      event_slug: input.eventSlug ?? null,
      notes: input.notes,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToReservation(data);
}

export async function listReservations(): Promise<Reservation[]> {
  const { data, error } = await createAdminClient()
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToReservation);
}

export async function updateReservationStatus(id: number, status: ReservationStatus): Promise<Reservation | null> {
  const { data, error } = await createAdminClient()
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? rowToReservation(data) : null;
}

export async function deleteReservation(id: number): Promise<boolean> {
  const { error, count } = await createAdminClient()
    .from("reservations")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw error;
  return (count ?? 0) > 0;
}

/* ----------------------------- Contacto ----------------------------- */

function rowToMessage(r: any): ContactMessage {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    subject: r.subject ?? "",
    message: r.message,
    read: r.read ?? false,
    createdAt: r.created_at,
  };
}

export async function createMessage(input: { name: string; email: string; subject: string; message: string }): Promise<ContactMessage> {
  const { data, error } = await createAdminClient()
    .from("contact_messages")
    .insert({ name: input.name, email: input.email, subject: input.subject, message: input.message })
    .select()
    .single();
  if (error) throw error;
  return rowToMessage(data);
}

export async function listMessages(): Promise<ContactMessage[]> {
  const { data, error } = await createAdminClient()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToMessage);
}

export async function setMessageRead(id: number, read: boolean): Promise<ContactMessage | null> {
  const { data, error } = await createAdminClient()
    .from("contact_messages")
    .update({ read })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data ? rowToMessage(data) : null;
}

export async function deleteMessage(id: number): Promise<boolean> {
  const { error, count } = await createAdminClient()
    .from("contact_messages")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw error;
  return (count ?? 0) > 0;
}

/* ----------------------------- Ajustes ------------------------------ */

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "Doko",
  tagline: "",
  address: "",
  phone: "",
  email: "",
  instagram: "",
  facebook: "",
  hours: "",
};

function rowToSettings(r: any): SiteSettings {
  if (!r) return DEFAULT_SETTINGS;
  return {
    brandName: r.brand_name ?? "Doko",
    tagline: r.tagline ?? "",
    address: r.address ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    instagram: r.instagram ?? "",
    facebook: r.facebook ?? "",
    hours: r.hours ?? "",
  };
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data } = await createAdminClient().from("site_settings").select("*").eq("id", 1).maybeSingle();
    return rowToSettings(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(input: SiteSettings): Promise<SiteSettings> {
  const { data, error } = await createAdminClient()
    .from("site_settings")
    .update({
      brand_name: input.brandName,
      tagline: input.tagline,
      address: input.address,
      phone: input.phone,
      email: input.email,
      instagram: input.instagram,
      facebook: input.facebook,
      hours: input.hours,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return rowToSettings(data);
}

/* --------------------------- Conteos (dashboard) --------------------------- */

export async function tableCount(table: string, filter?: (q: any) => any): Promise<number> {
  let q = createAdminClient().from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}
