import Reveal from "./Reveal";

interface PageHeaderProps {
  kicker: string;
  title: React.ReactNode;
  subtitle?: string;
}

/** Encabezado compacto de páginas internas. Deja espacio para el navbar fijo. */
export default function PageHeader({ kicker, title, subtitle }: PageHeaderProps) {
  return (
    <header className="border-b border-[var(--line)] bg-ink pb-16 pt-[150px]">
      <div className="wrap">
        <Reveal>
          <span className="kicker mb-5 block">{kicker}</span>
          <h1 className="display text-[clamp(2.4rem,5.5vw,4.2rem)] text-white">{title}</h1>
          {subtitle && <p className="mt-5 max-w-[560px] font-light text-[1.05rem] text-mist">{subtitle}</p>}
        </Reveal>
      </div>
    </header>
  );
}
