import { SITE_THEME_INIT_SCRIPT } from "@/lib/site-theme";

export function SiteThemeScript() {
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: SITE_THEME_INIT_SCRIPT }}
    />
  );
}
