import type { Metadata } from "next";
import "@fontsource-variable/onest";
import "../globals.css";

export const metadata: Metadata = { title: "Админ панел | Урбано Гнездо", robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mk">
      <body className="bg-mist">{children}</body>
    </html>
  );
}
