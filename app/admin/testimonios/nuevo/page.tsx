import type { Metadata } from "next";
import { assertSectionAccess } from "@/lib/rbac";
import TestimonialForm from "@/components/admin/TestimonialForm";

export const metadata: Metadata = { title: "Nuevo testimonio · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NuevoTestimonioPage() {
  await assertSectionAccess("testimonios", "edit");
  return <TestimonialForm />;
}
