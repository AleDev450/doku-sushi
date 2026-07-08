import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import MenuBrowser from "@/components/menu/MenuBrowser";
import { getDishes } from "@/lib/api";
import { getPageContent, PAGE_HEADERS_DEFAULT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Carta",
  description: "Entradas, makis, nigiris, sashimis, platos calientes y postres. La carta Nikkei de Doko.",
};

export default async function CartaPage() {
  const [dishes, headers] = await Promise.all([getDishes(), getPageContent("page_headers", PAGE_HEADERS_DEFAULT)]);
  const h = headers.carta;
  return (
    <>
      <PageHeader
        kicker={h.kicker}
        title={<>{h.title} <span className="text-seal">{h.highlight}</span></>}
        subtitle={h.subtitle}
      />
      <section className="bg-paper py-[100px] text-ink">
        <div className="wrap">
          <MenuBrowser dishes={dishes} />
        </div>
      </section>
    </>
  );
}
