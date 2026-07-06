# Doko — Plataforma Nikkei

Sitio web multipágina para **Doko**, restaurante Nikkei (japonés-peruano) en Lima.
Frontend en **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion**, con
capa de datos **mock** lista para conectarse a un API de Laravel 12 sin tocar componentes.

## Requisitos
- Node.js 18.17+ (recomendado 20 LTS)
- npm

## Puesta en marcha
```bash
npm install
npm run dev
```
Abre http://localhost:3000

## Scripts
- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm start` — servir build
- `npm run lint` — linter

## Estructura
```
app/                 Rutas (App Router)
  page.tsx           Inicio
  nosotros/          Nosotros
  eventos/           Lista + [slug] detalle
  carta/             Carta interactiva
  galeria/           Galería con filtros + lightbox
  experiencias/      Álbumes + [slug] detalle
  contacto/          Contacto + formulario + mapa
  reservar/          Formulario de reserva
  login/             Login (social + correo, UI)
  admin/             Panel: layout propio + dashboard
components/          UI, layout y componentes por dominio
data/                Datos mock (events, dishes, gallery, testimonials, experiences)
lib/
  types.ts           Tipos de dominio (forma del API)
  api.ts             Capa de acceso a datos (mock / API real)
  utils.ts           Utilidades (fechas, clases, etc.)
```

## Conectar el API real (Laravel 12)
1. Copia `.env.example` a `.env.local`.
2. Define `NEXT_PUBLIC_API_URL=https://tu-api` .
3. `lib/api.ts` detecta la variable y deja de usar los mocks automáticamente.
   Los endpoints esperados son `/api/events`, `/api/events/{slug}`, `/api/dishes`,
   `/api/gallery`, `/api/testimonials`, `/api/experiences`, `/api/experiences/{slug}`,
   devolviendo la forma definida en `lib/types.ts`.

## Sistema de diseño
- Paleta: `ink` (negros), `paper` (blancos), `seal` (rojo #E30613).
- Tipografías: Shippori Mincho (display) + Zen Kaku Gothic New (body), vía `next/font`.
- Sello hanko `ど`, etiquetas verticales tategaki y estética dark-luxury.
Tokens y utilidades en `tailwind.config.ts` y `app/globals.css`.

## Notas
- Las imágenes usan Unsplash remoto (configurado en `next.config.mjs`).
  Reemplázalas por las tuyas cuando tengas fotografía propia.
- Los formularios (contacto, reserva, login) son UI con estado local (mock);
  conéctalos a tu backend/WhatsApp Business API cuando corresponda.
