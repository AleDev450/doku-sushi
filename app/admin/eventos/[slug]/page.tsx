import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEvent } from "@/lib/api";
import { assertSectionAccess } from "@/lib/rbac";
import EventForm from "@/components/admin/EventForm";

export const metadata: Metadata = { title: "Editar evento · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditarEventoPage({ params }: { params: { slug: string } }) {
  await assertSectionAccess("eventos", "edit");
  const event = await getEvent(params.slug);
  if (!event) notFound();

  return <EventForm initial={event} />;
}
