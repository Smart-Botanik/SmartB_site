import {
  fetchPublishedCropGuides,
  fetchPublishedGallery,
  fetchPublishedUsefulGalleries,
  sortPublishedGuides,
} from "@/lib/content-api";
import { GUIDE_SECTION_META, partitionGuidesByKnowledgeSection } from "@/lib/guide-sections";

import { UsefulFeedClient } from "./UsefulFeedClient";
import { buildUsefulFeedPosts, galleryItemsToFeed } from "./useful-feed";

export async function UsefulPageContent() {
  const meta = GUIDE_SECTION_META.interesting;
  const useful = await fetchPublishedUsefulGalleries();
  const imageGalleryId =
    useful.imageGalleryId?.trim() ||
    process.env.SITE_USEFUL_IMAGE_GALLERY_ID?.trim() ||
    "";
  const videoGalleryId =
    useful.videoGalleryId?.trim() ||
    process.env.SITE_USEFUL_VIDEO_GALLERY_ID?.trim() ||
    "";

  const [imageGallery, videoGallery, guides] = await Promise.all([
    useful.image
      ? Promise.resolve(useful.image)
      : imageGalleryId
        ? fetchPublishedGallery(imageGalleryId)
        : Promise.resolve(null),
    useful.video
      ? Promise.resolve(useful.video)
      : videoGalleryId
        ? fetchPublishedGallery(videoGalleryId)
        : Promise.resolve(null),
    fetchPublishedCropGuides().catch(() => []),
  ]);

  const guidesBySection = partitionGuidesByKnowledgeSection(
    sortPublishedGuides(guides),
  );
  const videoItems = galleryItemsToFeed(videoGallery?.items ?? [], "VIDEO");
  const photoItems = galleryItemsToFeed(imageGallery?.items ?? [], "IMAGE");
  const posts = buildUsefulFeedPosts({
    videos: videoItems,
    photos: photoItems,
    guides: guidesBySection.interesting,
  });

  return (
    <div className="mx-auto max-w-container-max px-gutter pb-20 pt-16">
      <div className="relative mb-10 px-[12px] py-[24px]">
        <div className="hero-gradient absolute inset-0 -z-10" />
        <div className="mb-2 flex flex-col gap-1">
          <span className="font-label text-label uppercase tracking-widest text-primary-fixed-dim">
            Сообщество
          </span>
          <h1 className="font-display text-display text-primary md:text-[64px] md:leading-tight">
            {meta.title}
          </h1>
        </div>
        <p className="max-w-2xl font-body text-on-surface-variant">
          Одна лента: таймлапсы, фото и гайды. Слева — фильтр по типу, чтобы
          быстрее находить полезное.
        </p>
      </div>

      <UsefulFeedClient posts={posts} />
    </div>
  );
}
