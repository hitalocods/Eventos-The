import type { Metadata, Viewport } from "next";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://eventos-the.web.app"),
  title: "EventosThe",
  description: "Roles com musica ao vivo em Teresina. Veja no mapa onde tem som hoje.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { title: "EventosThe" },
  openGraph: {
    title: "EventosThe",
    description: "Roles com musica ao vivo em Teresina. Veja no mapa onde tem som hoje.",
    images: ["/preview.png"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "EventosThe",
    description: "Roles com musica ao vivo em Teresina. Veja no mapa onde tem som hoje.",
    images: ["/preview.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#1463ff"
};

export default function HomePage() {
  return <HomeClient />;
}
