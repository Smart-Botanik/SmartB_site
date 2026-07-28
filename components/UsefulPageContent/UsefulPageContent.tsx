import {
  fetchPublishedCropGuides,
  fetchPublishedGallery,
  fetchPublishedUsefulGalleries,
  sortPublishedGuides,
} from "@/lib/content-api";
import { GUIDE_SECTION_META, partitionGuidesByKnowledgeSection } from "@/lib/guide-sections";
import { resolveEngagement } from "@/lib/social-api";

import { UsefulFeedClient } from "./UsefulFeedClient";
import {
  USEFUL_FEED_USE_PLACEHOLDERS,
  buildPlaceholderUsefulFeedPosts,
  buildUsefulFeedPosts,
  galleryItemsToFeed,
} from "./useful-feed";

export async function UsefulPageContent() {
  const meta = GUIDE_SECTION_META.interesting;

  const posts = USEFUL_FEED_USE_PLACEHOLDERS
    ? buildPlaceholderUsefulFeedPosts()
    : await loadLiveUsefulFeedPosts();

  const postsWithEngagement = await Promise.all(
    posts.map(async post => {
      const subjectId =
        post.type === "guide"
          ? post.id.replace(/^guide\./, "")
          : post.type === "source"
            ? post.id.replace(/^source\./, "")
            : post.id.replace(/^(video|image)\./, "");
      const subjectType =
        post.type === "guide"
          ? ("GUIDE" as const)
          : ("MEDIA_GALLERY_ITEM" as const);
      const engagement = await resolveEngagement({
        discussionId: post.discussionId,
        subjectType,
        subjectId,
      });
      return { ...post, engagement };
    }),
  );

  return (
    <div className="mx-auto max-w-container-max px-gutter pb-20 pt-10">
      <UsefulFeedClient posts={postsWithEngagement} />
    </div>
  );
}

async function loadLiveUsefulFeedPosts() {
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

  return buildUsefulFeedPosts({
    videos: videoItems,
    photos: photoItems,
    guides: guidesBySection.interesting,
  });
}
