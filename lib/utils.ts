// Utilidades compartidas.

/** Une clases condicionalmente (mini-clsx sin dependencia). */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const MESES_LARGOS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** { day: "18", month: "Jul" } para el badge de tarjeta de evento. */
export function eventBadge(iso: string): { day: string; month: string } {
  const d = new Date(iso);
  return { day: String(d.getDate()).padStart(2, "0"), month: MESES[d.getMonth()] };
}

/** "18 de julio, 2026" */
export function longDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} de ${MESES_LARGOS[d.getMonth()]}, ${d.getFullYear()}`;
}

/** "20:00" */
export function timeOf(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/** Estrellas llenas para un rating (redondea a entero). */
export function stars(rating: number): string {
  const full = Math.round(rating);
  return "★★★★★".slice(0, full).padEnd(5, "☆");
}
