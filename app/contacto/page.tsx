import type { Metadata } from "next";
import { getPageContent, PAGE_HEADERS_DEFAULT } from "@/lib/content";
import { getSettings } from "@/lib/operations";
import ContactoForm from "@/components/contacto/ContactoForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escríbenos: reservas especiales, eventos privados o cualquier consulta sobre Doko.",
};

export const dynamic = "force-dynamic";

export default async function ContactoPage() {
  const [headers, settings] = await Promise.all([
    getPageContent("page_headers", PAGE_HEADERS_DEFAULT),
    getSettings(),
  ]);
  return <ContactoForm header={headers.contacto} settings={settings} />;
}
