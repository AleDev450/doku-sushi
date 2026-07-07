import type { Metadata } from "next";
import { assertSectionAccess } from "@/lib/rbac";
import EventForm from "@/components/admin/EventForm";

export const metadata: Metadata = { title: "Nuevo evento · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NuevoEventoPage() {
  await assertSectionAccess("eventos", "edit");
  return <EventForm />;
}
