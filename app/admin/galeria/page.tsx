import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getGallery } from "@/lib/api";
import { assertSectionAccess } from "@/lib/rbac";
import GalleryGrid from "@/components/admin/GalleryGrid";

export const metadata: Metadata = { title: "Galería · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminGaleriaPage() {
  await assertSectionAccess("galeria", "view");
  const images = await getGallery();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.9rem] font-semibold">Galería</h1>
          <p className="text-[0.9rem] text-mist">{images.length} imágenes</p>
        </div>
        <Link href="/admin/galeria/nueva" className="btn btn-solid !px-5">
          <Plus size={16} /> Nueva imagen
        </Link>
      </div>

      <GalleryGrid images={images} />
    </div>
  );
}
