"use client";

import { HONEYPOT_FIELD } from "@/lib/antibot";

// Campo trampa invisible para humanos: fuera de pantalla, sin tab-stop y sin
// autocompletado del navegador. Un bot que rellena "todo" lo llenará y se delata.
// El valor viaja al servidor, que lo valida con isBotSubmission().
export default function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        No llenes este campo
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
