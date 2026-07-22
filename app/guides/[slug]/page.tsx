import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideArticleLayout } from "@/components/GuideArticleLayout";
import {
  fetchPublishedCropGuide,
  fetchPublishedCropGuides,
  sortPublishedGuides,
  type CropGuide,
} from "@/lib/content-api";
import { resolveEngagement } from "@/lib/social-api";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const guide = await fetchPublishedCropGuide(slug);
    if (!guide) return { title: "Руководство не найдено" };
    return {
      title: guide.seoTitle ?? guide.title,
      description: guide.seoDescription ?? guide.excerpt ?? undefined,
    };
  } catch {
    return { title: "Руководство" };
  }
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let guide: CropGuide | null | undefined;
  let relatedGuides: CropGuide[] = [];

  try {
    guide = await fetchPublishedCropGuide(slug);
    if (guide) {
      relatedGuides = sortPublishedGuides(await fetchPublishedCropGuides(guide.cropKind));
    }
  } catch {
    notFound();
  }

  if (!guide) {
    notFound();
  }

  const engagement = await resolveEngagement({
    discussionId: guide.discussionId,
    subjectType: "GUIDE",
    subjectId: guide.id,
  });

  return (
    <GuideArticleLayout
      guide={guide}
      relatedGuides={relatedGuides}
      engagement={engagement}
    />
  );
}

export async function generateStaticParams() {
  try {
    const guides = await fetchPublishedCropGuides();
    return guides.map(guide => ({ slug: guide.slug }));
  } catch {
    return [];
  }
}
