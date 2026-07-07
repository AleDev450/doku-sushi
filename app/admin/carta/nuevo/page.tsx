import type { Metadata } from "next";
import { assertSectionAccess } from "@/lib/rbac";
import DishForm from "@/components/admin/DishForm";

export const metadata: Metadata = { title: "Nuevo plato · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NuevoPlatoPage() {
  await assertSectionAccess("carta", "edit");
  return <DishForm />;
}
