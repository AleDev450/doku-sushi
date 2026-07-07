"use client";

import { Plus, Trash2 } from "lucide-react";

type Props<T> = {
  label?: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  addLabel?: string;
  empty?: string;
  render: (item: T, setItem: (v: T) => void, index: number) => React.ReactNode;
};

export default function RepeatableList<T>({
  label,
  items,
  onChange,
  newItem,
  addLabel = "Añadir",
  empty,
  render,
}: Props<T>) {
  const setAt = (i: number, v: T) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const removeAt = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {label && <span className="field-label">{label}</span>}
      <div className="space-y-3">
        {items.length === 0 && empty && <p className="text-[0.8rem] text-mist-2">{empty}</p>}
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-[var(--line)] bg-ink p-3">
            <div className="flex-1">{render(item, (v) => setAt(i, v), i)}</div>
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[var(--line)] text-mist transition-colors hover:border-seal/50 hover:text-seal"
              aria-label="Quitar"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-dashed border-[var(--line)] px-3 py-2 text-[0.8rem] text-mist transition-colors hover:text-white"
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}
