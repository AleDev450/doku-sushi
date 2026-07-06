"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface LightboxCtx {
  open: (src: string) => void;
}

const Ctx = createContext<LightboxCtx>({ open: () => {} });

/** Hook para abrir el lightbox desde cualquier componente cliente. */
export function useLightbox() {
  return useContext(Ctx);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [src, setSrc] = useState<string | null>(null);

  const open = useCallback((s: string) => setSrc(s), []);
  const close = useCallback(() => setSrc(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (src) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [src, close]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {src && (
          <motion.div
            className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-[rgba(6,6,6,0.94)] p-6 backdrop-blur-md md:p-10"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              aria-label="Cerrar"
              className="absolute right-6 top-6 text-white/70 transition-opacity hover:text-white md:right-9 md:top-7"
              onClick={close}
            >
              <X size={30} />
            </button>
            <motion.img
              src={src}
              alt="Vista ampliada"
              className="max-h-[88vh] max-w-[92vw] rounded-md shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
