"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MaterialIcon } from "@/components/MaterialIcon";
import { siteEnv } from "@/lib/env";

const NAV_LINKS = [
  { href: "/guides", label: "Гайды", match: (path: string) => path.startsWith("/guides") },
  { href: "/journal", label: "Журнал", match: (path: string) => path.startsWith("/journal") },
  { href: "/guides#reports", label: "Репорты", match: (path: string) => false },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-gutter">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/smart-botanik-logo-full.png"
            alt="SmartБотаник"
            width={160}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Основная навигация">
          {NAV_LINKS.map(link => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-label text-label uppercase transition-colors ${
                  active
                    ? "border-b-2 border-primary-container pb-1 font-bold text-primary-container"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={siteEnv.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 rounded-full bg-primary-container px-6 py-2 font-label text-label font-bold text-on-primary-container transition-all hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] active:scale-95 md:inline-flex"
          >
            <MaterialIcon name="send" className="text-[20px]" />
            Telegram
          </a>

          <button
            type="button"
            className="text-on-surface-variant md:hidden"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMenuOpen(open => !open)}
          >
            <MaterialIcon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="border-t border-white/10 bg-surface-container-low px-gutter py-4 md:hidden"
          aria-label="Мобильная навигация"
        >
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-label text-label uppercase text-on-surface-variant"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={siteEnv.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-label text-label text-primary-container"
            >
              <MaterialIcon name="send" className="text-[18px]" />
              Telegram
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
