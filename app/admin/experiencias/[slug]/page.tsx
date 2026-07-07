import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperience } from "@/lib/api";
import { assertSectionAccess } from "@/lib/rbac";
import ExperienceForm from "@/components/admin/ExperienceForm";

export const metadata: Metadata = { title: "Editar experiencia · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditarExperienciaPage({ params }: { params: { slug: string } }) {
  await assertSectionAccess("experiencias", "edit");
  const experience = await getExperience(params.slug);
  if (!experience) notFound();

  return <ExperienceForm initial={experience} />;
}
