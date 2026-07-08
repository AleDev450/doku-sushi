import type { Metadata } from "next";
import { assertSectionAccess } from "@/lib/rbac";
import { getPageContent, HOME_HERO_DEFAULT, HOME_ABOUT_DEFAULT } from "@/lib/content";
import HomeContentForm from "@/components/admin/HomeContentForm";

export const metadata: Metadata = { title: "Páginas · Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPaginasPage() {
  await assertSectionAccess("paginas", "view");
  const [hero, about] = await Promise.all([
    getPageContent("home_hero", HOME_HERO_DEFAULT),
    getPageContent("home_about", HOME_ABOUT_DEFAULT),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[1.9rem] font-semibold">Contenido de páginas</h1>
        <p className="text-[0.9rem] text-mist">Edita los textos e imágenes de la home.</p>
      </div>
      <HomeContentForm initialHero={hero} initialAbout={about} />
    </div>
  );
}
