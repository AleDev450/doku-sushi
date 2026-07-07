import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getExperiences } from "@/lib/api";
import { assertSectionAccess } from "@/lib/rbac";
import ExperienceTable from "@/components/admin/ExperienceTable";

export const metadata: Metadata = { title: "Experiencias · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminExperienciasPage() {
  await assertSectionAccess("experiencias", "view");
  const experiences = await getExperiences();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.9rem] font-semibold">Experiencias</h1>
          <p className="text-[0.9rem] text-mist">{experiences.length} álbumes de eventos</p>
        </div>
        <Link href="/admin/experiencias/nueva" className="btn btn-solid !px-5">
          <Plus size={16} /> Nueva experiencia
        </Link>
      </div>

      <ExperienceTable experiences={experiences} />
    </div>
  );
}
