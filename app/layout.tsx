import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

import { SiteChrome } from "@/components/SiteChrome";
import { SiteThemeScript } from "@/components/SiteThemeScript";

import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext", "cyrillic-ext"],
  variable: "--font-hanken",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartБотаник — гайды и гроу-репорты",
  description:
    "Руководства по выращиванию, закрутке и публичные гроу-репорты. Сообщество в Telegram.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${hanken.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <SiteThemeScript />
      </head>
      <body className="min-h-screen bg-background font-body text-on-background antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
