import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GuideBlocks, GuideCover } from "@/components/GuideBlocks";
import { CROP_KIND_LABELS, fetchPublishedCropGuide } from "@/lib/content-api";

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

  let guide;
  try {
    guide = await fetchPublishedCropGuide(slug);
  } catch {
    notFound();
  }

  if (!guide) {
    notFound();
  }

  return (
    <article className="guide-article">
      <Link href="/guides" className="guide-back">
        ← Все руководства
      </Link>
      <p className="guide-kind">{CROP_KIND_LABELS[guide.cropKind]}</p>
      <h1 className="page-title">{guide.title}</h1>
      {guide.excerpt ? <p className="page-lead">{guide.excerpt}</p> : null}
      <GuideCover cover={guide.cover} />
      <GuideBlocks body={guide.body} />
    </article>
  );
}
