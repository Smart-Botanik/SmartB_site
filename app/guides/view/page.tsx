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
  const { allGuides, guidesBySection, presentations } = await loadGuidesCatalogData();

  return (
    <GuideViewShell>
      <GuidesCatalog
        allGuides={allGuides}
        guidesBySection={guidesBySection}
        presentations={presentations}
        variant="view"
      />
    </GuideViewShell>
  );
}
