"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Testimonial } from "@/lib/types";
import Stars from "@/components/ui/Stars";
import { cn } from "@/lib/utils";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);

  const go = useCallback((n: number) => setI((n + items.length) % items.length), [items.length]);

  useEffect(() => {
    const t = setInterval(() => go(i + 1), 6000);
    return () => clearInterval(t);
  }, [i, go]);

  const t = items[i];

  return (
    <div>
      <div className="relative min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-[820px] text-center"
          >
            <Stars rating={t.rating} className="mb-6 inline-block text-[1.1rem] tracking-[0.25em]" />
            <p className="display text-[clamp(1.5rem,3vw,2.15rem)] font-medium leading-[1.35] text-ink">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-8 flex items-center justify-center gap-3.5">
              <span
                className="h-[50px] w-[50px] rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url('${t.avatar}')` }}
              />
              <div className="text-left">
                <div className="text-[0.96rem] font-semibold text-ink">{t.name}</div>
                <div className="text-[0.75rem] tracking-wide text-neutral-500">{t.role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-11 flex justify-center gap-3">
        {items.map((_, n) => (
          <button
            key={n}
            aria-label={`Testimonio ${n + 1}`}
            onClick={() => go(n)}
            className={cn("h-0.5 w-9 transition-all duration-500", n === i ? "bg-seal" : "bg-black/15")}
          />
        ))}
      </div>
    </div>
  );
}
