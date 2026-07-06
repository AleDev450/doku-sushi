import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { getGallery } from "@/lib/api";

export const metadata: Metadata = {
  title: "Galería",
  description: "Comida, eventos, clientes, chef y restaurante. El lente de Doko.",
};

export default async function GaleriaPage() {
  const images = await getGallery();
  return (
    <>
      <PageHeader
        kicker="写真 · Galería"
        title={<>El lente de <span className="text-seal">Doko.</span></>}
        subtitle="Comida, gente y noches. Toca cualquier imagen para verla en grande."
      />
      <section className="bg-ink py-[80px]">
        <div className="wrap">
          <GalleryGrid images={images} />
        </div>
      </section>
    </>
  );
}
