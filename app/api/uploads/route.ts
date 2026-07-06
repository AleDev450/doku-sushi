// POST /api/uploads
// Recibe un archivo (multipart/form-data, campo "file"), lo guarda en
// /public/uploads y devuelve { url } con la ruta pública servible.

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

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
  const dir = path.join(process.cwd(), "public", "uploads");

  try {
    await fs.mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, name), bytes);
  } catch {
    return NextResponse.json({ error: "No se pudo guardar el archivo." }, { status: 500 });
  }

  return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
}
