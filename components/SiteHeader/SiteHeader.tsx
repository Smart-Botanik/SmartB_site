"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandWordmark } from "@/components/BrandWordmark";
import { MaterialIcon } from "@/components/MaterialIcon";
import { SiteHeaderAuth } from "@/components/SiteHeaderAuth";
import { SiteThemeToggle } from "@/components/SiteThemeToggle";
import { SITE_HEADER_NAV_LINKS, isSiteNavLinkActive } from "@/lib/site-nav";

function navLinkClassName(active: boolean): string {
  return `whitespace-nowrap font-label text-label uppercase transition-colors ${
    active
      ? "border-b-2 border-primary-container pb-1 font-bold text-primary-container"
      : "text-outline hover:text-on-surface"
  }`;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant/40 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-container-max grid-cols-[auto_1fr_auto] items-center px-gutter md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="flex shrink-0 items-center justify-self-start"
          aria-label="SmartБотanik — на главную"
        >
          <BrandWordmark className="h-8 w-auto sm:h-9" />
        </Link>

        <nav
          className="hidden items-center justify-center gap-5 md:flex md:justify-self-center lg:gap-6"
          aria-label="Основная навигация"
        >
          {SITE_HEADER_NAV_LINKS.map(link => {
            const active = isSiteNavLinkActive(link, pathname, hash);
            return (
              <Link
                key={`${link.href}:${link.label}`}
                href={link.href}
                className={navLinkClassName(active)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-self-end gap-3">
          <SiteThemeToggle />
          <SiteHeaderAuth />

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
          className="border-t border-outline-variant/40 bg-surface-container-low px-gutter py-4 md:hidden"
          aria-label="Мобильная навигация"
        >
          <div className="flex flex-col gap-3">
            {SITE_HEADER_NAV_LINKS.map(link => (
              <Link
                key={`${link.href}:${link.label}`}
                href={link.href}
                className="font-label text-label uppercase text-on-surface-variant"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <SiteHeaderAuth variant="mobile" />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
