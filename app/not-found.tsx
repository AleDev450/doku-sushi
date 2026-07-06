import Link from "next/link";
import Seal from "@/components/ui/Seal";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Seal size={56} className="mb-8" />
      <div className="font-display text-[clamp(4rem,14vw,9rem)] font-bold leading-none text-seal">404</div>
      <h1 className="mt-4 font-display text-[1.8rem] font-semibold">Esta página no existe</h1>
      <p className="mt-3 max-w-[380px] text-mist">
        Parece que este plato no está en la carta. Volvamos a la barra principal.
      </p>
      <Link href="/" className="btn btn-solid mt-8 !px-8">Volver al inicio</Link>
    </div>
  );
}
