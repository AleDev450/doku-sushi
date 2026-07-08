import type { Metadata } from "next";
import { assertSectionAccess } from "@/lib/rbac";
import {
  getPageContent,
  HOME_HERO_DEFAULT, HOME_ABOUT_DEFAULT, HOME_SECTIONS_DEFAULT,
  HOME_RESERVA_DEFAULT, HOME_MARQUEE_DEFAULT, PAGE_HEADERS_DEFAULT, ABOUT_PAGE_DEFAULT,
} from "@/lib/content";
import PagesEditor from "@/components/admin/PagesEditor";

export const metadata: Metadata = { title: "Páginas · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPaginasPage() {
  await assertSectionAccess("paginas", "view");
  const [hero, about, sections, reserva, marquee, headers, aboutPage] = await Promise.all([
    getPageContent("home_hero", HOME_HERO_DEFAULT),
    getPageContent("home_about", HOME_ABOUT_DEFAULT),
    getPageContent("home_sections", HOME_SECTIONS_DEFAULT),
    getPageContent("home_reserva", HOME_RESERVA_DEFAULT),
    getPageContent("home_marquee", HOME_MARQUEE_DEFAULT),
    getPageContent("page_headers", PAGE_HEADERS_DEFAULT),
    getPageContent("about_page", ABOUT_PAGE_DEFAULT),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.9rem] font-semibold">Contenido de páginas</h1>
        <p className="text-[0.9rem] text-mist">Edita los textos e imágenes de todas tus páginas.</p>
      </div>
      <PagesEditor initial={{ hero, about, sections, reserva, marquee, headers, aboutPage }} />
    </div>
  );
}
