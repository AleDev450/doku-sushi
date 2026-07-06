"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import type { GalleryImage, GalleryFilter } from "@/lib/types";
import { useLightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

const FILTERS: { key: "all" | GalleryFilter; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "comida", label: "Comida" },
  { key: "eventos", label: "Eventos" },
  { key: "clientes", label: "Clientes" },
  { key: "chef", label: "Chef" },
  { key: "restaurante", label: "Restaurante" },
];

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState<"all" | GalleryFilter>("all");
  const { open } = useLightbox();

  const shown = filter === "all" ? images : images.filter((i) => i.filter === filter);

  return (
    <div>
      <div className="mb-11 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-[18px] py-2 text-[0.76rem] tracking-wide transition-all",
              filter === f.key
                ? "border-seal bg-seal text-white"
                : "border-[var(--line)] text-mist hover:border-white hover:text-white"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid auto-rows-[200px] grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((img) => (
          <motion.figure
            layout
            key={img.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => open(img.full)}
            className={cn(
              "group relative cursor-zoom-in overflow-hidden rounded-md",
              img.span === "tall" && "row-span-2",
              img.span === "wide" && "col-span-2"
            )}
          >
            <Image
              src={img.src}
              alt={img.caption}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-[1000ms] ease-premium group-hover:scale-[1.08]"
            />
            <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-[rgba(10,10,10,0.85)] via-transparent to-transparent p-[18px] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div>
                <span className="block text-[0.72rem] uppercase tracking-[0.14em] text-seal">{img.filter}</span>
                <b className="mt-0.5 block font-display text-[1.05rem] font-semibold">{img.caption}</b>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}
