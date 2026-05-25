import type { Metadata, Viewport } from "next";
import { PatrocinadoresClient } from "./PatrocinadoresClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://eventos-the.web.app"),
  title: "Patrocinadores - EventosThe",
  description:
    "Planos de patrocinio para bares, casas de show, produtores e marcas aparecerem no EventosThe.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { title: "EventosThe" },
  openGraph: {
    title: "Patrocinadores - EventosThe",
    description:
      "Planos de patrocinio para aparecer no mapa de musica ao vivo em Teresina.",
    images: ["/preview.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Patrocinadores - EventosThe",
    description:
      "Planos de patrocinio para aparecer no mapa de musica ao vivo em Teresina.",
    images: ["/preview.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#08245c"
};

export default function PatrocinadoresPage() {
  return <PatrocinadoresClient />;
}
