import type { Metadata } from "next";

import { CalendarPageClient } from "@/components/CalendarPage";
import { fetchPublishedSitePage } from "@/lib/content-api";
import {
  getDefaultCalendarSections,
  parseCalendarSections,
} from "@/lib/calendar-sections";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await fetchPublishedSitePage("calendar");
    return {
      title: page?.seoTitle ?? `Лунный календарь — SmartБотаник`,
      description:
        page?.seoDescription ??
        "Лунный календарь SmartБотаник для работ в саду.",
    };
  } catch {
    return {
      title: "Лунный календарь — SmartБотаник",
      description: "Лунный календарь SmartБотаник для работ в саду.",
    };
  }
}

export default async function CalendarPage() {
  let sections = getDefaultCalendarSections();

  try {
    const page = await fetchPublishedSitePage("calendar");
    sections = parseCalendarSections(page?.sections);
  } catch {
    /* defaults until CMS seed / publish */
  }

  return <CalendarPageClient sections={sections} />;
}
