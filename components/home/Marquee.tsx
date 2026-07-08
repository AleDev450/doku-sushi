import { HOME_MARQUEE_DEFAULT } from "@/lib/content";

export default function Marquee({ text = HOME_MARQUEE_DEFAULT.text }: { text?: string }) {
  const ITEMS = text || HOME_MARQUEE_DEFAULT.text;
  return (
    <div className="overflow-hidden border-y border-[var(--line)] bg-ink py-[18px]" aria-hidden>
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((k) => (
          <span key={k} className="font-display text-[1.1rem] tracking-[0.16em] text-mist-2">
            {ITEMS}
            {ITEMS}
          </span>
        ))}
      </div>
    </div>
  );
}
