export type SiteNavLink = {
  href: string;
  label: string;
  /** Якорь раздела на `/guides` — для подсветки активного пункта */
  guideSectionId?: string;
  /** Якорь раздела на главной — для подсветки активного пункта */
  homeSectionId?: string;
};

export const SITE_HEADER_NAV_LINKS: SiteNavLink[] = [
  { href: "/", label: "Главная" },
  {
    href: "/#news-updates",
    label: "Последнее",
    homeSectionId: "news-updates",
  },
  { href: "/guides", label: "Гайды" },
  { href: "/useful", label: "Полезное" },
  { href: "/calendar", label: "Календарь" },
  { href: "/journal", label: "Журнал" },
];

export function isSiteNavLinkActive(
  link: SiteNavLink,
  pathname: string,
  hash: string,
): boolean {
  if (link.homeSectionId) {
    return pathname === "/" && hash === `#${link.homeSectionId}`;
  }

  if (link.href === "/") {
    return pathname === "/" && hash === "";
  }

  if (link.guideSectionId) {
    return pathname.startsWith("/guides") && hash === `#${link.guideSectionId}`;
  }

  if (link.href === "/guides") {
    return pathname === "/guides" || pathname.startsWith("/guides/");
  }

  if (link.href === "/journal") {
    return pathname.startsWith("/journal");
  }

  if (link.href === "/calendar") {
    return pathname.startsWith("/calendar");
  }

  if (link.href === "/useful") {
    return pathname.startsWith("/useful");
  }

  if (link.href === "/preserving") {
    return pathname.startsWith("/preserving");
  }

  if (link.href === "/reports") {
    return pathname.startsWith("/reports");
  }

  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}
