import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGalleryById } from "@/lib/api";
import { assertSectionAccess } from "@/lib/rbac";
import GalleryForm from "@/components/admin/GalleryForm";

export const metadata: Metadata = { title: "Editar imagen · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditarImagenPage({ params }: { params: { id: string } }) {
  await assertSectionAccess("galeria", "edit");
  const image = await getGalleryById(Number(params.id));
  if (!image) notFound();

  return <GalleryForm initial={image} />;
}
