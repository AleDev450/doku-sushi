"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** URL actual de la imagen (controlado desde el form). */
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
};

export default function ImageUploader({ value, onChange, label = "Imagen", className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo subir el archivo.");
      onChange(data.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <span className="field-label">{label}</span>

      <div
        className={cn(
          "relative flex min-h-[168px] items-center justify-center overflow-hidden rounded-md border border-dashed border-[var(--line)] bg-ink transition-colors",
          !value && "cursor-pointer hover:border-white/40"
        )}
        onClick={() => !value && inputRef.current?.click()}
      >
        {value ? (
          <>
            <Image src={value} alt="Vista previa" fill sizes="400px" className="object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-seal"
              aria-label="Quitar imagen"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-mist">
            {loading ? (
              <>
                <Loader2 size={26} className="animate-spin text-seal" />
                <span className="text-[0.82rem]">Subiendo…</span>
              </>
            ) : (
              <>
                <UploadCloud size={26} className="text-mist-2" />
                <span className="text-[0.82rem]">Haz clic para subir una imagen</span>
                <span className="text-[0.72rem] text-mist-2">JPG, PNG, WEBP · máx 25 MB</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Campo manual de URL como alternativa */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…o pega una URL de imagen"
        className="field-input mt-2 text-[0.82rem]"
      />

      {error && <p className="mt-2 text-[0.78rem] text-seal">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
