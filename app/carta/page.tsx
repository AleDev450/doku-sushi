import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import MenuBrowser from "@/components/menu/MenuBrowser";
import { getDishes } from "@/lib/api";

export const metadata: Metadata = {
  title: "Carta",
  description: "Entradas, makis, nigiris, sashimis, platos calientes y postres. La carta Nikkei de Doko.",
};

export default async function CartaPage() {
  const dishes = await getDishes();
  return (
    <>
      <PageHeader
        kicker="お品書き · La carta"
        title={<>La <span className="text-seal">carta.</span></>}
        subtitle="Producto peruano, técnica japonesa. Una selección que cambia con la estación y con lo que llega fresco a la barra."
      />
      <section className="bg-paper py-[100px] text-ink">
        <div className="wrap">
          <MenuBrowser dishes={dishes} />
        </div>
      </section>
    </>
  );
}
