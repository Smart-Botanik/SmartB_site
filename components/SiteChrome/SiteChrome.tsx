"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { isGuideStandaloneView } from "@/lib/guide-view-paths";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneView = isGuideStandaloneView(pathname);

  if (isStandaloneView) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="pt-16">{children}</main>
      <SiteFooter />
    </>
  );
}
