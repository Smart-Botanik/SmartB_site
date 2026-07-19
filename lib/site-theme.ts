export type SiteTheme = "light" | "dark";

export const SITE_THEME_STORAGE_KEY = "site-theme";

export function applySiteTheme(theme: SiteTheme): void {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(SITE_THEME_STORAGE_KEY, theme);
}

export function readSiteTheme(): SiteTheme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export const SITE_THEME_INIT_SCRIPT = `(function(){try{var k="${SITE_THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var t=s==="dark"||s==="light"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;
