import type { Metadata } from "next";
import { getPageContent, PAGE_HEADERS_DEFAULT } from "@/lib/content";
import ReservarForm from "@/components/reservar/ReservarForm";

export const metadata: Metadata = {
  title: "Reservar",
  description: "Reserva tu mesa en la barra de Doko. Cocina Nikkei en Lima.",
};

export const dynamic = "force-dynamic";

export default async function ReservarPage() {
  const headers = await getPageContent("page_headers", PAGE_HEADERS_DEFAULT);
  return <ReservarForm header={headers.reservar} />;
}
