"use client";

import { useEffect, useState } from "react";

import { MaterialIcon } from "@/components/MaterialIcon";
import { applySiteTheme, readSiteTheme, type SiteTheme } from "@/lib/site-theme";

export function SiteThemeToggle() {
  const [theme, setTheme] = useState<SiteTheme>("light");

  useEffect(() => {
    setTheme(readSiteTheme());
  }, []);

  function toggleTheme() {
    const next: SiteTheme = theme === "light" ? "dark" : "light";
    applySiteTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant transition-colors hover:border-primary-container/40 hover:bg-surface-container-high hover:text-on-surface dark:border-outline-variant/20 dark:hover:border-primary-container/30"
      aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
      title={theme === "light" ? "Тёмная тема" : "Светлая тема"}
    >
      <MaterialIcon name={theme === "light" ? "dark_mode" : "light_mode"} className="text-[20px]" />
    </button>
  );
}
