import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSuperadmin } from "@/lib/rbac";
import { getSettings } from "@/lib/operations";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Ajustes · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminAjustesPage() {
  if (!(await requireSuperadmin())) redirect("/admin");
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.9rem] font-semibold">Ajustes del sitio</h1>
        <p className="text-[0.9rem] text-mist">Datos de contacto y marca (solo administrador).</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
