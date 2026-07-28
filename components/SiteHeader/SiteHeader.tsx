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
  return `whitespace-nowrap border-b border-transparent pb-1 font-label text-label uppercase transition-[color,box-shadow,border-color] duration-200 ${
    active
      ? "border-primary-container/80 text-on-surface shadow-[0_1px_0_0_var(--color-primary-container),0_4px_10px_-4px_var(--color-accent-glow)]"
      : "text-outline hover:text-on-surface"
  }`;
}

function hashFromHref(href: string): string {
  const hashIndex = href.indexOf("#");
  return hashIndex >= 0 ? href.slice(hashIndex) : "";
}

function pathnameFromHref(href: string): string {
  const hashIndex = href.indexOf("#");
  const path = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  return path === "" ? "/" : path;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  /** Optimistic destination while soft-nav is in flight (avoids «Главная» flash). */
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    // Next soft-nav can apply the hash a tick after pathname updates.
    const timeoutId = window.setTimeout(syncHash, 0);
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);

  // Drop optimistic highlight once the URL matches intent (or on back / stall).
  useEffect(() => {
    if (pendingHref === null) return;

    if (
      pathname === pathnameFromHref(pendingHref) &&
      hash === hashFromHref(pendingHref)
    ) {
      setPendingHref(null);
      return;
    }

    const onPopState = () => setPendingHref(null);
    window.addEventListener("popstate", onPopState);
    const timeoutId = window.setTimeout(() => setPendingHref(null), 2500);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.clearTimeout(timeoutId);
    };
  }, [pathname, hash, pendingHref]);

  const handleNavClick = (href: string) => {
    setPendingHref(href);
    setHash(hashFromHref(href));
    setMenuOpen(false);
  };

  const activePathname = pendingHref ? pathnameFromHref(pendingHref) : pathname;
  const activeHash = pendingHref ? hashFromHref(pendingHref) : hash;

  return (
    <header className="block-header fixed top-0 z-50 w-full border-b border-outline-variant/40 bg-surface/85 backdrop-blur-xl dark:border-outline-variant/20 shadow-sm dark:shadow-md">
      <div className="mx-auto grid h-14 max-w-container-max grid-cols-[auto_1fr_auto] items-center px-gutter md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="flex shrink-0 items-center justify-self-start"
          aria-label="СмартБотаник — на главную"
          onClick={() => handleNavClick("/")}
        >
          <BrandWordmark className="h-7 w-auto sm:h-8" />
        </Link>

        <nav
          className="hidden items-center justify-center gap-5 md:flex md:justify-self-center lg:gap-6"
          aria-label="Основная навигация"
        >
          {SITE_HEADER_NAV_LINKS.map(link => {
            const active = isSiteNavLinkActive(link, activePathname, activeHash);
            return (
              <Link
                key={`${link.href}:${link.label}`}
                href={link.href}
                className={navLinkClassName(active)}
                aria-current={active ? "page" : undefined}
                onClick={() => handleNavClick(link.href)}
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
          className="border-t border-outline-variant/40 bg-surface-container-low px-gutter py-4 md:hidden dark:border-outline-variant/20"
          aria-label="Мобильная навигация"
        >
          <div className="flex flex-col gap-3">
            {SITE_HEADER_NAV_LINKS.map(link => {
              const active = isSiteNavLinkActive(link, activePathname, activeHash);
              return (
                <Link
                  key={`${link.href}:${link.label}`}
                  href={link.href}
                  className={`font-label text-label uppercase ${
                    active ? "text-primary-container" : "text-on-surface-variant"
                  }`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </Link>
              );
            })}
            <SiteHeaderAuth variant="mobile" />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
