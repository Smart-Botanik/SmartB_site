import type { Metadata } from "next";
import Link from "next/link";

import { siteEnv } from "@/lib/env";

import "./globals.css";

export const metadata: Metadata = {
  title: "Growing App — советы по выращиванию",
  description: "Руководства по выращиванию овощей и приложение для ведения дневника",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <header className="site-header">
          <Link href="/" className="site-logo">
            Growing App
          </Link>
          <nav className="site-nav">
            <Link href="/guides">Руководства</Link>
            <Link href={siteEnv.appBasePath} className="site-nav-cta">
              Открыть приложение
            </Link>
          </nav>
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          <span>© Growing App</span>
        </footer>
      </body>
    </html>
  );
}
