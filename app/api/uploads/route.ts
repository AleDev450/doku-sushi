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

export async function POST(req: Request) {
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
