import type { Metadata, Viewport } from "next";
import { AdminClient } from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin - EventosThe",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    title: "EventosThe"
  }
};

export const viewport: Viewport = {
  themeColor: "#1463ff"
};

export default function AdminPage() {
  return <AdminClient />;
}
