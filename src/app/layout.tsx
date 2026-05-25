import type { ReactNode } from "react";
import "leaflet/dist/leaflet.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
