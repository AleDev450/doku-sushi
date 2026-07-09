// POST /api/uploads
// Recibe un archivo (multipart/form-data, campo "file") y devuelve { url }.
//
// Destino:
//   - Supabase Storage (bucket 'media', público) si hay credenciales.
//   - /public/uploads (disco local) como fallback en desarrollo sin Supabase.
//     OJO: el disco local NO persiste en Vercel; en producción se usa Supabase.

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const BUCKET = "media";

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

function supabaseEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Detecta el tipo REAL del archivo por sus primeros bytes (magic numbers), sin
// confiar en file.type (que lo manda el navegador y es falsificable). Devuelve
// "image" | "video" | null. Evita que suban HTML/JS/exe disfrazados de imagen.
function sniffKind(b: Buffer): "image" | "video" | null {
  if (b.length < 12) return null;
  const at = (i: number, s: string) => b.toString("latin1", i, i + s.length) === s;

  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image";                       // JPEG
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image";      // PNG
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "image";                       // GIF
  if (at(0, "RIFF") && at(8, "WEBP")) return "image";                                        // WEBP
  if (at(4, "ftyp")) {
    const brand = b.toString("latin1", 8, 12);                                               // ISO-BMFF
    return brand.startsWith("avif") || brand.startsWith("avis") ? "image" : "video";         // AVIF vs MP4/MOV
  }
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return "video";       // WEBM/Matroska
  return null;
}

export async function POST(req: Request) {
  if (!(await requireUser())) {
    return NextResponse.json({ error: "Inicia sesión para subir archivos." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Se esperaba multipart/form-data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo (campo 'file')." }, { status: 400 });
  }

  if (!EXT_BY_TYPE[file.type]) {
    return NextResponse.json(
      { error: `Tipo no permitido: ${file.type || "desconocido"}. Usa imagen o video.` },
      { status: 415 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Archivo muy grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Máx 25 MB.` },
      { status: 413 }
    );
  }

  const ext = path.extname(file.name).toLowerCase() || EXT_BY_TYPE[file.type];
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  // El contenido real debe coincidir con el tipo declarado (anti-disfraz).
  const declaredKind = file.type.startsWith("image/") ? "image" : "video";
  if (sniffKind(bytes) !== declaredKind) {
    return NextResponse.json(
      { error: "El contenido del archivo no coincide con su tipo. Sube una imagen o video real." },
      { status: 415 }
    );
  }

  // --- Supabase Storage ---
  if (supabaseEnabled()) {
    const sb = createAdminClient();
    const { error } = await sb.storage
      .from(BUCKET)
      .upload(name, bytes, { contentType: file.type, upsert: false });
    if (error) {
      return NextResponse.json({ error: `No se pudo subir a Storage: ${error.message}` }, { status: 500 });
    }
    const { data } = sb.storage.from(BUCKET).getPublicUrl(name);
    return NextResponse.json({ url: data.publicUrl }, { status: 201 });
  }

  // --- Fallback local (solo dev sin Supabase) ---
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), bytes);
  } catch {
    return NextResponse.json({ error: "No se pudo guardar el archivo." }, { status: 500 });
  }
  return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
}
