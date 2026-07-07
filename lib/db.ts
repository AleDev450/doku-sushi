// Store de datos local basado en archivos JSON.
//
// Es la implementación "local" que usa la app cuando NO hay backend Laravel
// (NEXT_PUBLIC_API_URL sin definir). En la primera lectura, cada tabla se
// siembra automáticamente desde la data mock de /data y a partir de ahí se
// persiste en /db/<tabla>.json, editable desde el panel admin.
//
// Solo se ejecuta en el servidor (Route Handlers y Server Components).
// No lo importes desde componentes con "use client".

import { promises as fs } from "fs";
import path from "path";

import { events } from "@/data/events";
import { dishes } from "@/data/dishes";
import { gallery } from "@/data/gallery";
import { testimonials } from "@/data/testimonials";
import { experiences } from "@/data/experiences";

export type TableName = "events" | "dishes" | "gallery" | "testimonials" | "experiences" | "posts";

const DB_DIR = path.join(process.cwd(), "db");

// Semillas: la data mock actual es la fuente inicial de cada tabla.
const SEEDS: Record<TableName, unknown[]> = {
  events,
  dishes,
  gallery,
  testimonials,
  experiences,
  posts: [], // el blog nace vacío; se llena desde el admin
};

function fileFor(table: TableName): string {
  return path.join(DB_DIR, `${table}.json`);
}

async function ensureSeeded(table: TableName): Promise<string> {
  const file = fileFor(table);
  try {
    await fs.access(file);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(SEEDS[table] ?? [], null, 2), "utf8");
  }
  return file;
}

/** Lee todas las filas de una tabla (sembrando desde /data si aún no existe). */
export async function readTable<T>(table: TableName): Promise<T[]> {
  const file = await ensureSeeded(table);
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as T[];
}

/** Sobrescribe una tabla completa. */
export async function writeTable<T>(table: TableName, rows: T[]): Promise<void> {
  await fs.mkdir(DB_DIR, { recursive: true });
  await fs.writeFile(fileFor(table), JSON.stringify(rows, null, 2), "utf8");
}

/** Siguiente id numérico autoincremental para tablas con `id`. */
export function nextId(rows: { id: number }[]): number {
  return rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
}

/** Convierte un texto en slug url-safe (para eventos/experiencias). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "") // quita acentos (marcas diacríticas)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
