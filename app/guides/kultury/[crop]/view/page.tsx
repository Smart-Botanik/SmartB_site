import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideCultureHubStatic } from "@/components/GuideCultureHub";
import { GuideViewShell } from "@/components/GuideViewShell";
import { DEFAULT_CULTURES } from "@/lib/default-cultures";
import {
  loadCultureHubPageData,
  resolveTagSurfaceMediaUrl,
  tagSurfaceSeo,
} from "@/lib/tag-surface";

type PageProps = {
  params: Promise<{ crop: string }>;
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

export default async function CultureHubViewPage({ params }: PageProps) {
  const { crop } = await params;

  const hub = await loadCultureHubPageData({ cultureSlug: crop });

  if (!hub) {
    notFound();
  }

  return (
    <GuideViewShell>
      <GuideCultureHubStatic
        cropKind={hub.cropKind}
        cultureLabel={hub.cultureLabel}
        cultureSlug={hub.cultureSlug}
        allGuides={hub.allGuides}
        variant="view"
        hubLead={hub.hubLead}
        aboutShort={hub.aboutShort}
        heroPreviewUrl={resolveTagSurfaceMediaUrl(hub.heroPreview)}
        labelFilters={hub.labelFilters}
      />
    </GuideViewShell>
  );
}

export function generateStaticParams() {
  return DEFAULT_CULTURES.map(culture => ({ crop: culture.hubSlug }));
}

export const dynamicParams = false;
