import { GuidesCatalog, loadGuidesCatalogData } from "@/components/GuidesCatalog";

export const revalidate = 3600;

export default async function GuidesPage() {
  const guidesBySection = await loadGuidesCatalogData();

  return <GuidesCatalog guidesBySection={guidesBySection} />;
}
