// Secciones de contenido del admin que se pueden permisar por rol.
// Compartido por cliente (menú, matriz) y servidor (permisos). Sin deps de server.

export const SECTIONS = [
  { key: "carta", label: "Carta" },
  { key: "blog", label: "Blog" },
  { key: "eventos", label: "Eventos" },
  { key: "galeria", label: "Galería" },
  { key: "experiencias", label: "Experiencias" },
] as const;

export type SectionKey = (typeof SECTIONS)[number]["key"];

export type SectionPerm = { view: boolean; edit: boolean };
export type PermissionMap = Record<string, SectionPerm>;
