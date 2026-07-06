import { cn } from "@/lib/utils";

export default function Stars({ rating = 5, className }: { rating?: number; className?: string }) {
  const full = Math.round(rating);
  return (
    <span className={cn("tracking-[0.15em] text-seal", className)} aria-label={`${rating} de 5`}>
      {"★".repeat(full)}
      <span className="text-white/15">{"★".repeat(5 - full)}</span>
    </span>
  );
}
