import type { Metadata } from "next";
import DishForm from "@/components/admin/DishForm";

export const metadata: Metadata = { title: "Nuevo plato · Admin", robots: { index: false } };

export default function NuevoPlatoPage() {
  return <DishForm />;
}
