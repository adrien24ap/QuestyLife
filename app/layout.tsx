import type { Metadata } from "next";
import { AppNavigation } from "@/components/AppNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuestyLife",
  description: "Tableau de bord personnel sport, nutrition et habitudes"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="app-shell">
          <AppNavigation />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
