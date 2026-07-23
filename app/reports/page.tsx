import type { Metadata } from "next";

import { KnowledgeSectionPage } from "@/components/KnowledgeSectionPage";
import { GUIDE_SECTION_META } from "@/lib/guide-sections";

export const metadata: Metadata = {
  title: `${GUIDE_SECTION_META.reports.title} — SmartБотаник`,
  description: GUIDE_SECTION_META.reports.subtitle,
};

export default function ReportsPage() {
  return <KnowledgeSectionPage sectionId="reports" />;
}
