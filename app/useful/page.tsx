import type { Metadata } from "next";

import { KnowledgeSectionPage } from "@/components/KnowledgeSectionPage";
import { GUIDE_SECTION_META } from "@/lib/guide-sections";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `${GUIDE_SECTION_META.interesting.title} — SmartБотаник`,
  description: GUIDE_SECTION_META.interesting.subtitle,
};

export default function UsefulPage() {
  return <KnowledgeSectionPage sectionId="interesting" />;
}
