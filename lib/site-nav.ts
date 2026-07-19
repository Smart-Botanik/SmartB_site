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
  { href: "/#latest", label: "Последнее", homeSectionId: "latest" },
  { href: "/#interesting", label: "Полезное", homeSectionId: "interesting" },
  { href: "/guides", label: "Гайды" },
  { href: "/guides#growing", label: "Выращивание", guideSectionId: "growing" },
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
    return pathname.startsWith("/guides/") || (pathname === "/guides" && hash === "");
  }

  if (link.href === "/journal") {
    return pathname.startsWith("/journal");
  }

  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}
