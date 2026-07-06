"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dish } from "@/lib/types";
import { menuCategories } from "@/data/dishes";
import { useLightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils";

export default function MenuBrowser({ dishes }: { dishes: Dish[] }) {
  const [cat, setCat] = useState("all");
  const { open } = useLightbox();

  const filtered = cat === "all" ? dishes : dishes.filter((d) => d.category === cat);

  return (
    <div>
      <div className="mb-[52px] flex flex-wrap justify-center gap-2">
        {menuCategories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={cn(
              "rounded-full px-[22px] py-2.5 font-body text-[0.8rem] tracking-wide transition-all duration-300 ease-premium",
              cat === c.key
                ? "border border-ink bg-ink text-white"
                : "border border-[var(--line-dark)] text-neutral-500 hover:border-ink hover:text-ink"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((dish) => (
            <motion.div
              key={dish.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => open(dish.image.replace("w=700", "w=1200").replace("q=78", "q=85"))}
                className="group block w-full cursor-zoom-in text-left transition-transform duration-500 ease-premium hover:-translate-y-1.5"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-paper-2">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-premium group-hover:scale-[1.08]"
                  />
                  <div className="absolute bottom-0 right-0 rounded-tl-md bg-ink px-4 py-2 font-display text-[1rem] font-semibold text-white">
                    {dish.price}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3.5 px-1 pt-[18px]">
                  <div>
                    <h4 className="mb-1.5 font-display text-[1.25rem] font-semibold text-ink">{dish.name}</h4>
                    <p className="text-[0.86rem] text-neutral-500">{dish.description}</p>
                  </div>
                  <span className="mt-1 grid h-[34px] w-[34px] flex-shrink-0 place-items-center rounded-full border border-[var(--line-dark)] text-ink transition-all group-hover:border-seal group-hover:bg-seal group-hover:text-white">
                    <Plus size={15} />
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
