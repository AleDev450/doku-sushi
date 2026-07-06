import { cn } from "@/lib/utils";

/** Sello hanko de la marca Doko. */
export default function Seal({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-full bg-seal font-display font-bold text-white",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 6px 24px rgba(227,6,19,0.34)",
      }}
      aria-hidden
    >
      ど
    </span>
  );
}
