"use client";

import type { Header } from "@/lib/content";

export default function HeaderFields({
  value,
  onChange,
  hideSubtitle,
}: {
  value: Header;
  onChange: (h: Header) => void;
  hideSubtitle?: boolean;
}) {
  const set = (k: keyof Header) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...value, [k]: e.target.value });
  return (
    <div className="space-y-2">
      <input className="field-input" placeholder="Etiqueta (kicker)" value={value.kicker} onChange={set("kicker")} />
      <div className="grid grid-cols-2 gap-2">
        <input className="field-input" placeholder="Título" value={value.title} onChange={set("title")} />
        <input className="field-input" placeholder="Palabra destacada" value={value.highlight} onChange={set("highlight")} />
      </div>
      {!hideSubtitle && (
        <textarea className="field-input resize-none" rows={2} placeholder="Subtítulo" value={value.subtitle} onChange={set("subtitle")} />
      )}
    </div>
  );
}
