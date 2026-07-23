import { GuidesCatalog, loadGuidesCatalogData } from "@/components/GuidesCatalog";

export default async function GuidesPage() {
  const { allGuides, guidesBySection, presentations } = await loadGuidesCatalogData();

  return (
    <GuidesCatalog
      allGuides={allGuides}
      guidesBySection={guidesBySection}
      presentations={presentations}
    />
  );
}
