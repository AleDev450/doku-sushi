import type { Metadata } from "next";
import { assertSectionAccess } from "@/lib/rbac";
import ExperienceForm from "@/components/admin/ExperienceForm";

export const metadata: Metadata = { title: "Nueva experiencia · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NuevaExperienciaPage() {
  await assertSectionAccess("experiencias", "edit");
  return <ExperienceForm />;
}
