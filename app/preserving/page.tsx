import type { Metadata } from "next";

import { KnowledgeSectionPage } from "@/components/KnowledgeSectionPage";
import { GUIDE_SECTION_META } from "@/lib/guide-sections";

export const metadata: Metadata = {
  title: `${GUIDE_SECTION_META.preserving.title} — СмартБотаник`,
  description: GUIDE_SECTION_META.preserving.subtitle,
};

export default function PreservingPage() {
  return <KnowledgeSectionPage sectionId="preserving" />;
}
