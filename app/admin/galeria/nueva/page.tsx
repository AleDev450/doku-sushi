import type { Metadata } from "next";
import { assertSectionAccess } from "@/lib/rbac";
import GalleryForm from "@/components/admin/GalleryForm";

export const metadata: Metadata = { title: "Nueva imagen · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function NuevaImagenPage() {
  await assertSectionAccess("galeria", "edit");
  return <GalleryForm />;
}
