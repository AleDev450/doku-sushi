import type { Metadata } from "next";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LightboxProvider } from "@/components/ui/Lightbox";
import { getSettings } from "@/lib/operations";

const display = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://doko.pe"),
  title: {
    default: "Doko — Experiencia Nikkei",
    template: "%s — Doko",
  },
  description:
    "La experiencia Nikkei que recordarás. Cocina japonesa-peruana contemporánea, eventos y una comunidad para revivir cada noche en Lima.",
  keywords: ["Nikkei", "restaurante", "Lima", "sushi", "omakase", "cocina japonesa peruana", "Doko"],
  openGraph: {
    title: "Doko — Experiencia Nikkei",
    description: "Cocina Nikkei contemporánea en Lima. Descubre eventos, reserva y revive cada experiencia.",
    type: "website",
    locale: "es_PE",
    siteName: "Doko",
  },
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>
        <LightboxProvider>
          <Navbar hidden={settings.navHidden} />
          <main>{children}</main>
          <Footer />
        </LightboxProvider>
      </body>
    </html>
  );
}
