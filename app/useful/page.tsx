import type { Metadata } from "next";

import { UsefulPageContent } from "@/components/UsefulPageContent";
import { GUIDE_SECTION_META } from "@/lib/guide-sections";

export const metadata: Metadata = {
  title: `${GUIDE_SECTION_META.interesting.title} — SmartБотаник`,
  description: GUIDE_SECTION_META.interesting.subtitle,
};

export default function UsefulPage() {
  return <UsefulPageContent />;
}
