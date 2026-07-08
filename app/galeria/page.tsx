import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { getGallery } from "@/lib/api";
import { getPageContent, PAGE_HEADERS_DEFAULT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Galería",
  description: "Comida, eventos, clientes, chef y restaurante. El lente de Doko.",
};

export default async function GaleriaPage() {
  const [images, headers] = await Promise.all([getGallery(), getPageContent("page_headers", PAGE_HEADERS_DEFAULT)]);
  const h = headers.galeria;
  return (
    <>
      <PageHeader
        kicker={h.kicker}
        title={<>{h.title} <span className="text-seal">{h.highlight}</span></>}
        subtitle={h.subtitle}
      />
      <section className="bg-ink py-[80px]">
        <div className="wrap">
          <GalleryGrid images={images} />
        </div>
      </section>
    </>
  );
}
