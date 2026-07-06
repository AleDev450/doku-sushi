"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useLightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

interface AlbumItem {
  id: number;
  src: string;
  full: string;
  isVideo?: boolean;
}

export default function AlbumGrid({ items }: { items: AlbumItem[] }) {
  const { open } = useLightbox();
  return (
    <div className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3">
      {items.map((it, i) => (
        <button
          key={it.id}
          onClick={() => open(it.full)}
          className={cn(
            "group relative block w-full cursor-zoom-in overflow-hidden rounded-md break-inside-avoid",
            i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
          )}
        >
          <Image
            src={it.src}
            alt=""
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
          />
          {it.isVideo && (
            <span className="absolute inset-0 grid place-items-center bg-black/10">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-white/50 bg-[rgba(14,14,14,0.5)] backdrop-blur">
                <Play size={18} className="translate-x-0.5 fill-white text-white" />
              </span>
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
