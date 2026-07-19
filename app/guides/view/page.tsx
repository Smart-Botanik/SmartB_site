import type { Metadata } from "next";

import { GuidesCatalog, loadGuidesCatalogData } from "@/components/GuidesCatalog";
import { GuideViewShell } from "@/components/GuideViewShell";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Гайды и материалы — SmartБотаник",
  description:
    "Руководства по выращиванию, закрутке и репорты — база знаний SmartБотаник.",
};

export default async function GuidesViewPage() {
  const guidesBySection = await loadGuidesCatalogData();

  return (
    <GuideViewShell>
      <GuidesCatalog guidesBySection={guidesBySection} variant="view" />
    </GuideViewShell>
  );
}
