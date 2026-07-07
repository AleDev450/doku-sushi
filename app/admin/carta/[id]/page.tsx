import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDishes } from "@/lib/api";
import { assertSectionAccess } from "@/lib/rbac";
import DishForm from "@/components/admin/DishForm";

export const metadata: Metadata = { title: "Editar plato · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditarPlatoPage({ params }: { params: { id: string } }) {
  await assertSectionAccess("carta", "edit");
  const dishes = await getDishes();
  const dish = dishes.find((d) => d.id === Number(params.id));
  if (!dish) notFound();

  return <DishForm initial={dish} />;
}
