import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTestimonialById } from "@/lib/api";
import { assertSectionAccess } from "@/lib/rbac";
import TestimonialForm from "@/components/admin/TestimonialForm";

export const metadata: Metadata = { title: "Editar testimonio · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditarTestimonioPage({ params }: { params: { id: string } }) {
  await assertSectionAccess("testimonios", "edit");
  const t = await getTestimonialById(Number(params.id));
  if (!t) notFound();

  return <TestimonialForm initial={t} />;
}
