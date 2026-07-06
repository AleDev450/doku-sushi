"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useLightbox } from "@/components/ui/Lightbox";

export function EventGallery({ images }: { images: string[] }) {
  const { open } = useLightbox();
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((src, i) => (
        <button
          key={i}
          onClick={() => open(src)}
          className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-md"
        >
          <Image src={src} alt="" fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]" />
        </button>
      ))}
    </div>
  );
}

export function VideoGrid({ videos }: { videos: { thumbnail: string; url: string }[] }) {
  const { open } = useLightbox();
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {videos.map((v, i) => (
        <button
          key={i}
          onClick={() => open(v.thumbnail)}
          className="group relative aspect-video overflow-hidden rounded-md"
        >
          <Image src={v.thumbnail} alt="" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-[rgba(14,14,14,0.55)] backdrop-blur transition-transform group-hover:scale-110">
              <Play size={20} className="translate-x-0.5 fill-white text-white" />
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
