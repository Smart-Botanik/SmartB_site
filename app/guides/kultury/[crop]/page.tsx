import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideCultureHub } from "@/components/GuideCultureHub";
import { DEFAULT_CULTURES } from "@/lib/default-cultures";
import {
  loadCultureHubPageData,
  resolveTagSurfaceMediaUrl,
  tagSurfaceSeo,
} from "@/lib/tag-surface";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ crop: string }>;
  searchParams: Promise<{ label?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { crop } = await params;
  const hub = await loadCultureHubPageData({ cultureSlug: crop });
  if (!hub) {
    return { title: "Культура не найдена" };
  }
  const seo = tagSurfaceSeo({
    cultureLabel: hub.cultureLabel,
    seoDescription: hub.seoDescription,
  });
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default async function CultureHubPage({ params, searchParams }: PageProps) {
  const { crop } = await params;
  const { label: activeLabelKey } = await searchParams;

  const hub = await loadCultureHubPageData({
    cultureSlug: crop,
    activeLabelKey,
  });

  if (!hub) {
    notFound();
  }

  return (
    <GuideCultureHub
      cropKind={hub.cropKind}
      cultureLabel={hub.cultureLabel}
      cultureSlug={hub.cultureSlug}
      guides={hub.guides}
      allGuides={hub.allGuides}
      activeLabelKey={activeLabelKey}
      hubLead={hub.hubLead}
      aboutShort={hub.aboutShort}
      heroPreviewUrl={resolveTagSurfaceMediaUrl(hub.heroPreview)}
      labelFilters={hub.labelFilters}
    />
  );
}

export function generateStaticParams() {
  return DEFAULT_CULTURES.map(culture => ({ crop: culture.hubSlug }));
}
