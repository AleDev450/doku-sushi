// Enlaces del navbar público. Compartido por el Navbar y el panel de Ajustes
// (para activar/desactivar cada uno). Sin dependencias de servidor.

export const PUBLIC_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/eventos", label: "Eventos" },
  { href: "/carta", label: "Carta" },
  { href: "/galeria", label: "Galería" },
  { href: "/experiencias", label: "Experiencias" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
] as const;
