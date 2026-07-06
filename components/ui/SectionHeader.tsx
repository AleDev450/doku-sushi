import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  kicker: string;
  title: React.ReactNode;
  subtitle?: string;
  link?: { href: string; label: string };
  center?: boolean;
  dark?: boolean; // encabezado sobre fondo oscuro (default) vs claro
}

export default function SectionHeader({
  kicker,
  title,
  subtitle,
  link,
  center = false,
  dark = true,
}: SectionHeaderProps) {
  return (
    <Reveal
      className={cn(
        "mb-14 flex gap-8",
        center ? "flex-col items-center text-center" : "flex-col md:flex-row md:items-end md:justify-between"
      )}
    >
      <div className={cn(center ? "" : "max-w-[640px]")}>
        <span className="kicker mb-5 block">{kicker}</span>
        <h2
          className={cn(
            "display text-[clamp(2.1rem,4vw,3.3rem)]",
            dark ? "text-white" : "text-ink"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={cn("mt-4 max-w-[460px] font-light", dark ? "text-mist" : "text-neutral-500")}>
            {subtitle}
          </p>
        )}
      </div>

      {link && (
        <Link
          href={link.href}
          className="group inline-flex items-center gap-2 whitespace-nowrap pb-1.5 text-[0.8rem] tracking-wide text-mist transition-colors hover:text-white"
        >
          {link.label}
          <ArrowRight size={15} className="transition-transform duration-500 ease-premium group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}
