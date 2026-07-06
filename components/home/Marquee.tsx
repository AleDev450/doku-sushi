const ITEMS = "おまかせ Omakase ◈ Tiradito ◈ Nigiri de la barra ◈ Sake & Pisco ◈ Robata ◈ 日本 × Perú ◈ ";

export default function Marquee() {
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
